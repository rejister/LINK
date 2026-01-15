
import React, { useState } from 'react';
import { ProblemCategoryStats, DynamicQuiz } from '../types';
import { KAGAWA_STATS_DATA } from '../data/kagawaStats';
import DataLearningReport from './DataLearningReport';
import Button from './Button';

interface LearningStatsDisplayProps {
  stats: ProblemCategoryStats;
  dynamicQuizzes: DynamicQuiz[];
}

type TabType = 'app_stats' | 'learning_report';

const LearningStatsDisplay: React.FC<LearningStatsDisplayProps> = ({ stats, dynamicQuizzes }) => {
  const [activeTab, setActiveTab] = useState<TabType>('app_stats');

  // Explicitly cast Object.values(stats) to an array of its constituent type to resolve 'unknown' property access error
  const totalCategorizedProblems = (Object.values(stats) as Array<ProblemCategoryStats[keyof ProblemCategoryStats]>).reduce((sum, cat) => sum + cat.count, 0);
  const totalGeneratedQuizzes = dynamicQuizzes.length;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b pb-3 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">統計・学習レポート</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('app_stats')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'app_stats' 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            利用統計
          </button>
          <button
            onClick={() => setActiveTab('learning_report')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'learning_report' 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            学習プロセス
          </button>
        </div>
      </div>

      {activeTab === 'app_stats' ? (
        <div className="animate-fadeIn">
          {/* Real Regional Stats Section */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-indigo-700 mb-4 flex items-center">
              <span className="mr-2">📍</span> 香川県 地域情勢 (最新統計データ)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-indigo-200 transition-colors">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">{KAGAWA_STATS_DATA.tourism.label}</h4>
                <div className="space-y-2">
                  {KAGAWA_STATS_DATA.tourism.locations.map(loc => (
                    <div key={loc.name} className="flex justify-between items-center border-b border-gray-50 pb-1">
                      <span className="text-gray-700">{loc.name}</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{loc.count.toLocaleString()}人</span>
                        <span className={`text-xs ml-2 ${loc.yoy.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {loc.yoy}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-bold text-indigo-600 border-t border-indigo-100">
                    <span>合計</span>
                    <span>{KAGAWA_STATS_DATA.tourism.total.toLocaleString()}人</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-indigo-200 transition-colors">
                <h4 className="text-sm font-semibold text-gray-500 mb-2">{KAGAWA_STATS_DATA.demographics.label}</h4>
                <div className="flex flex-col justify-center h-full pb-6">
                  <p className="text-3xl font-extrabold text-gray-800">
                    {KAGAWA_STATS_DATA.demographics.population.toLocaleString()}
                    <span className="text-sm font-normal ml-1">人</span>
                  </p>
                  <p className={`text-sm mt-1 ${KAGAWA_STATS_DATA.demographics.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    前月比: {KAGAWA_STATS_DATA.demographics.change.toLocaleString()}人
                  </p>
                  <div className="mt-4 p-2 bg-gray-50 rounded text-sm text-gray-600 italic">
                    {KAGAWA_STATS_DATA.summary}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">{KAGAWA_STATS_DATA.airport.label}</h4>
              <div className="flex flex-wrap gap-2">
                {KAGAWA_STATS_DATA.airport.lines.map(line => (
                  <div key={line.name} className="bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
                    <p className="text-xs text-gray-500">{line.name}</p>
                    <p className="font-bold text-gray-800">{line.count.toLocaleString()}人</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-indigo-700 mb-4 flex items-center">
            <span className="mr-2">📱</span> LINK アプリ利用統計
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4 text-center">
              <h3 className="text-base font-bold text-indigo-700 mb-1">総課題分類数</h3>
              <p className="text-3xl font-extrabold text-indigo-600">
                {totalCategorizedProblems}
                <span className="text-lg font-semibold ml-1">件</span>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
              <h3 className="text-base font-bold text-green-700 mb-1">総クイズ生成数</h3>
              <p className="text-3xl font-extrabold text-green-600">
                {totalGeneratedQuizzes}
                <span className="text-lg font-semibold ml-1">個</span>
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md text-sm" role="alert">
            <p className="font-bold">統計データの引用元について</p>
            <p className="mt-1">
              香川県の地域情勢データは、香川県政策部統計調査課が公表した「香川県の地域情勢【統計表】(令和7年10月分)」を参照しています。
            </p>
          </div>
        </div>
      ) : (
        <DataLearningReport />
      )}
    </div>
  );
};

export default LearningStatsDisplay;
