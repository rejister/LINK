
import React, { useState } from 'react';
import { Category, SubCategory } from '../types';
import { COMMUNITY_EVENT_SUGGESTIONS, MAJOR_CATEGORIES, SUB_CATEGORIES_MAP } from '../constants';

interface CommunityLinksProps {
  selectedRegion: string;
}

const CommunityLinks: React.FC<CommunityLinksProps> = ({ selectedRegion }) => {
  const [filterCategory, setFilterCategory] = useState<Category | 'すべて'>('すべて');
  const [filterSubCategory, setFilterSubCategory] = useState<SubCategory | 'すべて'>('すべて');

  const availableSubCategories = filterCategory === 'すべて'
    ? []
    : SUB_CATEGORIES_MAP[filterCategory as Category];

  const filteredLinks = COMMUNITY_EVENT_SUGGESTIONS.filter(link => {
    const matchesCategory = filterCategory === 'すべて' || link.category === filterCategory;
    const matchesSubCategory = filterSubCategory === 'すべて' || link.subCategory === filterSubCategory;
    return matchesCategory && matchesSubCategory;
  });

  return (
    <div className="bg-white p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
        地域交流 & イベント ({selectedRegion})
      </h2>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-gray-100 p-4 rounded-xl">
        <div>
          <label htmlFor="category-filter" className="block text-sm font-bold text-gray-600 mb-2">
            カテゴリ
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value as Category | 'すべて');
              setFilterSubCategory('すべて');
            }}
            className="block w-full border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 text-base rounded-lg shadow-sm bg-white"
          >
            <option value="すべて">すべてのカテゴリ</option>
            {MAJOR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sub-category-filter" className="block text-sm font-bold text-gray-600 mb-2">
            サブカテゴリ
          </label>
          <select
            id="sub-category-filter"
            value={filterSubCategory}
            onChange={(e) => setFilterSubCategory(e.target.value as SubCategory | 'すべて')}
            className="block w-full border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 text-base rounded-lg shadow-sm disabled:bg-gray-50 disabled:text-gray-400 bg-white"
            disabled={filterCategory === 'すべて' || availableSubCategories.length === 0}
          >
            <option value="すべて">すべてのサブカテゴリ</option>
            {availableSubCategories.map((subCat) => (
              <option key={subCat} value={subCat}>{subCat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredLinks.length === 0 ? (
          <p className="text-gray-400 text-center py-12">
            該当するイベントが見つかりませんでした。
          </p>
        ) : (
          filteredLinks.map((link) => (
            <div key={link.id} className="group border-2 border-gray-50 p-6 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50 transition-all">
              <div className="flex items-center text-xs font-bold text-indigo-500 mb-2">
                <span className="px-2 py-0.5 bg-indigo-50 rounded border border-indigo-100 mr-2">{link.category}</span>
                {link.subCategory && <span className="text-gray-400">{link.subCategory}</span>}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-700 transition-colors">{link.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{link.description}</p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-bold"
              >
                イベント詳細をチェック
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityLinks;
