
import React, { useState, useCallback } from 'react';
import { DynamicQuiz, QuizQuestion, ChatMessage, Category, SubCategory } from '../types';
import Button from './Button';
import { generateQuizWithGemini } from '../services/geminiService';
import { MAJOR_CATEGORIES } from '../constants';

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">クイズを作成する課題を選択</h3>
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-indigo-600">クイズを生成中...</p>
          </div>
        )}
        {!isLoading && problemsForQuiz.length === 0 ? (
          <p className="text-gray-600 text-center py-8 text-lg">
            まだクイズを作成できる課題がありません。チャットで地域課題を相談してみましょう！
          </p>
        ) : (
          <ul className="max-h-80 overflow-y-auto space-y-3 mb-4">
            {problemsForQuiz.map((msg, index) => (
              <li key={msg.id} className="border border-gray-200 rounded-md p-3 hover:bg-indigo-50 cursor-pointer transition-colors"
                  onClick={() => onSelectProblem(msg.originalProblem!, msg.category as Category, msg.subCategory as SubCategory)}>
                <p className="font-semibold text-gray-800 text-base line-clamp-2">{msg.originalProblem}</p>
                <p className="text-base text-gray-500 mt-1">カテゴリ: {msg.category} &gt; {msg.subCategory}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="secondary" size="lg">
            キャンセル
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

  const handleRestartQuiz = () => {
    if (currentQuiz) {
      setCurrentQuestionIndex(0);
      setSelectedOptionIndex(null);
      setShowExplanation(false);
      setScore(0);
      setQuizFinished(false);
    }
  };

  const handleBackToQuizList = () => {
    setCurrentQuiz(null); // Clear current quiz to show list
  };

  const handleCreateNewQuiz = useCallback(async (problem: string, category: Category, subCategory: SubCategory) => {
    setShowCreationModal(false);
    setIsGeneratingQuiz(true);
    try {
      const questions = await generateQuizWithGemini(problem, category, subCategory);
      const newQuiz: DynamicQuiz = {
        id: Date.now().toString(),
        title: `${category} > ${subCategory}に関するクイズ`,
        questions: questions.map((q,idx) => ({...q, id: q.id || `${Date.now()}-${idx}`})), // Ensure questions have IDs
        basedOnProblem: problem,
        category,
        subCategory,
      };
      onQuizCreated(newQuiz);
      alert('新しいクイズが作成されました！');
    } catch (error) {
      console.error('クイズの生成中にエラーが発生しました:', error);
      alert('クイズの生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsGeneratingQuiz(false);
    }
  }, [onQuizCreated]);

  if (isGeneratingQuiz) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center h-[calc(100vh-140px)] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
        <p className="text-xl text-indigo-600 font-semibold">AIが新しいクイズを作成中...</p>
        <p className="text-gray-600 mt-2">しばらくお待ちください。</p>
      </div>
    );
  }

  if (currentQuiz) {
    const question = currentQuiz.questions[currentQuestionIndex];

    if (quizFinished) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">クイズ結果</h2>
          <p className="text-xl text-gray-700 mb-6">
            {currentQuiz.questions.length}問中、<span className="font-bold text-indigo-600">{score}</span>問正解しました！
          </p>
          <div className="flex flex-col space-y-3">
            <Button onClick={handleRestartQuiz} variant="primary" size="lg">
              もう一度挑戦する
            </Button>
            <Button onClick={handleBackToQuizList} variant="secondary" size="lg">
              クイズ選択に戻る
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentQuiz.title}</h2>
        <p className="text-base text-gray-500 mb-6">
          第 {currentQuestionIndex + 1} / {currentQuiz.questions.length} 問
        </p>

        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-900 mb-4">{question.question}</p>
          <ul className="space-y-3">
            {question.options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`p-3 border rounded-md cursor-pointer transition-all duration-200 text-lg
                  ${selectedOptionIndex === index ? 'bg-indigo-100 border-indigo-500' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}
                  ${showExplanation && index === question.correctAnswerIndex ? 'bg-green-100 border-green-500 font-bold' : ''}
                  ${showExplanation && selectedOptionIndex === index && selectedOptionIndex !== question.correctAnswerIndex ? 'bg-red-100 border-red-500' : ''}
                `}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>

        {!showExplanation ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedOptionIndex === null}
            variant="primary"
            className="w-full"
          >
            回答する
          </Button>
        ) : (
          <div className="mt-8 bg-indigo-50 p-4 rounded-md border border-indigo-200">
            <p className="text-lg font-bold text-indigo-700 mb-2">
              {selectedOptionIndex === question.correctAnswerIndex ? '正解！' : '残念！'}
            </p>
            <p className="text-base text-gray-800 whitespace-pre-wrap">{question.explanation}</p>
            <p className="text-base text-gray-600 mt-2">
              関連カテゴリ: {question.category} &gt; {question.subCategory}
            </p>
            <Button onClick={handleNextQuestion} variant="secondary" className="mt-4 w-full">
              {currentQuestionIndex < currentQuiz.questions.length - 1 ? '次の問題へ' : '結果を見る'}
            </Button>
          </div>
        )}
         <div className="mt-4 text-center">
            <Button onClick={handleBackToQuizList} variant="ghost" size="md">
              クイズ選択に戻る
            </Button>
          </div>
      </div>
    );
  }

  // Quiz selection view
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">クイズ一覧</h2>

      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowCreationModal(true)} variant="primary" size="lg">
          <span aria-hidden="true" className="mr-2">+</span> 新しいクイズを作成
        </Button>
      </div>

      {dynamicQuizzes.length === 0 ? (
        <p className="text-gray-600 text-center py-8 text-lg">
          まだ作成されたクイズがありません。「新しいクイズを作成」ボタンからクイズを生成してみましょう！
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dynamicQuizzes.map((quiz) => (
            <li key={quiz.id} className="border border-gray-200 rounded-md p-4 bg-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer"
                onClick={() => handleStartQuiz(quiz)}>
              <h3 className="text-xl font-bold text-indigo-700 mb-1">{quiz.title}</h3>
              <p className="text-base text-gray-600 mb-2">問題数: {quiz.questions.length}問</p>
              {quiz.basedOnProblem && (
                <p className="text-sm text-gray-500 italic line-clamp-2">
                  元課題: {quiz.basedOnProblem}
                </p>
              )}
            </li>
          ))}
        </ul>
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