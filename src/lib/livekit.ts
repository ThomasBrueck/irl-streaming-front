import { SignJWT } from "jose";

const LIVEKIT_URL = "ws://localhost:7880";
const LIVEKIT_API_KEY = "devkey";
const LIVEKIT_API_SECRET = "devsecret";

export function getLiveKitUrl(): string {
  return LIVEKIT_URL;
}

export async function createLiveKitToken(
  identity: string,
  room: string,
  canPublish: boolean
): Promise<string> {
  const secret = new TextEncoder().encode(LIVEKIT_API_SECRET);

  const token = await new SignJWT({
    iss: LIVEKIT_API_KEY,
    sub: identity,
    name: identity,
    video: {
      room: room,
      roomJoin: true,
      canPublish,
      canSubscribe: true,
    },
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return token;
}
