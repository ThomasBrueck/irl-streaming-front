# IRL Streaming Platform — Frontend

> The **web client** for a Twitch-style live streaming platform: watch and broadcast **real-time video** (WebRTC), participate in **live chat** with history (WebSocket/STOMP), and manage streams — built with **React 19 + TypeScript** on a custom, original light UI ("Say it live").

**This repository contains the FRONTEND** (single-page application).
👉 **Backend (Java · Spring Boot microservices · Kafka) lives here:** [`irl-streaming`](../irl-streaming) · _replace with your GitHub URL, e.g._ `https://github.com/<user>/irl-streaming`

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Design System — "Say it live"](#-design-system--say-it-live)
- [How It Connects to the Backend](#-how-it-connects-to-the-backend)
- [Real-Time Features](#-real-time-features)
- [Project Structure](#-project-structure)
- [Application Flow](#-application-flow)
- [Getting Started](#-getting-started)
- [Design Notes](#-design-notes)

---

## 🎯 Overview

This is the user-facing application of the [IRL Streaming Platform](../irl-streaming). It lets users:

- **Register / log in** with JWT-based authentication (with inline form validation).
- Browse a **dashboard** of live and offline streams — searchable, filterable by category.
- **Broadcast** their own camera & microphone in real time (as the stream owner), with mic/camera mute toggles, and edit, start or end the channel from the watch page.
- **Watch** other users' live streams with picture and sound, a live viewer count, and a link to share.
- **Chat** live with other viewers, per stream — with persisted history for anyone joining late.

It talks to a **microservices backend** through an API Gateway — REST for state, WebSocket for chat, and a direct WebRTC connection to the media server for video (using a **backend-issued token**, never a client-side secret).

---

## 🧰 Tech Stack

| Concern | Technology |
|---|---|
| **UI library** | React 19 (with the **React Compiler**) |
| **Language** | TypeScript |
| **Build tool** | Vite 8, with **route-level code splitting** |
| **Styling** | Tailwind CSS 4 — custom design tokens, no third-party UI kit |
| **Motion** | GSAP + ScrollTrigger (landing page only) |
| **Routing** | React Router 7 |
| **HTTP client** | Axios (centralized instance + JWT interceptor) |
| **Real-time video** | `livekit-client` (WebRTC SFU) |
| **Real-time chat** | `@stomp/stompjs` (STOMP over WebSocket) |
| **JWT handling** | `jose` |
| **Package manager** | Bun |

---

## 🎨 Design System — "Say it live"

One light identity for every screen (landing, log in / sign up, dashboard, watch page), built in
Tailwind v4 with no component kit.

- **Palette:** cool paper `#f2f3f8`, ink `#0c0a14`, a red "tally" for anything live, and a violet signal
  for focus. Stream categories keep five fixed colors.
- **Typography:** Anybody (a variable font whose width and weight grow like a voice getting louder) for
  headlines, Figtree for body text.
- **Shapes:** pills, 2 px ink rules, white "studio" cards with an ink ring, and no photography or video grids.
- **Motion:** GSAP on the landing page; elsewhere small CSS transitions that respect `prefers-reduced-motion`.
- **Components:** feature folders under `src/components/` (`landing`, `auth`, `dashboard`, `watch`) plus a
  small `ui/Icon` set. All tokens live in `src/index.css`.

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

- **Authentication:** the JWT returned on login is stored client-side and attached to every request through an Axios interceptor. The token payload is decoded (and expiry-checked) once, populating a real `AuthContext.user` object — not re-decoded ad hoc around the app.
- **Streams:** fetched/created/updated via the REST API (`/api/streams`), including a typed `StreamCategory`.
- **Media credentials:** the app calls `POST /api/streams/{id}/token` to get a scoped LiveKit token — it never holds or computes a LiveKit secret itself.
- **Chat:** history via `GET /api/chat/{streamId}/history`, live messages over STOMP.

---

## ⚡ Real-Time Features

### 🎥 Video (WebRTC via LiveKit)
- Each stream maps to a LiveKit room; the room name and identity are **whatever the backend's token
  response says** — the client doesn't compute or guess them.
- **`LiveKitCamera`** — the owner requests a token, publishes camera + microphone, and can mute
  either mid-broadcast.
- **`LiveKitPlayer`** — viewers request a (non-publishing) token and subscribe to the broadcaster's picture and sound, with adaptive streaming & dynacast enabled.

### 💬 Chat (WebSocket + STOMP + persisted history)
- On opening a stream, the last 50 messages load over REST so latecomers have context.
- **`Chat`** then connects over STOMP, **subscribes to `/topic/stream/{streamId}`** and **publishes to `/app/chat/{streamId}`**.
- Each user gets a deterministic name color, your own messages are outlined, and a "N new messages" pill appears if you've scrolled up when new ones arrive.

---

## 📁 Project Structure

```
src/
├── api/            # Typed API clients: auth, streams (incl. LiveKit tokens), chat, users
├── components/
│   ├── landing/    # Landing page sections
│   ├── auth/       # Log in / sign up (sentence form, live pass)
│   ├── dashboard/  # Header, account menu, stream results, "Your channel" panel
│   ├── watch/      # Stream stage, signal line, edit dialog
│   ├── ui/         # Icon set
│   └── Chat, LiveKitCamera, LiveKitPlayer
├── context/        # AuthContext + auth-context.ts, ToastContext + toast-context.ts
├── hooks/          # useAuth, useToast, useReducedMotion, usePendulum
├── lib/            # axios instance, jwt, categories, identity, landing/auth helpers, gsap
├── pages/          # Landing, Login, Register, Dashboard, StreamView, NotFound
├── types/          # Shared TypeScript models (auth, stream)
├── index.css       # Design tokens, keyframes and the landing/auth styles
├── App.tsx         # Routes (lazy-loaded Dashboard/StreamView) + guards
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
| `bun run build` | Type-check + production build (code-split by route) |
| `bun run preview` | Preview the production build |
| `bun run lint` | Run ESLint — currently 100% clean |

---

## 📝 Design Notes

- **Typed end-to-end** — API responses and domain models are described with TypeScript interfaces in `src/types`, keeping the client contract explicit.
- **Separation of concerns** — network access lives in `api/` and `lib/`, global state in `context/`+`hooks/`, and views in `pages/`, so components stay focused on rendering.
- **React Compiler** is enabled for automatic memoization, reducing manual `useMemo`/`useCallback` boilerplate.
- **No client-side secrets** — LiveKit access tokens are always requested from the backend; nothing sensitive is bundled into the shipped JS.
- **Strict Hooks hygiene** — this codebase follows a stricter-than-default `eslint-plugin-react-hooks` setup: no `setState` inside a `useEffect` body, no reading refs during render, and context/hook exports are split into dedicated files.
- **Performance** — route-level code splitting: the LiveKit-heavy `StreamView` chunk only loads when a stream is actually opened.

---

## 👤 Author

Built by **Thomas Brück**.

- 🔗 **Backend repository:** [`irl-streaming`](../irl-streaming) — Java · Spring Boot microservices · Kafka · PostgreSQL · Docker
- 💼 Open to frontend / full-stack software engineering opportunities.
