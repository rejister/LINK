
import React, { useState, useEffect } from 'react';
import { CommunityLink, Category, SubCategory } from '../types';
import Button from './Button';
import { COMMUNITY_EVENT_SUGGESTIONS, MAJOR_CATEGORIES, SUB_CATEGORIES_MAP } from '../constants';

interface CommunityLinksProps {
  selectedRegion: string;
  // This component will filter internal suggestions based on selected region and categories.
  // In a real app, this would involve more sophisticated fetching.
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
    // For a real app, you would also filter by `selectedRegion`
    return matchesCategory && matchesSubCategory;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
        地域交流 & イベント ({selectedRegion})
      </h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category-filter" className="block text-base font-medium text-gray-700 mb-1">
            カテゴリで絞り込む:
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value as Category | 'すべて');
              setFilterSubCategory('すべて'); // Reset sub-category when main category changes
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="すべて">すべてのカテゴリ</option>
            {MAJOR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sub-category-filter" className="block text-base font-medium text-gray-700 mb-1">
            サブカテゴリで絞り込む:
          </label>
          <select
            id="sub-category-filter"
            value={filterSubCategory}
            onChange={(e) => setFilterSubCategory(e.target.value as SubCategory | 'すべて')}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            disabled={filterCategory === 'すべて' || availableSubCategories.length === 0}
          >
            <option value="すべて">すべてのサブカテゴリ</option>
            {availableSubCategories.map((subCat) => (
              <option key={subCat} value={subCat}>
                {subCat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <p className="text-gray-600 text-center py-8 text-lg">
            該当する交流やイベントは見つかりませんでした。
          </p>
        ) : (
          filteredLinks.map((link) => (
            <div key={link.id} className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="text-xl font-bold text-indigo-700">{link.title}</h3>
              <p className="text-base text-gray-600 mb-2">
                カテゴリ: {link.category} {link.subCategory ? `> ${link.subCategory}` : ''}
              </p>
              <p className="text-base text-gray-700 mb-3">{link.description}</p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold text-base"
              >
                詳細を見る
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
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