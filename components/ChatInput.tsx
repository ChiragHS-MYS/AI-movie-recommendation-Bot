import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
);


const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  
  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center p-4 bg-gray-800 border-t border-gray-700">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a number or movie details..."
        disabled={isLoading}
        className="flex-grow bg-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
        className="ml-4 p-3 bg-blue-600 text-white rounded-full disabled:bg-blue-800 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <SendIcon className="w-6 h-6"/>
      </button>
    </div>
  );
};

export default ChatInput;
