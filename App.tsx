
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, ChatMessage, ProblemCategoryStats, Category, SubCategory, DynamicQuiz } from './types';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import Quiz from './components/Quiz';
import CategoryDisplay from './components/CategoryDisplay';
import CommunityLinks from './components/CommunityLinks';
import LearningStatsDisplay from './components/LearningStatsDisplay'; // Import the new component
import { DEFAULT_REGION, INITIAL_PROBLEM_STATS } from './constants';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const savedChat = localStorage.getItem('chatHistory');
    return savedChat ? JSON.parse(savedChat) : [];
  });
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    const savedRegion = localStorage.getItem('selectedRegion');
    return savedRegion || DEFAULT_REGION;
  });
  const [problemStats, setProblemStats] = useState<ProblemCategoryStats>(() => {
    const savedStats = localStorage.getItem('problemStats');
    return savedStats ? JSON.parse(savedStats) : INITIAL_PROBLEM_STATS;
  });
  const [dynamicQuizzes, setDynamicQuizzes] = useState<DynamicQuiz[]>(() => {
    const savedQuizzes = localStorage.getItem('dynamicQuizzes');
    return savedQuizzes ? JSON.parse(savedQuizzes) : [];
  });

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Save selected region to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedRegion', selectedRegion);
  }, [selectedRegion]);

  // Save problem stats to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('problemStats', JSON.stringify(problemStats));
  }, [problemStats]);

  // Save dynamic quizzes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dynamicQuizzes', JSON.stringify(dynamicQuizzes));
  }, [dynamicQuizzes]);

  const handleProblemCategorized = useCallback((category: Category, subCategory: SubCategory) => {
    setProblemStats((prevStats) => {
      const newStats = { ...prevStats };

      // Ensure category exists
      if (!newStats[category]) {
        // Fallback to 'その他' if category is invalid or new
        newStats['その他'].count++;
        newStats['その他'].subCategories['その他'] = (newStats['その他'].subCategories['その他'] || 0) + 1;
        return newStats;
      }

      newStats[category].count++;
      if (newStats[category].subCategories[subCategory] !== undefined) {
        newStats[category].subCategories[subCategory] = (newStats[category].subCategories[subCategory] || 0) + 1;
      } else {
        // If subCategory is new or invalid for the category, add it under 'その他' for that category or main 'その他'
        newStats[category].subCategories['その他'] = (newStats[category].subCategories['その他'] || 0) + 1;
      }
      return newStats;
    });
  }, []);

  const handleQuizCreated = useCallback((newQuiz: DynamicQuiz) => {
    setDynamicQuizzes((prevQuizzes) => [...prevQuizzes, newQuiz]);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case AppView.CHAT:
        return (
          <ChatInterface
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            onProblemCategorized={handleProblemCategorized}
          />
        );
      case AppView.QUIZ:
        return (
          <Quiz
            dynamicQuizzes={dynamicQuizzes}
            chatHistory={chatHistory}
            onQuizCreated={handleQuizCreated}
          />
        );
      case AppView.DASHBOARD:
        return <CategoryDisplay stats={problemStats} />;
      case AppView.COMMUNITY:
        return <CommunityLinks selectedRegion={selectedRegion} />;
      case AppView.LEARNING_STATS: // New case for learning stats
        return (
          <LearningStatsDisplay
            stats={problemStats}
            dynamicQuizzes={dynamicQuizzes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;
