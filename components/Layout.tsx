
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between z-10 sticky top-0">
        <h1 className="text-xl md:text-2xl font-bold text-indigo-700">
          <span className="text-gray-900">課題解決パーソナルトレーナー</span> 『LINK』
        </h1>
      </header>

      {/* Main Content Area with Explicit White Background Container */}
      <main className="flex-grow container mx-auto px-4 py-6 pb-24 max-w-4xl">
        <div className="bg-white rounded-xl shadow-md min-h-[60vh] overflow-hidden">
          {children}
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 flex justify-around items-center z-20"
        aria-label="メインナビゲーション"
      >
        <Button
          onClick={() => onViewChange(AppView.CHAT)}
          variant={currentView === AppView.CHAT ? 'primary' : 'secondary'}
          baseColor="indigo"
          size="md"
          className="flex-1 mx-1 md:flex-none md:w-auto"
        >
          <span className="block md:hidden">💬</span>
          <span className="hidden md:block">チャット</span>
        </Button>
        <Button
          onClick={() => onViewChange(AppView.QUIZ)}
          variant={currentView === AppView.QUIZ ? 'primary' : 'secondary'}
          baseColor="emerald"
          size="md"
          className="flex-1 mx-1 md:flex-none md:w-auto"
        >
          <span className="block md:hidden">❓</span>
          <span className="hidden md:block">クイズ</span>
        </Button>
        <Button
          onClick={() => onViewChange(AppView.DASHBOARD)}
          variant={currentView === AppView.DASHBOARD ? 'primary' : 'secondary'}
          baseColor="orange"
          size="md"
          className="flex-1 mx-1 md:flex-none md:w-auto"
        >
          <span className="block md:hidden">📊</span>
          <span className="hidden md:block">ダッシュボード</span>
        </Button>
        <Button
          onClick={() => onViewChange(AppView.COMMUNITY)}
          variant={currentView === AppView.COMMUNITY ? 'primary' : 'secondary'}
          baseColor="rose"
          size="md"
          className="flex-1 mx-1 md:flex-none md:w-auto"
        >
          <span className="block md:hidden">🤝</span>
          <span className="hidden md:block">交流</span>
        </Button>
        <Button
          onClick={() => onViewChange(AppView.LEARNING_STATS)}
          variant={currentView === AppView.LEARNING_STATS ? 'primary' : 'secondary'}
          baseColor="cyan"
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
