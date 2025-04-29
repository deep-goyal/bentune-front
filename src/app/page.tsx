'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaPaperPlane } from 'react-icons/fa';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let response: Response;
      while (true) {
        response = await fetch('https://bentune-backend.onrender.com/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: input }),
        });
        if (response.status === 204) {
          setMessages(prev => [...prev, { role: 'bot', text: 'Thinking...' }]);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        break;
      }

      if (!response.ok) {
        let errorText = response.statusText;
        try {
          const errData = await response.json();
          if (errData.error) errorText = errData.error;
        } catch {}
        throw new Error(errorText);
      }

      const data = await response.json();
      const answer = data.answer ?? 'No response from model.';
      setMessages(prev => [...prev, { role: 'bot', text: answer }]);
    } catch (error: any) {
      let errorMsg = (error as Error).message;
      if (errorMsg.toLowerCase().includes('failed to fetch')) {
        errorMsg = 'Network error: Unable to reach the backend. Please try again.';
      }
      setMessages(prev => [...prev, { role: 'bot', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center p-4 shadow-md">
        <Image src="/logo.png" alt="Logo" width={200} height={200} />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">Thinking...</div>}
      </div>

      <div className="flex items-center p-4 sm:px-2 md:px-4">
        <textarea
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded flex items-center"
          disabled={loading}
        >
          <FaPaperPlane className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
