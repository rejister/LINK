
import React from 'react';
import { AppView } from '../types';
import Button from './Button';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between z-10">
        <h1 className="text-2xl font-bold text-indigo-700">
          <span className="text-gray-900">課題解決パーソナルトレーナー</span> 『LINK』
        </h1>
        {/* Optional: Add a logo or other header elements here */}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-16 max-w-4xl"> {/* Added pb-16 to ensure content clears the fixed footer */}
        {children}
      </main>

      {/* Fixed Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 flex justify-around items-center z-20"
        aria-label="メインナビゲーション" // Added for accessibility
      >
        <Button
          onClick={() => onViewChange(AppView.CHAT)}
          variant={currentView === AppView.CHAT ? 'primary' : 'secondary'}
          baseColor="indigo" // Chat button color
          size="md"
          className="flex-1 mx-1 md:flex-none md:w-auto"
        >
          <span className="block md:hidden">💬</span>
          <span className="hidden md:block">チャット</span>
        </Button>
        <Button
          onClick={() => onViewChange(AppView.QUIZ)}
          variant={currentView === AppView.QUIZ ? 'primary' : 'secondary'}
          baseColor="emerald" // Quiz button color
          size="md"
          className="flex-1 mx-1 md:flex-none md:w-auto"
        >
          <span className="block md:hidden">❓</span>
          <span className="hidden md:block">クイズ</span>
        </Button>
        <Button
          onClick={() => onViewChange(AppView.DASHBOARD)}
          variant={currentView === AppView.DASHBOARD ? 'primary' : 'secondary'}
          baseColor="orange" // Dashboard button color
          size="md"
          className="flex-1 mx-1 md:flex-none md:w-auto"
        >
          <span className="block md:hidden">📊</span>
          <span className="hidden md:block">ダッシュボード</span>
        </Button>
        <Button
          onClick={() => onViewChange(AppView.COMMUNITY)}
          variant={currentView === AppView.COMMUNITY ? 'primary' : 'secondary'}
          baseColor="rose" // Community button color
          size="md"
          className="flex-1 mx-1 md:flex-none md:w-auto"
        >
          <span className="block md:hidden">🤝</span>
          <span className="hidden md:block">交流</span>
        </Button>
        <Button
          onClick={() => onViewChange(AppView.LEARNING_STATS)}
          variant={currentView === AppView.LEARNING_STATS ? 'primary' : 'secondary'}
          baseColor="cyan" // Learning Stats button color
          size="md"
          className="flex-1 mx-1 md:flex-none md:w-auto"
        >
          <span className="block md:hidden">📈</span>
          <span className="hidden md:block">統計</span>
        </Button>
      </nav>
    </div>
  );
};

export default Layout;
