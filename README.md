# IRL Streaming Platform — Frontend

> The **web client** for a Twitch-style live streaming platform: watch and broadcast **real-time video** (WebRTC), participate in **live chat** (WebSocket/STOMP), and manage streams — built with **React 19 + TypeScript**.

**This repository contains the FRONTEND** (single-page application).
👉 **Backend (Java · Spring Boot microservices · Kafka) lives here:** [`irl-streaming`](../irl-streaming) · _replace with your GitHub URL, e.g._ `https://github.com/<user>/irl-streaming`

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [How It Connects to the Backend](#-how-it-connects-to-the-backend)
- [Real-Time Features](#-real-time-features)
- [Project Structure](#-project-structure)
- [Application Flow](#-application-flow)
- [Getting Started](#-getting-started)
- [Design Notes](#-design-notes)

---

## 🎯 Overview

This is the user-facing application of the [IRL Streaming Platform](../irl-streaming). It lets users:

- **Register / log in** with JWT-based authentication.
- Browse a **dashboard** of live and offline streams.
- **Broadcast** their own camera & microphone in real time (as the stream owner).
- **Watch** other users' live streams with sub-second latency.
- Chat live with other viewers, per stream.

It talks to a **microservices backend** through an API Gateway — REST for state, WebSocket for chat, and a direct WebRTC connection to the media server for video.

---

## 🧰 Tech Stack

| Concern | Technology |
|---|---|
| **UI library** | React 19 (with the **React Compiler**) |
| **Language** | TypeScript |
| **Build tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **HTTP client** | Axios (centralized instance + JWT interceptor) |
| **Real-time video** | `livekit-client` (WebRTC SFU) |
| **Real-time chat** | `@stomp/stompjs` (STOMP over WebSocket) |
| **JWT handling** | `jose` |
| **Package manager** | Bun |

---

## 🔌 How It Connects to the Backend

The Vite dev server proxies API and WebSocket traffic to the gateway, so the SPA and the backend share an origin during development (no CORS friction):

```ts
// vite.config.ts
server: {
  proxy: {
    "/api": "http://localhost:8080",              // REST  → API Gateway
    "/ws":  { target: "ws://localhost:8080", ws: true }, // WebSocket → Chat service
  },
}
```

- **Authentication:** the JWT returned on login is stored client-side and attached to every request through an Axios interceptor. The token payload is decoded to derive the user's id, username and stream ownership.
- **Streams:** fetched/created/updated via the REST API (`/api/streams`).
- **Video & Chat:** handled over live connections (see below).

---

## ⚡ Real-Time Features

### 🎥 Video (WebRTC via LiveKit)
- Each stream maps to a LiveKit **room** (`stream_{id}`).
- **`LiveKitCamera`** — the owner publishes camera + microphone tracks when going LIVE.
- **`LiveKitPlayer`** — viewers subscribe and render the broadcaster's video track, with adaptive streaming & dynacast enabled.

### 💬 Chat (WebSocket + STOMP)
- **`Chat`** component connects over STOMP, **subscribes to `/topic/stream/{streamId}`** and **publishes to `/app/chat/{streamId}`**.
- Live connection status indicator, auto-scroll, and optimistic send — messages are broadcast to every viewer of the stream in real time.

---

## 📁 Project Structure

```
src/
├── api/            # Typed API clients (auth, streams) over Axios
├── components/     # Chat, StreamVideo, LiveKitCamera, LiveKitPlayer
├── context/        # AuthContext — global auth state (token, user, login/logout)
├── lib/            # axios instance (+ JWT interceptor), livekit helpers
├── pages/          # Landing, Login, Register, Dashboard, StreamView
├── types/          # Shared TypeScript models (auth, stream)
├── App.tsx         # Routes
└── main.tsx        # Entry point
```

---


## 🚀 Getting Started

> The frontend needs the **[backend](../irl-streaming)** running (`docker compose up`) so the `/api` and `/ws` proxies resolve.

### Prerequisites
- [Bun](https://bun.sh) (or npm/pnpm)
- Backend stack up on `localhost:8080` and LiveKit on `localhost:7880`

### Install & run
```bash
bun install
bun run dev
```

The app runs on **http://localhost:5173**.

### Available scripts
| Script | Description |
|---|---|
| `bun run dev` | Start the Vite dev server (HMR) |
| `bun run build` | Type-check + production build |
| `bun run preview` | Preview the production build |
| `bun run lint` | Run ESLint |

---

## 📝 Design Notes

- **Typed end-to-end** — API responses and domain models are described with TypeScript interfaces in `src/types`, keeping the client contract explicit.
- **Separation of concerns** — network access lives in `api/` and `lib/`, global state in `context/`, and views in `pages/`, so components stay focused on rendering.
- **React Compiler** is enabled for automatic memoization, reducing manual `useMemo`/`useCallback` boilerplate.
- **Roadmap:** for production, LiveKit access tokens should be requested from the backend rather than minted client-side — see the backend [roadmap](../irl-streaming#-roadmap).

---

## 👤 Author

Built by **Thomas Brück**.

- 🔗 **Backend repository:** [`irl-streaming`](../irl-streaming) — Java · Spring Boot microservices · Kafka · PostgreSQL · Docker
