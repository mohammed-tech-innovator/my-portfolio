import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Terminal } from 'lucide-react';

const cx = (...args) => args.filter(Boolean).join(' ');

// ==========================================
// CONFIGURATION
// ==========================================
// Update this URL to point to your actual AI backend API.
export const AI_API_URL = process.env.REACT_APP_AI_API_URL || 'https://api.example.com/v1/chat';

// Fallback local responses in case the API is offline or not set up yet
const BOT_RESPONSES = {
  'help': 'Available commands: /about, /projects, /research, /contact, /clear',
  'about': 'Mohammed is an AI Research Engineer focused on RL and CV. He graduated from the University of Khartoum with First Class Honours.',
  'projects': 'He has built Hierarchical RL agents, Othello AI (PPO), and CV Autopilots. Check the "projects" section for details!',
  'research': 'His research includes Audio Deepfake Detection and Advanced RL for Othello. See the "research" section for DOIs.',
  'contact': 'You can reach him via the contact form or at mohammed.yah.yousif@gmail.com.',
  'hi': 'Hello! I am Mohammed\'s terminal assistant. Type /help to see what I can do.',
  'hello': 'Hello! I am Mohammed\'s terminal assistant. Type /help to see what I can do.',
};

// ==========================================
// SOUND EFFECTS (Web Audio API)
// ==========================================
const playTone = (frequency, type, duration) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    // Fade out to prevent clicking sounds
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context might be blocked by browser policy until user interaction
  }
};

const playSendSound = () => playTone(600, 'sine', 0.1);
const playReceiveSound = () => {
  playTone(400, 'sine', 0.1);
  setTimeout(() => playTone(600, 'sine', 0.15), 100);
};

export default function ChatAgent({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Connection established. AI Assistant online.' },
    { role: 'bot', text: 'Type /help to see available commands.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    playSendSound();

    const userMsg = input.trim();
    const userMsgLower = userMsg.toLowerCase();
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Handle local clear command immediately
    if (userMsgLower === '/clear' || userMsgLower === 'clear') {
      setIsTyping(false);
      setMessages([{ role: 'bot', text: 'Console cleared.' }]);
      return;
    }

    try {
      // 1. Attempt to fetch from the custom external API
      const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      if (!response.ok) throw new Error('API Offline');

      const data = await response.json();
      
      setIsTyping(false);
      playReceiveSound();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || data.response }]);
      
    } catch (error) {
      // 2. Fallback to local bot if the API fails or isn't set up
      setTimeout(() => {
        let botText = "Command not recognized. Type /help for assistance. (API Offline: Using local fallback)";
        const cmd = userMsgLower.startsWith('/') ? userMsgLower.slice(1) : userMsgLower;
        
        if (BOT_RESPONSES[cmd]) {
          botText = BOT_RESPONSES[cmd];
        }

        setIsTyping(false);
        playReceiveSound();
        setMessages(prev => [...prev, { role: 'bot', text: botText }]);
      }, 600); // Simulate network delay
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-mono">
      {/* Chat Window */}
      {isOpen && (
        <div className={cx(
          'absolute bottom-20 right-0 w-80 md:w-96 h-[450px] rounded-xl shadow-2xl border flex flex-col overflow-hidden transition-all transform scale-100 origin-bottom-right',
          darkMode ? 'bg-[#0d1117] border-gray-700' : 'bg-slate-50 border-slate-300'
        )}>
          {/* Header */}
          <div className={cx(
            'px-4 py-3 border-b flex justify-between items-center',
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-200 border-slate-300'
          )}>
            <div className="flex items-center gap-2">
              <Terminal size={16} className={darkMode ? "text-green-400" : "text-blue-600"} />
              <span className={cx('text-xs font-bold tracking-wider', darkMode ? 'text-gray-300' : 'text-gray-700')}>AI_AGENT.exe</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={cx('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}>
                <div className={cx(
                  'max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed',
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                    : (darkMode ? 'bg-gray-800 text-green-400 rounded-bl-none border border-gray-700 shadow-md' : 'bg-slate-200 text-blue-700 rounded-bl-none border border-slate-300 shadow-md')
                )}>
                  <span className="opacity-50 mr-2 font-bold">{m.role === 'user' ? '>' : '$'}</span>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className={cx(
                  'px-3 py-2 rounded-lg text-xs rounded-bl-none border shadow-md flex items-center gap-1',
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-200 border-slate-300'
                )}>
                  <span className={darkMode ? "text-green-400 opacity-50 font-bold" : "text-blue-700 opacity-50 font-bold"}>$</span>
                  <div className="flex gap-1 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className={cx(
            'p-3 border-t flex gap-2 items-center',
            darkMode ? 'border-gray-700 bg-gray-900' : 'border-slate-300 bg-slate-100'
          )}>
            <span className={cx("font-bold text-sm", darkMode ? "text-green-400" : "text-blue-600")}>&gt;</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a command or message..."
              className={cx(
                'flex-1 bg-transparent text-xs focus:outline-none',
                darkMode ? 'text-gray-200' : 'text-gray-800'
              )}
            />
            <button type="submit" disabled={!input.trim()} className={cx("transition-colors", input.trim() ? "text-blue-500 hover:text-blue-400" : "text-gray-500 cursor-not-allowed")}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) playReceiveSound(); // Play sound when opening
        }}
        className={cx(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 border-2',
          darkMode 
            ? 'bg-blue-600 border-blue-400 text-white shadow-blue-900/50' 
            : 'bg-blue-600 border-blue-700 text-white shadow-blue-500/50'
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        )}
      </button>
    </div>
  );
}
