
export const KAGAWA_STATS_DATA = {
  lastUpdated: "2025-10-01",
  sourceFile: "香川県の地域情勢【統計表】(令和7年10月分)",
  summary: "香川県景気動向指数(一致指数)は直近で微増傾向にあるが、一部の観光地や製造業において変動が見られる。",
  economicIndex: {
    label: "香川県景気動向指数(一致指数)",
    csvMapping: "列C-G (一致指数, 3か月/7か月移動平均)",
    history: [
      { month: "R6.05", value: 103.8 },
      { month: "R6.06", value: 99.5 },
      { month: "R6.07", value: 99.4 },
      { month: "R6.08", value: 96.8 },
      { month: "R6.09", value: 101.3 },
      { month: "R6.10", value: 102.1 }
    ]
  },
  tourism: {
    label: "主要観光地入込客数 (令和7年9月分)",
    csvMapping: "列BW-CD (四大観光地: 栗林公園, 屋島, 琴平, 小豆島)",
    locations: [
      { name: "栗林公園", count: 48430, yoy: "+16.0%" },
      { name: "屋島", count: 53136, yoy: "+0.4%" },
      { name: "琴平", count: 98000, yoy: "+4.3%" },
      { name: "小豆島", count: 82074, yoy: "+6.4%" }
    ],
    total: 266449
  },
  airport: {
    label: "航空機利用者数 (高松空港 令和7年9月分)",
    csvMapping: "列CH-CV (羽田線, 那覇便, ソウル便, 上海便, 台北便)",
    lines: [
      { name: "羽田線", count: 107881, yoy: "+12.3%" },
      { name: "那覇便", count: 17089, yoy: "+53.5%" },
      { name: "ソウル便", count: 15169, yoy: "-11.2%" },
      { name: "上海便", count: 4385, yoy: "-16.8%" },
      { name: "台北便", count: 6548, yoy: "+22.2%" }
    ]
  },
  demographics: {
    label: "推計人口 (令和7年9月)",
    csvMapping: "列DG-DK (推計人口, 世帯数)",
    population: 917613,
    change: -555,
    households: 413943
  },
  learningProcess: {
    steps: [
      {
        id: 1,
        title: "非構造化データの構造化",
        description: "提供されたCSV統計表から、地域課題に直結する「経済」「観光」「人口」「交通」の4つの主要指標を特定し、プログラムが解釈可能なJSON形式に変換しました。"
      },
      {
        id: 2,
        title: "AIコンテキスト注入",
        description: "Gemini 3 Proのシステムプロンプトに、この構造化された数値を動的に埋め込みます。これにより、AIは2025年10月時点の香川県の現状を「既知の事実」として保持します。"
      },
      {
        id: 3,
        title: "グラウンディング(根拠付け)",
        description: "ユーザーの質問に対し、Google検索結果と保持している統計データを照合し、矛盾のない具体的な解決策を生成します。"
      }
    ]
  }
};
