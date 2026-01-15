
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Category, SubCategory } from '../types';
import MessageBubble from './MessageBubble';
import Button from './Button';
import RegionSelector from './RegionSelector';
import { generateContentWithGemini, categorizeProblemWithGemini } from '../services/geminiService';
import { DEFAULT_REGION } from '../constants';

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  onProblemCategorized: (category: Category, subCategory: SubCategory) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatHistory,
  setChatHistory,
  selectedRegion,
  onSelectRegion,
  onProblemCategorized,
}) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (userInput.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: userInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const chatPrompt = `あなたは地域課題解決のためのパーソナルトレーナー「LINK」です。以下のユーザーが抱える問題を具体化し、その地域（${selectedRegion}）に特化した実現可能な解決策を提案してください。
      
      ユーザーの問題: ${userInput}`;
      
      const { text: modelResponseText, urls } = await generateContentWithGemini(
        chatPrompt,
        'gemini-3-pro-preview',
        true,
        selectedRegion // Pass region for context data injection
      );

      const problemTag = await categorizeProblemWithGemini(userInput);

      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: modelResponseText || '申し訳ありません、応答を生成できませんでした。',
        urls,
        category: problemTag.category,
        subCategory: problemTag.subCategory,
        originalProblem: userInput,
      };

      setChatHistory((prev) => [...prev, modelMessage]);
      onProblemCategorized(problemTag.category, problemTag.subCategory);

    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: 'エラーが発生しました。もう一度お試しください。',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] lg:h-[calc(100vh-140px)] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <RegionSelector selectedRegion={selectedRegion} onSelectRegion={onSelectRegion} />
      </div>

      <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-3">
        {chatHistory.length === 0 && (
          <div className="flex-grow flex items-center justify-center text-gray-500 text-xl text-center px-4">
            {selectedRegion}の課題について何でもご相談ください！<br/>
            統計データに基づいたアドバイスも可能です。
          </div>
        )}
        {chatHistory.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="self-start bg-gray-200 text-gray-800 my-2 p-3 rounded-xl rounded-bl-none shadow-sm animate-pulse text-lg">
            AIがデータを分析中...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="課題を入力してください..."
          className="flex-grow resize-none border border-gray-300 rounded-md p-2 mr-2 focus:ring-indigo-500 focus:border-indigo-500 text-base md:text-lg h-12 max-h-24 overflow-hidden"
          rows={1}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || userInput.trim() === ''}>
          送信
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
