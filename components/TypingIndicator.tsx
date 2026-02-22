import { motion } from "framer-motion";

interface TypingIndicatorProps {
  names: (string | undefined)[];
}

export function TypingIndicator({ names }: TypingIndicatorProps) {
  if (names.length === 0) return null;

  let text = "";
  if (names.length === 1) {
    text = `${names[0]} is typing`;
  } else if (names.length === 2) {
    text = `${names[0]} and ${names[1]} are typing`;
  } else {
    text = `${names[0]} and ${names.length - 1} others are typing`;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
          className="w-1 h-1 bg-muted-foreground rounded-full"
        />
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
          className="w-1 h-1 bg-muted-foreground rounded-full"
        />
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
          className="w-1 h-1 bg-muted-foreground rounded-full"
        />
      </div>
      <span>{text}</span>
    </div>
  );
}