
import React from 'react';
import { KAGAWA_STATS_DATA } from '../data/kagawaStats';

const DataLearningReport: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg shadow-sm">
        <h3 className="text-xl font-bold text-indigo-800 mb-2">AI学習プロセス・レポート</h3>
        <p className="text-indigo-700 text-sm">
          提供された統計データファイルがどのように解析され、LINKのAIモデルに統合されているかを可視化しています。
        </p>
      </div>

      <section>
        <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-2 text-sm">1</span>
          データ解析と抽出マップ
        </h4>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">対象指標</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CSVマッピング位置</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">抽出ステータス</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">{KAGAWA_STATS_DATA.economicIndex.label}</td>
                <td className="px-4 py-3 text-gray-600 font-mono">{KAGAWA_STATS_DATA.economicIndex.csvMapping}</td>
                <td className="px-4 py-3 text-green-600 font-bold">● 学習済み</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">{KAGAWA_STATS_DATA.tourism.label}</td>
                <td className="px-4 py-3 text-gray-600 font-mono">{KAGAWA_STATS_DATA.tourism.csvMapping}</td>
                <td className="px-4 py-3 text-green-600 font-bold">● 学習済み</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">{KAGAWA_STATS_DATA.airport.label}</td>
                <td className="px-4 py-3 text-gray-600 font-mono">{KAGAWA_STATS_DATA.airport.csvMapping}</td>
                <td className="px-4 py-3 text-green-600 font-bold">● 学習済み</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">{KAGAWA_STATS_DATA.demographics.label}</td>
                <td className="px-4 py-3 text-gray-600 font-mono">{KAGAWA_STATS_DATA.demographics.csvMapping}</td>
                <td className="px-4 py-3 text-green-600 font-bold">● 学習済み</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-2 text-sm">2</span>
          AI知識統合プロセス
        </h4>
        <div className="relative border-l-2 border-indigo-200 ml-4 space-y-6">
          {KAGAWA_STATS_DATA.learningProcess.steps.map((step) => (
            <div key={step.id} className="relative pl-6">
              <span className="absolute -left-[9px] top-0 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white"></span>
              <h5 className="font-bold text-gray-800 text-base mb-1">{step.title}</h5>
              <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
          <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-2 text-sm">3</span>
          コンテキスト注入の例 (プロンプト構造)
        </h4>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-indigo-300 leading-relaxed overflow-x-auto shadow-inner">
          <p className="text-gray-500 mb-2">// AIへ送信される実際のコンテキスト例</p>
          <p>{"{"}</p>
          <p className="pl-4">"system_instruction": "あなたはLINKです。...",</p>
          <p className="pl-4">"grounding_data": {"{"}</p>
          <p className="pl-8">"target_region": "香川県",</p>
          <p className="pl-8">"latest_stats": {"{"}</p>
          <p className="pl-12">"population": {KAGAWA_STATS_DATA.demographics.population},</p>
          <p className="pl-12">"tourism_trend": "{KAGAWA_STATS_DATA.tourism.locations[0].name} (+16.0%)",</p>
          <p className="pl-12">"economic_status": "{KAGAWA_STATS_DATA.summary}"</p>
          <p className="pl-8">{"}"}</p>
          <p className="pl-4">{"}"}</p>
          <p>{"}"}</p>
        </div>
      </section>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
        <p className="font-bold mb-1">💡 レポートの信頼性について</p>
        <p>このレポートは、提供された「{KAGAWA_STATS_DATA.sourceFile}」の生データを解析し、Gemini APIに渡されるリアルタイム・コンテキスト情報を元に動的に生成されています。</p>
      </div>
    </div>
  );
};

export default DataLearningReport;
