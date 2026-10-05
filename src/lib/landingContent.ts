import { CATEGORIES, type StreamCategory } from "./categories";

// Copy and data for the landing page. Plain language on purpose: visitors are
// people who want to watch or go live, not engineers.

export interface DialStation {
  value: StreamCategory;
  label: string;
  description: string;
  /** Position on the dial, 0 to 100. */
  pos: number;
}

const DESCRIPTIONS: Record<StreamCategory, string> = {
  JUST_CHATTING: "Faces, voices and conversation with whoever is on air.",
  GAMING: "Runs, clutches and co-op chaos, narrated as it happens.",
  SOFTWARE: "People building, fixing and shipping things in real time.",
  SPORTS: "Matches, training and commentary while the ball is in play.",
  OTHER: "Everything that does not fit in a box.",
};

/** One station per category, evenly spaced along the dial. */
export const DIAL_STATIONS: DialStation[] = CATEGORIES.map((c, i) => ({
  value: c.value,
  label: c.label,
  description: DESCRIPTIONS[c.value],
  pos: 10 + i * 20,
}));

export interface Accordion {
  title: string;
  body: string;
}

export const VERBS: Accordion[] = [
  { title: "Watch.", body: "Open any live channel and you are in. No download, no waiting, no payment." },
  { title: "Chat.", body: "Say hello while it happens. Everything is saved, so anyone arriving late can catch up." },
  { title: "Go live.", body: "Allow your camera and microphone, add a title, and you are on air for anyone to find." },
];

export const STEPS: Accordion[] = [
  { title: "Sign up.", body: "A quick account is the only gate. It is free." },
  { title: "Allow camera.", body: "Your browser asks once for your camera and microphone." },
  { title: "Go live.", body: "Add a title, pick a category, press the button." },
];

export const FAQS: Accordion[] = [
  { title: "Does it cost anything?", body: "No. Watching and streaming are both free. There are no subscriptions, trials or paid plans." },
  { title: "Do I need to install anything?", body: "No. It all works in your browser, including going live with your camera and microphone." },
  { title: "How many channels can I have?", body: "One per account, so your name is your address." },
  { title: "Is the chat saved?", body: "Yes. Messages are stored, so someone arriving late can read what was said." },
  { title: "Are the viewer numbers real?", body: "Yes. They count the people actually watching right now, not page views or clicks." },
];

export interface ChatBubble {
  initial: string;
  text: string;
  /** Avatar background (a dark, readable color with white initials). */
  color: string;
  /** Tailwind position classes for desktop; on small screens they flow inline. */
  place: string;
}

// Illustrative lines of chat, not real people. They sit in the margins of the
// "everyone talking at once" paragraph and are hidden from assistive tech.
export const CHAT_BUBBLES: ChatBubble[] = [
  { initial: "M", text: "wait, is this live?", color: "#e8334a", place: "md:left-[4%] md:top-[8%]" },
  { initial: "D", text: "no app, just the tab", color: "#5b2fe0", place: "md:right-[5%] md:top-[14%]" },
  { initial: "K", text: "I came late and saw it all", color: "#0c7a5a", place: "md:left-[9%] md:top-[44%]" },
  { initial: "N", text: "one channel each, nice", color: "#b45309", place: "md:right-[8%] md:top-[50%]" },
  { initial: "T", text: "the number watching is real", color: "#5b2fe0", place: "md:left-[6%] md:bottom-[12%]" },
  { initial: "L", text: "going live tonight", color: "#e8334a", place: "md:right-[6%] md:bottom-[6%]" },
];
