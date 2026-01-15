
import { Category, SubCategory } from "./types";

export const DEFAULT_REGION = '香川県';

export const MAJOR_CATEGORIES: Category[] = ['観光', '医療', '防災', '教育', 'その他'];
export const SUB_CATEGORIES_MAP: { [key in Category]: SubCategory[] } = {
  '観光': ['自然', '文化', 'イベント'],
  '医療': ['介護', '健康増進'],
  '防災': ['避難', 'インフラ'],
  '教育': ['学校', '生涯学習'],
  'その他': ['その他'],
};

export const INITIAL_PROBLEM_STATS = MAJOR_CATEGORIES.reduce((acc, cat) => {
  acc[cat] = {
    count: 0,
    subCategories: SUB_CATEGORIES_MAP[cat].reduce((subAcc, subCat) => {
      subAcc[subCat] = 0;
      return subAcc;
    }, {} as { [key in SubCategory]?: number }),
  };
  return acc;
}, {} as { [key in Category]: { count: number; subCategories: { [key in SubCategory]?: number } } });


export const COMMUNITY_EVENT_SUGGESTIONS = [
  {
    id: 'event1',
    title: '高松シニア交流カフェ',
    description: '毎月第2土曜日に開催される、高齢者向けの交流イベント。趣味の共有や健康相談ができます。',
    url: 'https://example.com/takamatsu-senior-cafe',
    category: '医療' as Category,
    subCategory: '介護' as SubCategory,
  },
  {
    id: 'event2',
    title: '瀬戸内国際芸術祭ボランティア募集',
    description: '芸術祭の運営をサポートするボランティア。国内外のアーティストや来場者との交流が生まれます。',
    url: 'https://example.com/setouchi-art-volunteer',
    category: '観光' as Category,
    subCategory: 'イベント' as SubCategory,
  },
  {
    id: 'event3',
    title: '高松市防災マップ学習会',
    description: '地域のハザードマップを学ぶ住民向けワークショップ。いざという時の避難経路や対策を共有します。',
    url: 'https://example.com/takamatsu-bousai-map',
    category: '防災' as Category,
    subCategory: '避難' as SubCategory,
  },
  {
    id: 'event4',
    title: '地域の子どもたちと遊ぶ会',
    description: '放課後に子どもたちと交流するボランティアを募集。地域の子育てをサポートします。',
    url: 'https://example.com/takamatsu-children-play',
    category: '教育' as Category,
    subCategory: '学校' as SubCategory,
  },
  {
    id: 'event5',
    title: '高松歴史探訪ウォーク',
    description: '地元の歴史ガイドと一緒に高松の隠れた名所を巡るウォーキングイベント。新たな発見があります。',
    url: 'https://example.com/takamatsu-history-walk',
    category: '観光' as Category,
    subCategory: '文化' as SubCategory,
  },
  {
    id: 'event6',
    title: '健康増進ウォーキングクラブ',
    description: '毎週日曜朝に集まり、市内の公園や海岸沿いをウォーキング。健康維持と仲間作りを。',
    url: 'https://example.com/health-walking-club',
    category: '医療' as Category,
    subCategory: '健康増進' as SubCategory,
  },
];
