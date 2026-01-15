
import React, { useState } from 'react';
import { ProblemCategoryStats, DynamicQuiz } from '../types';
import { KAGAWA_STATS_DATA } from '../data/kagawaStats';
import DataLearningReport from './DataLearningReport';

interface LearningStatsDisplayProps {
  stats: ProblemCategoryStats;
  dynamicQuizzes: DynamicQuiz[];
}

type TabType = 'app_stats' | 'learning_report';

const LearningStatsDisplay: React.FC<LearningStatsDisplayProps> = ({ stats, dynamicQuizzes }) => {
  const [activeTab, setActiveTab] = useState<TabType>('app_stats');

  const totalCategorizedProblems = (Object.values(stats) as Array<ProblemCategoryStats[keyof ProblemCategoryStats]>).reduce((sum, cat) => sum + cat.count, 0);
  const totalGeneratedQuizzes = dynamicQuizzes.length;

  return (
    <div className="bg-white p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b pb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">統計と学習レポート</h2>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('app_stats')}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'app_stats' 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            利用統計
          </button>
          <button
            onClick={() => setActiveTab('learning_report')}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'learning_report' 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            AI解析状況
          </button>
        </div>
      </div>

      {activeTab === 'app_stats' ? (
        <div className="animate-fadeIn">
          {/* Real Regional Stats Section */}
          <div className="mb-12">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 text-sm">📍</span> 香川県 地域情勢
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{KAGAWA_STATS_DATA.tourism.label}</h4>
                <div className="space-y-3">
                  {KAGAWA_STATS_DATA.tourism.locations.map(loc => (
                    <div key={loc.name} className="flex justify-between items-center border-b border-gray-200 border-dashed pb-2">
                      <span className="text-gray-600 font-medium">{loc.name}</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{loc.count.toLocaleString()}</span>
                        <span className={`text-xs ml-2 font-black ${loc.yoy.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                          {loc.yoy}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 font-black text-indigo-600">
                    <span>月間合計</span>
                    <span className="text-lg">{KAGAWA_STATS_DATA.tourism.total.toLocaleString()}人</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{KAGAWA_STATS_DATA.demographics.label}</h4>
                <div className="flex-grow flex flex-col justify-center">
                  <p className="text-5xl font-black text-gray-900 leading-tight">
                    {KAGAWA_STATS_DATA.demographics.population.toLocaleString()}
                    <span className="text-xl font-medium ml-2 text-gray-400">人</span>
                  </p>
                  <p className={`text-sm mt-2 font-bold ${KAGAWA_STATS_DATA.demographics.change < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    前月比: {KAGAWA_STATS_DATA.demographics.change.toLocaleString()}人
                  </p>
                  <div className="mt-8 p-4 bg-white rounded-xl text-sm text-gray-600 leading-relaxed border border-gray-100">
                    <span className="font-bold text-indigo-600 block mb-1">AI総評:</span>
                    {KAGAWA_STATS_DATA.summary}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3 text-sm">📱</span> アプリ利用状況
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-indigo-50 rounded-2xl p-8 flex items-center">
              <div className="mr-6">
                <h3 className="text-sm font-bold text-indigo-400 mb-1">解決済みの課題</h3>
                <p className="text-4xl font-black text-indigo-700">{totalCategorizedProblems}<span className="text-lg ml-1 font-medium">件</span></p>
              </div>
              <div className="flex-grow h-2 bg-indigo-200 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-2/3"></div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-8 flex items-center">
              <div className="mr-6">
                <h3 className="text-sm font-bold text-emerald-400 mb-1">生成されたクイズ</h3>
                <p className="text-4xl font-black text-emerald-700">{totalGeneratedQuizzes}<span className="text-lg ml-1 font-medium">問</span></p>
              </div>
              <div className="flex-grow h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-1/2"></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-2xl text-sm text-gray-500 flex items-start">
            <span className="text-xl mr-3">ℹ️</span>
            <div>
              <p className="font-bold text-gray-700 mb-1">データの出典</p>
              <p>香川県政策部統計調査課「香川県の地域情勢【統計表】(令和7年10月分)」よりAIが抽出したデータを使用しています。</p>
            </div>
          </div>
        </div>
      ) : (
        <DataLearningReport />
      )}
    </div>
  );
};

export default LearningStatsDisplay;
