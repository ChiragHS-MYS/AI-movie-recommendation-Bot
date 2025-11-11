import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { Message, Role } from './types';
import { createChatSession } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LoadingIndicator from './components/LoadingIndicator';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: Role.MODEL,
      text: "Welcome to MovieRecs AI! Please select your preferred language by entering a number:\n1. English (Hollywood)\n2. Hindi (Bollywood)\n3. Kannada (Sandalwood)",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const session = createChatSession();
      setChat(session);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to initialize chat session.');
      console.error(e);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    if (!chat) return;

    const newUserMessage: Message = { role: Role.USER, text: userInput };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chat.sendMessage({ message: userInput });
      const modelResponse: Message = { role: Role.MODEL, text: response.text };
      setMessages((prevMessages) => [...prevMessages, modelResponse]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Sorry, something went wrong. ${errorMessage}`);
      console.error(e);
      // Add a message to the chat to inform the user of the error
      const errorResponse: Message = { role: Role.MODEL, text: `I seem to have encountered an error. Please try again. \n\n${errorMessage}` };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          MovieRecs AI
        </h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && (
            <div className="flex items-start gap-4 my-4">
                <div className="flex-shrink-0 pt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a10 10 0 0 0-3.53 19.47A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zM9.5 9.5a1.5 1.5 0 1 1 1.5 1.5 1.5 1.5 0 0 1-1.5-1.5zm5 0a1.5 1.5 0 1 1 1.5 1.5 1.5 1.5 0 0 1-1.5-1.5zm-2.5 5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5-.5h-2z"/>
                    </svg>
                </div>
                <div className="max-w-xl md:max-w-2xl px-5 py-3 rounded-2xl shadow-md bg-gray-800 rounded-tl-none">
                    <LoadingIndicator />
                </div>
            </div>
            )}
            {error && (
            <div className="my-4 text-center p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p>{error}</p>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;
