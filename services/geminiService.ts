
import { GoogleGenAI, GenerateContentResponse, Type, GenerateContentParameters } from "@google/genai";
import { Category, ProblemTag, SubCategory, QuizQuestion } from "../types";
import { MAJOR_CATEGORIES, SUB_CATEGORIES_MAP } from "../constants";
import { KAGAWA_STATS_DATA } from "../data/kagawaStats";

const getGeminiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateContentWithGemini = async (
  prompt: string,
  // Update to use the recommended model for basic text tasks
  modelName: string = 'gemini-3-flash-preview',
  useGoogleSearch: boolean = false,
  region?: string
): Promise<{ text: string | undefined; urls: { uri: string; title?: string }[] }> => {
  const ai = getGeminiClient();

  let finalPrompt = prompt;
  if (region === '香川県') {
    const statsContext = `
    【地域データ: 香川県 (2025年最新統計)】
    - 景気指数: ${KAGAWA_STATS_DATA.summary}
    - 主要観光地客数: ${KAGAWA_STATS_DATA.tourism.locations.map(l => `${l.name}(${l.count}人, 前年比${l.yoy})`).join(', ')}
    - 高松空港利用者: ${KAGAWA_STATS_DATA.airport.lines.map(l => `${l.name}(${l.count}人)`).join(', ')}
    - 推計人口: ${KAGAWA_STATS_DATA.demographics.population}人 (前月比${KAGAWA_STATS_DATA.demographics.change}人)
    
    上記の具体的な数値を踏まえて、根拠のあるアドバイスを行ってください。`;
    finalPrompt = statsContext + "\n\n" + prompt;
  }

  const config: GenerateContentParameters['config'] = {};
  if (useGoogleSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: modelName,
    contents: [{ parts: [{ text: finalPrompt }] }],
    config,
  });

  const urls: { uri: string; title?: string }[] = [];
  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    for (const chunk of response.candidates[0].groundingMetadata.groundingChunks) {
      if (chunk.web?.uri) {
        urls.push({ uri: chunk.web.uri, title: chunk.web.title });
      }
      if (chunk.maps?.uri) {
        urls.push({ uri: chunk.maps.uri, title: chunk.maps.title });
      }
      if (chunk.maps?.placeAnswerSources?.reviewSnippets) {
        for (const snippet of chunk.maps.placeAnswerSources.reviewSnippets) {
          if (typeof snippet === 'string' && snippet) {
            urls.push({ uri: snippet, title: undefined });
          }
        }
      }
    }
  }

  return { text: response.text, urls };
};

export const categorizeProblemWithGemini = async (problem: string): Promise<ProblemTag> => {
  const ai = getGeminiClient();

  const categories = MAJOR_CATEGORIES.join(', ');
  const subCategories = Object.entries(SUB_CATEGORIES_MAP).map(([cat, subs]) => `${cat}: ${subs.join(', ')}`).join('; ');

  const prompt = `以下のユーザーが提起した問題を、地域課題の主要なジャンル（${categories}）と、それに対応するサブジャンル（${subCategories}）に分類し、JSON形式で出力してください。分類が難しい場合は'その他'を使用してください。

問題: ${problem}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      // Use recommended gemini-3-flash-preview for categorization tasks
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: MAJOR_CATEGORIES,
              description: `問題の主要なカテゴリ (${categories})`,
            },
            subCategory: {
              type: Type.STRING,
              enum: [
                ...SUB_CATEGORIES_MAP['観光'],
                ...SUB_CATEGORIES_MAP['医療'],
                ...SUB_CATEGORIES_MAP['防災'],
                ...SUB_CATEGORIES_MAP['教育'],
                ...SUB_CATEGORIES_MAP['その他'],
              ],
              description: `問題のサブカテゴリ`,
            },
          },
          required: ['category', 'subCategory'],
        },
      },
    });

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      const parsed = JSON.parse(jsonStr);
      const category: Category = MAJOR_CATEGORIES.includes(parsed.category) ? parsed.category : 'その他';
      const subCategory: SubCategory = (SUB_CATEGORIES_MAP[category] || []).includes(parsed.subCategory) ? parsed.subCategory : 'その他';

      return {
        category,
        subCategory,
      };
    }
  } catch (error) {
    console.error("Error categorizing problem with Gemini:", error);
  }
  return { category: 'その他', subCategory: 'その他' };
};

export const generateQuizWithGemini = async (
  problemContext: string,
  category: Category,
  subCategory: SubCategory,
): Promise<QuizQuestion[]> => {
  const ai = getGeminiClient();

  const allSubCategories = [...new Set(Object.values(SUB_CATEGORIES_MAP).flat())];

  const prompt = `以下の地域課題に関する4つの選択式クイズを作成してください。各クイズは質問、4つの選択肢、正解のインデックス（0から3）、そして詳細な解説を含むJSON形式で出力してください。カテゴリは「${category}」、サブカテゴリは「${subCategory}」に関連する内容にしてください。
  クイズの難易度は中程度で、地域課題への理解を深める内容にしてください。

  課題のテーマ: ${problemContext}

  出力形式:
  [
    {
      "id": "q1",
      "question": "質問文",
      "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
      "correctAnswerIndex": 0,
      "explanation": "解説文",
      "category": "${category}",
      "subCategory": "${subCategory}"
    },
    ... (残り3つのクイズを追加)
  ]`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      // Complex reasoning task for quiz generation uses gemini-3-pro-preview
      model: "gemini-3-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
              correctAnswerIndex: { type: Type.INTEGER, minimum: 0, maximum: 3 },
              explanation: { type: Type.STRING },
              category: { type: Type.STRING, enum: MAJOR_CATEGORIES },
              subCategory: { type: Type.STRING, enum: allSubCategories },
            },
            required: ['id', 'question', 'options', 'correctAnswerIndex', 'explanation', 'category', 'subCategory'],
          },
          minItems: 4,
          maxItems: 4,
        },
      },
    });

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      const quizzes = JSON.parse(jsonStr) as QuizQuestion[];
      return quizzes.map((q, index) => ({
        ...q,
        id: q.id || `${Date.now()}-${index}`,
      }));
    }
  } catch (error) {
    console.error("Error generating quiz with Gemini:", error);
  }
  throw new Error("Failed to generate quiz questions.");
};
