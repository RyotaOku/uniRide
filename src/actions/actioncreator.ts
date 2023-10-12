// これは、Reduxなどの状態管理ライブラリでよく使われるパターン。

// アクションクリエーターの目的
// コードの再利用: 同じアクション（例：API呼び出し）が複数の場所で必要な場合、そのロジックを一か所にまとめることで、コードの再利用性が高まる。
// テスタビリティ: アクションクリエーターは通常、純粋な関数であり、テストが容易。これにより、ユニットテストを効率的に書くことができる。
// 読みやすさと保守性: actioncreatorを使用すると、何が行われているのかを一目で理解しやすく、後からコードを修正する際にも役立つ。
// UIとの分離: ビジネスロジック（API呼び出しなど）をUIから分離することで、コンポーネントはより純粋にUIに関するものになり、可読性と保守性が向上する。というか、そうあるべき。

// 'authenticate'関数はユーザー情報をサーバーに送信して認証を行う。
// 関数は非同期（async）なので、実行が完了するまで待つ。
export async function authenticate(
    accountName: string, gender: string, birthday: string, schoolName: string
) {
    // fetchを使用して、指定されたAPIエンドポイントにPOSTリクエストを送る。
    // awaitを使用しているため、レスポンスが返るまで次の行には進まない。
    const res = await fetch('/api/userAccountRegistration/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // リクエストボディがJSON形式であることをサーバに伝える。
            'Pragma': 'no-cache', // キャッシュを無効化する。
            'Cache-Control': 'no-cache' // キャッシュを制御（この場合は無効化）。
        },
        // オブジェクトをJSONに変換してbodyに含める。
        body: JSON.stringify({
            accountName, gender, birthday, schoolName
        })
    })

    // レスポンスをJSON形式で解析。resultをどこでも使用していないので意味ないけど。
    // というか、api側の実装でも何もreturnしていなかったはず。
    const result = await res.json()

    // 本当は良くない。なにこれ...。
    return 'とりあえずreturn'
}

// サーバー側で数字を生成。
export async function generateNumber() {
    const res = await fetch('/api/userAccountRegistration/pincode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({})
    })

    // レスポンスをJSON形式で解析。
    const result = await res.json()

    // 帰ってきた結果をreturnする。
    return result
}