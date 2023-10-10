// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// PostgreSQLのPoolクラスをインポート
const { Pool } = require('pg')

// 入力データの型を定義
type Input = {
    accountName: string
    gender: string
    birthday: string
    phoneNumber: string // 今回電話番号は登録しないのになんでか作っちゃった。
    schoolName: string
}
// 出力データの型を定義（今のところ空ですが、何か出力が必要な場合はこの部分を変更）
type Output = {
}

// シーケンス（自動採番ID）を取得する関数
async function getSequence(client: any) {
    const result = await client.query(`
        SELECT
            NEXTVAL('unirideAccount_seq') AS "id"
    `)
    return result.rows[0].id
}

// ユーザーアカウントをデータベースに追加する関数
async function addUsersAccount(client: any, json: Input) {
    // 関数getSequenceを呼び出して、新しいID（自動採番）を取得
    const id = await getSequence(client);

    // SQLクエリを実行して、新しいユーザーアカウントをデータベースに挿入
    // SQLクエリのプレースホルダー（$1, $2, ..., $6）は、後続の配列で指定された値に置き換えられます。
    // id: 自動生成されたユニークなID
    // json.accountName: アカウント名（関数呼び出し時に指定）
    // json.gender: 性別（関数呼び出し時に指定）
    // json.birthday: 誕生日（関数呼び出し時に指定）
    // json.phoneNumber: 電話番号（関数呼び出し時に指定、今回はデータない。）
    // json.schoolName: 学校名（関数呼び出し時に指定）
    const result = await client.query(`
        INSERT INTO unirideAccount(
            id,
            accountName,
            gender,
            birthday,
            phoneNumber,
            schoolName
        ) VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        )
    `, [id, json.accountName, json.gender, json.birthday, json.phoneNumber, json.schoolName]);

    // SQLクエリの実行結果を返す
    return result;
}

// asyncについては最下部に。
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Output>
) {
    // リクエストボディからユーザー情報（JSON形式）を取得
    const json: Input = req.body;

    // PostgreSQLデータベースへの接続情報を設定
    const pool = new Pool({
        host: process.env.DB_HOST,  // データベースのホスト名
        port: process.env.DB_PORT,  // データベースのポート番号
        database: process.env.DB_NAME,  // データベース名
        user: process.env.DB_USER,  // データベースのユーザー名
        password: process.env.DB_PASS,  // データベースのパスワード
        max: 100,  // 最大コネクション数
        idleTimeoutMillis: 3000,  // アイドル状態のコネクションが切断されるまでの時間（ミリ秒）
        connectionTimeoutMillis: 2000,  // コネクションのタイムアウト時間（ミリ秒）
    });

    // データベースに接続
    const client = await pool.connect();

    try {
        // addUsersAccount関数を呼び出して、新しいユーザーをデータベースに追加
        const result = await addUsersAccount(client, json);

        // 成功した場合、HTTPステータスコード200とともに結果を返す
        res.status(200).json({ result });
    } finally {
        // データベースコネクションをリリース（解放）
        client.release();
    }
}

// asyncキーワードは関数の定義の前に配置される。これによって、その関数は非同期関数となる。
// 非同期関数は、Promiseオブジェクトを返す関数。Promiseは非同期処理の結果を表現するためのオブジェクト。

// 非同期関数内でawaitキーワードを使うと、Promiseの解決（または拒否）を待ってから次の処理に進む。
// 非同期処理（ファイルの読み込み、APIからのデータ取得など）はしばしば時間がかかる。
// asyncとawaitを使用することで、非同期処理が終わるまで待ってから次の処理に進むということができる。