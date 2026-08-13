// Movie-chat entry. Lazy-loads the ChatWidget on the client only.
"use client";

import dynamic from "next/dynamic";
import "./styles/widget.css";

const LazyChatWidget = dynamic(
  () => import("./components/ChatWidget").then((m) => m.ChatWidget),
  { ssr: false }
);

export function ChatWidget(props) {
  return <LazyChatWidget {...props} />;
}

export { useChat } from "./hooks/useChat";
export { MessageBubble } from "./components/MessageBubble";
export { MovieCard, MovieCardSkeleton } from "./components/MovieCard";
export { MovieSlider } from "./components/MovieSlider";
export { TypingIndicator } from "./components/TypingIndicator";
