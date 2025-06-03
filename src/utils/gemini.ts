import { GoogleGenerativeAI  } from "@google/generative-ai";

// Gemini API　クライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function generateRefreshSuggestion(): Promise<string> {
    const model = genAI.getGenerativeModel( {model: 'gemini-1.5-flash' });
    const prompt = `
    # 命令
    作業の合間にできる簡単なリフレッシュ方法を一つ提案してください。

    # 制約事項
    - 1~2分程度でできること
    - 室内でできること
    - 体を動かすこと
    - 絵文字を一つ含めること
    - 簡潔に一文の中に収めること
    - 「〜しよう」のように提案する形で終わること

    # 出力例
    - 大きく背伸びしよう😇
    - 室内で少しだけ歩こう🚶
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