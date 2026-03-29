import { useState } from "react";
import { Send } from "lucide-react";

export default function InputBox({ onSend, disabled, isDarkMode }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-2 py-3 sm:p-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-500 w-full">
      <div className="flex gap-2 sm:gap-3 w-full max-w-4xl mx-auto items-end">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 sm:p-4 text-base min-h-11 sm:min-h-12.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-500 w-full"
          disabled={disabled}
        />
        <button 
          type="submit" 
          disabled={disabled || !text.trim()}
          className="bg-blue-600 dark:bg-blue-500 text-white p-3 sm:p-4 min-h-11 min-w-11 sm:min-h-12.5 sm:min-w-12.5 flex items-center justify-center rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-800 disabled:opacity-50 transition-colors duration-500 shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
