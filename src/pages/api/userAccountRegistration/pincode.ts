import type { NextApiRequest, NextApiResponse } from 'next'

// 返すデータの型を定義
type Output = {
    randomNumber?: number;
    error?: string;
}
// どちらも必須でないのはおかしいのかな。

// 4桁のランダムな数字を生成する関数
function generateFourDigitNumber(): number {
    // Math.random()は0以上1未満のランダムな浮動小数点数を生成する。
    // それに(9999 - 1000 + 1)を掛けた後に1000を足すことで、
    // 1000から9999までのランダムな整数を生成。
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Output>
) {
    try {
        // 4桁のランダムな数字を生成
        // この例ではエラーは発生しないが、エラーが発生する可能性のあるコードをtryブロックに置く。
        const randomNumber = generateFourDigitNumber();

        // randomNumberを含むJSONオブジェクトをレスポンスとして返す
        return res.status(200).json({ randomNumber })
    } catch (error) {
        // tryブロックでエラーが発生した場合、このブロックが実行される。
        // エラー内容をコンソールに出力
        console.error("An error occurred:", error);

        // クライアントにエラーメッセージを送信（HTTPステータスコード500）
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
