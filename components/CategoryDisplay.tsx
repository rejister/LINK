
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Category, ProblemCategoryStats, SubCategory } from '../types';
import Button from './Button';
import { SUB_CATEGORIES_MAP } from '../constants';

interface CategoryDisplayProps {
  stats: ProblemCategoryStats;
}

// Define a type alias for the structure of data associated with each Category in ProblemCategoryStats
type CategoryData = ProblemCategoryStats[Category];

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ stats }) => {
  const [expandedCategory, setExpandedCategory] = useState<Category | null>(null);

  const majorCategoryData = Object.entries(stats)
    // Removed: .filter(([category]) => category !== 'その他') // Now 'その他' will be included in the main chart
    .map(([category, data]) => {
      // Cast 'data' to CategoryData to properly access its properties
      const typedData = data as CategoryData;
      return {
        name: category,
        count: typedData.count,
      };
    })
    .sort((a, b) => b.count - a.count); // Sort by count descending

  const handleToggleExpand = (category: Category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const hasData = majorCategoryData.some(data => data.count > 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">地域課題ダッシュボード</h2>

      {!hasData ? (
        <p className="text-gray-600 text-center py-8 text-lg">
          まだデータがありません。チャットで地域課題を相談してみましょう！
        </p>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">主要カテゴリ別の問題数</h3>
          <div className="w-full h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={majorCategoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis allowDecimals={false} stroke="#6b7280" />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-4">詳細カテゴリ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats).map(([category, data]) => {
              const cat = category as Category;
              // Cast 'data' to CategoryData to properly access its properties
              const typedData = data as CategoryData;
              const subCategoryEntries = Object.entries(typedData.subCategories).filter(([, count]) => count && count > 0);
              const showExpandButton = subCategoryEntries.length > 0;

              return (
                <div key={cat} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold text-indigo-700">{cat} ({typedData.count})</h4>
                    {showExpandButton && (
                      <Button
                        variant="ghost"
                        size="md"
                        onClick={() => handleToggleExpand(cat)}
                        className="p-1"
                      >
                        {expandedCategory === cat ? '▲ 閉じる' : '▼ 詳細'}
                      </Button>
                    )}
                  </div>
                  {expandedCategory === cat && (
                    <ul className="list-disc list-inside mt-2 text-gray-700">
                      {subCategoryEntries.length > 0 ? (
                        subCategoryEntries.map(([subCat, count]) => (
                          <li key={subCat} className="text-base">
                            {subCat}: <span className="font-semibold">{count}</span> 件
                          </li>
                        ))
                      ) : (
                        <li className="text-base italic text-gray-500">サブカテゴリの問題はありません。</li>
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryDisplay;