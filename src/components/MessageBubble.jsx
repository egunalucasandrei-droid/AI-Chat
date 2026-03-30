import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function MessageBubble({ message, isDarkMode }) {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 group`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 transition-colors duration-500 ${isUser ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-800 dark:bg-gray-700"}`}>
          {isUser ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
        </div>
        
        {/* Message Bubble */}
        <div className={`p-4 rounded-2xl transition-colors duration-500 ${
          isUser 
            ? "bg-blue-600 dark:bg-blue-500 text-white rounded-tr-sm" 
            : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700/50 shadow-sm rounded-tl-sm"
        }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.text}</div>
          ) : (
            
            <div className="markdown-body bg-transparent! text-inherit! transition-colors duration-500">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}