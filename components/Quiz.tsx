
import React, { useState, useCallback } from 'react';
import { DynamicQuiz, ChatMessage, Category, SubCategory } from '../types';
import Button from './Button';
import { generateQuizWithGemini } from '../services/geminiService';

interface QuizProps {
  dynamicQuizzes: DynamicQuiz[];
  chatHistory: ChatMessage[];
  onQuizCreated: (quiz: DynamicQuiz) => void;
}

interface QuizCreationModalProps {
  chatHistory: ChatMessage[];
  onClose: () => void;
  onSelectProblem: (problem: string, category: Category, subCategory: SubCategory) => void;
  isLoading: boolean;
}

const QuizCreationModal: React.FC<QuizCreationModalProps> = ({ chatHistory, onClose, onSelectProblem, isLoading }) => {
  const problemsForQuiz = chatHistory.filter(
    (msg) => msg.role === 'model' && msg.originalProblem && msg.category && msg.subCategory
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn" aria-modal="true" role="dialog">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">クイズ作成の課題を選択</h3>
        {isLoading && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-indigo-600 font-medium">AIが分析してクイズを生成中...</p>
          </div>
        )}
        {!isLoading && problemsForQuiz.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            クイズの種になる課題がまだありません。<br/>まずはチャットで相談してみましょう。
          </p>
        ) : !isLoading && (
          <ul className="max-h-80 overflow-y-auto space-y-3 mb-4">
            {problemsForQuiz.map((msg) => (
              <li key={msg.id} className="border border-gray-100 rounded-lg p-4 hover:bg-indigo-50 cursor-pointer transition-colors"
                  onClick={() => onSelectProblem(msg.originalProblem!, msg.category as Category, msg.subCategory as SubCategory)}>
                <p className="font-semibold text-gray-800 line-clamp-2">{msg.originalProblem}</p>
                <p className="text-xs text-indigo-600 mt-2 font-medium">{msg.category} > {msg.subCategory}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="secondary">
            閉じる
          </Button>
        </div>
      </div>
    </div>
  );
};

const Quiz: React.FC<QuizProps> = ({ dynamicQuizzes, chatHistory, onQuizCreated }) => {
  const [currentQuiz, setCurrentQuiz] = useState<DynamicQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const handleStartQuiz = (quiz: DynamicQuiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleOptionClick = (index: number) => {
    if (!showExplanation) {
      setSelectedOptionIndex(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex !== null && currentQuiz) {
      setShowExplanation(true);
      if (selectedOptionIndex === currentQuiz.questions[currentQuestionIndex].correctAnswerIndex) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuiz) {
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptionIndex(null);
        setShowExplanation(false);
      } else {
        setQuizFinished(true);
      }
    }
  };

  const handleBackToQuizList = () => {
    setCurrentQuiz(null);
  };

  const handleCreateNewQuiz = useCallback(async (problem: string, category: Category, subCategory: SubCategory) => {
    setShowCreationModal(false);
    setIsGeneratingQuiz(true);
    try {
      const questions = await generateQuizWithGemini(problem, category, subCategory);
      const newQuiz: DynamicQuiz = {
        id: Date.now().toString(),
        title: `${category}クイズ`,
        questions: questions.map((q,idx) => ({...q, id: q.id || `${Date.now()}-${idx}`})),
        basedOnProblem: problem,
        category,
        subCategory,
      };
      onQuizCreated(newQuiz);
    } catch (error) {
      console.error('Quiz creation failed:', error);
      alert('クイズの作成に失敗しました。');
    } finally {
      setIsGeneratingQuiz(false);
    }
  }, [onQuizCreated]);

  if (isGeneratingQuiz) {
    return (
      <div className="bg-white p-12 text-center flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mb-6"></div>
        <p className="text-xl text-indigo-700 font-bold">AIクイズ職人が作成中...</p>
      </div>
    );
  }

  if (currentQuiz) {
    const question = currentQuiz.questions[currentQuestionIndex];

    if (quizFinished) {
      return (
        <div className="bg-white p-8 text-center animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">結果発表！</h2>
          <div className="mb-8 p-6 bg-indigo-50 rounded-2xl inline-block">
            <p className="text-6xl font-black text-indigo-600 leading-tight">{score}<span className="text-2xl ml-1 text-gray-600">/ {currentQuiz.questions.length}</span></p>
          </div>
          <div className="flex flex-col space-y-4 max-w-xs mx-auto">
            <Button onClick={() => handleStartQuiz(currentQuiz)} variant="primary" size="lg">もう一度挑戦</Button>
            <Button onClick={handleBackToQuizList} variant="secondary">クイズ一覧へ</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">{currentQuiz.title}</h2>
          <span className="text-sm font-medium text-gray-400">Q{currentQuestionIndex + 1} / {currentQuiz.questions.length}</span>
        </div>

        <div className="mb-8">
          <p className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">{question.question}</p>
          <ul className="space-y-4">
            {question.options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300
                  ${selectedOptionIndex === index ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}
                  ${showExplanation && index === question.correctAnswerIndex ? 'border-green-500 bg-green-50 font-bold ring-2 ring-green-100' : ''}
                  ${showExplanation && selectedOptionIndex === index && selectedOptionIndex !== question.correctAnswerIndex ? 'border-red-400 bg-red-50' : ''}
                `}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mr-3 text-sm font-bold bg-white">{String.fromCharCode(65 + index)}</span>
                  <span className="text-lg">{option}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {!showExplanation ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedOptionIndex === null}
            variant="primary"
            className="w-full py-4 text-xl"
          >
            回答を決定
          </Button>
        ) : (
          <div className="mt-8 p-6 bg-white border-2 border-indigo-100 rounded-2xl animate-slideUp">
            <p className="text-xl font-black text-indigo-700 mb-3 flex items-center">
              {selectedOptionIndex === question.correctAnswerIndex ? '🎉 正解！' : '🤔 おしい！'}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">{question.explanation}</p>
            <Button onClick={handleNextQuestion} variant="primary" className="w-full py-4 text-lg">
              {currentQuestionIndex < currentQuiz.questions.length - 1 ? '次へすすむ' : '結果を見る'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">クイズで学ぶ</h2>
        <Button onClick={() => setShowCreationModal(true)} variant="primary">
          クイズを作成
        </Button>
      </div>

      {dynamicQuizzes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 mb-6">まだクイズがありません。<br/>右上のボタンからあなたの課題をもとに作成できます。</p>
          <Button onClick={() => setShowCreationModal(true)} variant="outline">はじめてのクイズ作成</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dynamicQuizzes.map((quiz) => (
            <div key={quiz.id} 
                 className="group border-2 border-gray-50 rounded-2xl p-6 bg-gray-50 hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all cursor-pointer"
                 onClick={() => handleStartQuiz(quiz)}>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="bg-white px-2 py-0.5 rounded border border-gray-100 mr-3">{quiz.category}</span>
                <span>{quiz.questions.length}問</span>
              </div>
              <Button variant="ghost" className="p-0 text-indigo-600 font-bold">挑戦する →</Button>
            </div>
          ))}
        </div>
      )}

      {showCreationModal && (
        <QuizCreationModal
          chatHistory={chatHistory}
          onClose={() => setShowCreationModal(false)}
          onSelectProblem={handleCreateNewQuiz}
          isLoading={isGeneratingQuiz}
        />
      )}
    </div>
  );
};

export default Quiz;
