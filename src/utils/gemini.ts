import { GoogleGenerativeAI  } from "@google/generative-ai";

// Gemini API　クライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function generateRefreshSuggestion(task: String): Promise<string> {
    const model = genAI.getGenerativeModel( {model: 'gemini-1.5-flash' });
    const prompt = `
    # 命令
    ユーザーが指定した作業内容をもとに、復習問題とその答えを1つずつ作成してください。

    # 制約事項
    - 問題文は簡潔にすること
    - 答えも簡潔にすること
    - ユーザーの作業内容のテーマに合った内容にすること
    - 出力形式は「Q:（問題）」改行「A:（答え）」とすること
    - 出力例と同じフォーマットで出力すること
    - 数式などを含む場合は、文字列で表示した場合にも読みやすいように工夫すること

    # 出力例
    Q: “run”の過去形は何ですか？
    A: ran

    Q: 「避けられない」を意味する英単語は何ですか？
    A: inevitable

    Q: 「十分な、かなりの」を意味する英単語は何ですか？
    A: substantial

    Q: 2進数の1011を10進数で表すといくつですか？
    A: 11

    Q: スタックとキューの主な違いは何ですか？
    A: スタックはLIFO（後入れ先出し）、キューはFIFO（先入れ先出し）です。

    Q: 現金で商品を購入した場合、仕訳で借方に記入する勘定科目は何ですか？
    A: 仕入

    Q: 商品を掛けで販売した場合、貸方に記入する勘定科目は何ですか？
    A: 売上

    Q: 決算で売上原価を計算する際、「期首商品棚卸高＋当期商品仕入高－期末商品棚卸高」で求められるものは何ですか？
    A: 売上原価

    # 作業内容
    ${task}
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return text.trim();
    } catch (error){
        console.log('Failed to generate suggestion', error);
        return 'ゆっくり深呼吸をしよう☀️';
    }
    
    return '';
}