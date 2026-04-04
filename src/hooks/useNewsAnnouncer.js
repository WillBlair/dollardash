import { useEffect, useRef } from "react";

const MAX_CHARS = 500;

function announcementText(event) {
  if (!event?.headline) return "";
  const sym = event.symbol || "Market";
  const sent = (event.sentiment || "update").replace(/_/g, " ");
  return `${sym}. ${sent}. ${event.headline}`.slice(0, MAX_CHARS);
}

/**
 * Calls backend /api/tts (ElevenLabs) when a new headline lands.
 * API key stays on the server only.
 */
export function useNewsAnnouncer(events, enabled = true) {
  const prevKeyRef = useRef("");
  const audioRef = useRef(null);
  const objectUrlRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    if (!events?.length) {
      prevKeyRef.current = "";
      return;
    }

    const last = events[events.length - 1];
    const key = `${last.timestamp}-${last.headline}`;
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    const text = announcementText(last);
    if (!text.trim()) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    const prevAudio = audioRef.current;
    if (prevAudio) {
      prevAudio.pause();
      prevAudio.src = "";
      audioRef.current = null;
    }

    const base = (import.meta.env.VITE_SERVER_URL || "").replace(/\/$/, "");
    const url = `${base}/api/tts`;

    (async () => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "audio/mpeg" },
          body: JSON.stringify({ text }),
          signal: ac.signal,
        });
        if (!res.ok) return;
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        objectUrlRef.current = objectUrl;
        const audio = new Audio(objectUrl);
        audioRef.current = audio;
        audio.addEventListener("ended", () => {
          if (objectUrlRef.current === objectUrl) {
            URL.revokeObjectURL(objectUrl);
            objectUrlRef.current = null;
          }
        });
        await audio.play();
      } catch (e) {
        if (e.name !== "AbortError" && e.name !== "NotAllowedError") {
          console.warn("[NewsAnnouncer]", e);
        }
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
      }
    })();

    return () => {
      ac.abort();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [events, enabled]);
}
