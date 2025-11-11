import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

const BotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.53 19.47A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zM9.5 9.5a1.5 1.5 0 1 1 1.5 1.5 1.5 1.5 0 0 1-1.5-1.5zm5 0a1.5 1.5 0 1 1 1.5 1.5 1.5 1.5 0 0 1-1.5-1.5zm-2.5 5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2z"/>
    </svg>
);

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === Role.MODEL;

  // A simple markdown-to-html converter
  const formatText = (text: string) => {
    let html = text;
    // Bold: **text** -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Newlines to <br>
    html = html.replace(/\n/g, '<br />');
    return { __html: html };
  };

  return (
    <div className={`flex items-start gap-4 my-4 ${isModel ? '' : 'justify-end'}`}>
      {isModel && <div className="flex-shrink-0 pt-1"><BotIcon /></div>}
      <div className={`max-w-xl md:max-w-2xl px-5 py-3 rounded-2xl shadow-md prose prose-invert prose-p:my-2 ${isModel ? 'bg-gray-800 rounded-tl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
         <div dangerouslySetInnerHTML={formatText(message.text)} />
      </div>
      {!isModel && <div className="flex-shrink-0 pt-1"><UserIcon /></div>}
    </div>
  );
};

export default ChatMessage;
