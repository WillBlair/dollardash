import { useEffect, useRef, useCallback } from "react";

const MAX_CHARS = 300;

function announcementText(event) {
  if (!event?.headline) return "";
  return event.headline.slice(0, MAX_CHARS);
}

/**
 * Speaks the latest news headline via server-side ElevenLabs TTS.
 *
 * Only fires when a genuinely NEW event appears (tracked by headline+timestamp).
 * While one clip is playing, new events are queued — the next fires after the
 * current one ends (no overlapping audio, no spam).
 */
export function useNewsAnnouncer(events, enabled = true) {
  const lastKeyRef = useRef("");
  const busyRef = useRef(false);
  const queueRef = useRef([]);
  const abortRef = useRef(null);
  const audioRef = useRef(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const playNext = useCallback(() => {
    if (!enabledRef.current) { busyRef.current = false; return; }
    const text = queueRef.current.shift();
    if (!text) { busyRef.current = false; return; }

    busyRef.current = true;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const base = (import.meta.env.VITE_SERVER_URL || "").replace(/\/$/, "");

    (async () => {
      let objectUrl = null;
      try {
        const res = await fetch(`${base}/api/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "audio/mpeg" },
          body: JSON.stringify({ text }),
          signal: ac.signal,
        });
        if (!res.ok) { busyRef.current = false; playNext(); return; }

        const blob = await res.blob();
        if (ac.signal.aborted) return;

        objectUrl = URL.createObjectURL(blob);
        const audio = new Audio(objectUrl);
        audioRef.current = audio;

        audio.addEventListener("ended", () => {
          URL.revokeObjectURL(objectUrl);
          audioRef.current = null;
          playNext();
        });
        audio.addEventListener("error", () => {
          URL.revokeObjectURL(objectUrl);
          audioRef.current = null;
          playNext();
        });

        await audio.play();
      } catch (e) {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        if (e.name !== "AbortError") console.warn("[NewsAnnouncer]", e);
        busyRef.current = false;
        playNext();
      }
    })();
  }, []);

  useEffect(() => {
    if (!enabled || !events?.length) return;

    const last = events[events.length - 1];
    const key = `${last.timestamp}|${last.headline}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    const text = announcementText(last);
    if (!text) return;

    // Keep queue short — drop stale headlines
    if (queueRef.current.length >= 2) {
      queueRef.current = [queueRef.current[queueRef.current.length - 1]];
    }
    queueRef.current.push(text);

    if (!busyRef.current) {
      playNext();
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      queueRef.current = [];
      busyRef.current = false;
    };
  }, []);
}
