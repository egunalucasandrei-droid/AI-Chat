import { useState, useRef, useEffect } from "react";
import MessageBubble from "./components/MessageBubble";
import InputBox from "./components/InputBox";
import { getGeminiResponse } from "./services/gemini";
import { Loader2, AlertCircle, Sun, Moon } from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I am your AI assistant. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, error]);

  const handleSend = async (text) => {
    setError(null);
    const userMsg = { role: "user", text };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setLoading(true);

    // Auto-Retry logic for handling temporary server overloads (503 errors)
    const fetchResponse = async (retryCount = 0) => {
      try {
        const response = await getGeminiResponse(newMessages);
        setMessages(prev => [...prev, { role: "bot", text: response }]);
        setLoading(false); // Stop loading on success
      } catch (err) {
        if (err.message.includes("503") && retryCount < 2) {
          // If servers are busy, wait 3 seconds and try again silently
          setTimeout(() => fetchResponse(retryCount + 1), 3000);
        } else {
          // If it fails 3 times, or if it's a different error (like 429), show it
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchResponse();
  };

  return (
    <div className={`flex flex-col h-dvh w-full relative overflow-hidden transition-colors duration-500 ${isDarkMode ? "dark bg-black text-white" : "bg-white text-black"}`}>
      
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute inset-0 bg-size-[24px_24px] transition-colors duration-500 ${isDarkMode ? "bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" : "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"}`}></div>
        
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[120px] transition-colors duration-500"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[50%] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[120px] transition-colors duration-500"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-[120px] transition-colors duration-500"></div>
      </div>

      <header className="px-3 sm:px-4 py-3 sm:py-4 pt-[max(env(safe-area-inset-top),0.75rem)] bg-white/80 dark:bg-black/80 backdrop-blur-md border-b dark:border-gray-800 text-center font-bold text-lg sm:text-xl text-blue-600 dark:text-blue-400 shadow-sm relative z-10 flex justify-center items-center transition-colors duration-500">
        <span className="truncate max-w-[60%] sm:max-w-none">AI Chat</span>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="absolute right-2 sm:right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300 text-gray-500 dark:text-gray-400"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 sm:w-6 sm:h-6" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-8 relative z-10 scroll-smooth">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-2 sm:gap-4">
          {messages.map((m, i) => <MessageBubble key={i} message={m} isDarkMode={isDarkMode} />)}

          {loading && (
            <div className="flex justify-start mb-4 sm:mb-6">
              <div className="flex gap-2 sm:gap-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-sm px-4 sm:px-5 py-2 sm:py-3 rounded-2xl sm:rounded-3xl rounded-tl-none items-center text-gray-500 dark:text-gray-400 transition-colors duration-500">
                <Loader2 className="animate-spin text-blue-600 dark:text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-medium">Thinking...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-auto mt-2 w-[95%] sm:w-full max-w-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-sm backdrop-blur-sm transition-colors duration-500">
              <AlertCircle className="shrink-0 w-5 h-5" />
              <span className="text-xs sm:text-sm font-semibold wrap-break-word">
                {/* User-friendly error translator */}
                {error.includes("503") 
                  ? "The AI is a bit busy right now. Please wait a moment and try again!" 
                  : error.includes("429") 
                  ? "You've sent too many messages. Take a 1-minute break and try again!" 
                  : "Something went wrong. Please check your connection or API key."}
              </span>
            </div>
          )}

          <div ref={scrollRef} className="h-2 sm:h-4 shrink-0" />
        </div>
      </main>

      <div className="relative z-10 w-full">
        <InputBox onSend={handleSend} disabled={loading} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}