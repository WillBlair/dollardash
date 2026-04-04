import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import { RoomManager } from "./game.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = join(__dirname, "..", "dist");

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/socket.io")) return next();
    res.sendFile(join(distPath, "index.html"));
  });
}

const rooms = new RoomManager();

io.on("connection", (socket) => {
  console.log(`[connect] ${socket.id}`);

  socket.on("host:create", (callback) => {
    const room = rooms.createRoom(socket.id);
    socket.join(room.code);
    console.log(`[room:created] ${room.code} by ${socket.id}`);

    room.onTick = () => {
      const market = room.getMarketState();
      const leaderboard = room.getLeaderboard();
      io.to(room.code).emit("game:tick", { ...market, leaderboard });
    };

    room.onNews = (event) => {
      io.to(room.code).emit("game:news", event);
    };

    room.onTimer = () => {
      io.to(room.code).emit("game:timer", { timeLeft: room.timeLeft });
    };

    room.onEnd = () => {
      const results = room.getFinalResults();
      io.to(room.code).emit("game:end", { results });
      console.log(`[game:end] ${room.code}`);
    };

    callback({ ok: true, code: room.code });
  });

  socket.on("host:setDuration", ({ seconds }, callback) => {
    const room = findHostRoom(socket.id);
    if (!room) return callback({ ok: false, error: "Room not found" });
    room.setDuration(seconds);
    callback({ ok: true, duration: room.duration });
  });

  socket.on("host:start", (callback) => {
    const room = findHostRoom(socket.id);
    if (!room) return callback({ ok: false, error: "Room not found" });
    if (room.players.size === 0) return callback({ ok: false, error: "Need at least 1 player" });
    room.start();
    io.to(room.code).emit("game:start", {
      market: room.getMarketState(),
      duration: room.duration,
    });
    console.log(`[game:start] ${room.code} with ${room.players.size} players, ${room.duration}s`);
    callback({ ok: true });
  });

  socket.on("host:kick", ({ playerId }, callback) => {
    const room = findHostRoom(socket.id);
    if (!room) return callback({ ok: false, error: "Room not found" });
    room.removePlayer(playerId);
    rooms.playerRooms.delete(playerId);
    io.to(playerId).emit("player:kicked");
    io.to(room.code).emit("lobby:update", { players: room.getPlayerList() });
    callback({ ok: true });
  });

  socket.on("player:join", ({ code, name }, callback) => {
    const trimmedName = (name || "").trim().slice(0, 20);
    if (!trimmedName) return callback({ ok: false, error: "Name is required" });
    if (!code) return callback({ ok: false, error: "Room code is required" });

    const result = rooms.joinRoom(code.toUpperCase(), socket.id, trimmedName);
    if (!result.ok) return callback(result);

    const room = rooms.getRoom(code);
    socket.join(room.code);
    io.to(room.code).emit("lobby:update", { players: room.getPlayerList() });
    console.log(`[player:join] ${trimmedName} → ${room.code}`);
    callback({ ok: true, roomCode: room.code });
  });

  socket.on("player:trade", ({ stockIdx, qty, type }, callback) => {
    const room = rooms.getRoomByPlayer(socket.id);
    if (!room) return callback({ ok: false, error: "Not in a room" });

    const result = room.executeTrade(socket.id, stockIdx, qty, type);
    if (!result.ok) return callback(result);

    const playerState = room.getPlayerState(socket.id);
    callback({ ok: true, ...result, ...playerState });
  });

  socket.on("disconnect", () => {
    const { wasHost, roomCode } = rooms.handleDisconnect(socket.id);
    if (wasHost && roomCode) {
      io.to(roomCode).emit("room:closed");
      console.log(`[room:closed] ${roomCode} (host left)`);
    } else if (roomCode) {
      const room = rooms.getRoom(roomCode);
      if (room) {
        io.to(roomCode).emit("lobby:update", { players: room.getPlayerList() });
      }
    }
    console.log(`[disconnect] ${socket.id}`);
  });
});

function findHostRoom(hostSocketId) {
  for (const room of rooms.rooms.values()) {
    if (room.hostId === hostSocketId) return room;
  }
  return null;
}

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Dollar Dash server running on http://localhost:${PORT}`);
  import("os").then(({ networkInterfaces }) => {
    const nets = networkInterfaces();
    for (const iface of Object.values(nets)) {
      for (const cfg of iface) {
        if (cfg.family === "IPv4" && !cfg.internal) {
          console.log(`   Network: http://${cfg.address}:${PORT}`);
        }
      }
    }
  });
});
