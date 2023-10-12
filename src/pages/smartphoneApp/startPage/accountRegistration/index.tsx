import { Frame } from "@/components/smartphoneApp/common/Frame";
import { useState, useEffect, useRef, RefObject, ChangeEvent } from "react";
import Button from "@/components/smartphoneApp/common/Button";
import style from "@/styles/components/smartphoneApp/startPage/accountRegistration/account.module.css";
import { Notification } from "@/components/smartphoneApp/common/Notification";
import { authenticate } from "../../../../actions/actioncreator";
import { generateNumber } from "../../../../actions/actioncreator";
import { AccessModal } from '@/components/smartphoneApp/common/Request';

// この辺の型定義は時間がないためとはいえひどすぎるな...。
type pincodeState = {
    pincode: string;
    inputNumber: string;
};

type name = {
    pageState: number;
    setPageState: React.Dispatch<React.SetStateAction<number>>;
    phoneNumber: string;
    setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
    pincode: pincodeState;
    setPincode: React.Dispatch<React.SetStateAction<pincodeState>>;
};

type name2 = {
    phoneNumber: string;
    pageState: number;
    setPageState: React.Dispatch<React.SetStateAction<number>>;
    pincode: pincodeState;
    setPincode: React.Dispatch<React.SetStateAction<pincodeState>>;
};

type name3 = {
    pageState: number;
    setPageState: React.Dispatch<React.SetStateAction<number>>;
};

type name4 = {
    pageState: number;
    setPageState: React.Dispatch<React.SetStateAction<number>>;
};

// 電話番号を入力する画面
function PhoneNumber(props: name) {
    // 関数名は本当はしっかりきめなければならないが...。
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 正規表現を用いて、半角数字以外はすべて無効とする。
        const value = e.target.value.replace(/[^\d]/g, "");

        // 11桁の電話番号09000000000を090 0000 0000の形式に整形する
        const format = (str: string) =>
            [
                // 最初の3桁を切り出し
                str.slice(0, 3),
                // 次の4桁を切り出し
                str.slice(3, 7),
                // 最後の4桁を切り出し
                str.slice(7, 11),
                // undefinedや空の文字列を取り除き、切り出した3パーツを半角スペースで結合
            ]
                .filter(Boolean)
                .join(" ");

        // stateの変更にはset~~を用いる。
        props.setPhoneNumber(format(value.slice(0, 11)));
    };

    // ページ状態を1増やし、サーバーから4桁の数字を受け取る。(重ねてになるが、関数名は本当はしっかり考えねば...。)
    const handleSomething = async () => {
        props.setPageState(props.pageState + 1);

        // pinコードを受け取る。非同期処理
        const pincode = await generateNumber();
        props.pageState;
        props.setPincode({
            ...props.pincode,
            pincode: pincode.randomNumber,
        });
    };

    return (
        <div className={style.wrap}>
            <h2 className={style.title}>UniRideをはじめよう</h2>
            <p className={style.text}>
                日本国内でSMS受信可能な
                <br />
                電話番号を入力してください。
            </p>
            <input
                type="text"
                placeholder="080 1234 5678"
                value={props.phoneNumber}
                onChange={handleInputChange}
                maxLength={13}
                className={style.phoneNumber}
            />

            <Button
                // 条件演算子を使用して、電話番号が13桁でないとdisabled(無効)状態に。
                disabled={props.phoneNumber.length === 13 ? false : true}
                text={"認証コードを受け取る"}
                mainColor={false}
                link={""}
                onClick={() => {
                    handleSomething();
                }}
            />
        </div>
    );
}

function Authentication(props: name2) {
    // ４桁のpinを入力する独立したinputにfocusを自動で当てるために使用↓
    // にしても酷い実装だ...。
    const ref1 = useRef<HTMLInputElement>(null);
    const ref2 = useRef<HTMLInputElement>(null);
    const ref3 = useRef<HTMLInputElement>(null);
    const ref4 = useRef<HTMLInputElement>(null);

    // inputタグをそれぞれ書くのではなく、配列にしmapで描画。
    const refs: RefObject<HTMLInputElement>[] = [ref1, ref2, ref3, ref4];

    // ここで認証コードを保持
    const [code, setCode] = useState(["", "", "", ""]);

    // inputタグに入力された数字に対して様々みていく
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = e.target.value;

        // 入力された認証コードを保存
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // 自動でフォーカスを移動する条件たち
        if (value.length === 1 && index < 3) {
            // フォーカスを移動
            if (refs[index + 1].current !== null) {
                refs[index + 1].current!.focus();
            }
        } else if (value.length === 0 && index > 0) {
            // 削除の場合のフォーカスも移動
            if (refs[index - 1].current !== null) {
                refs[index - 1].current!.focus();
            }
        }

        // すべての桁が入力されたら、認証コードをチェック
        if (newCode.filter(Boolean).length === 4) {
            if (newCode.join("") === props.pincode.pincode.toString()) {
                setTimeout(() => {
                    props.setPageState(props.pageState + 1);
                }, 1000);
            } else {
                // 認証コードが異なる場合の処理
            }
        }
    };

    return (
        <>
            <div className={style.wrap}>
                <h2 className={style.title}>認証コードを入力</h2>
                <p className={style.text}>
                    {/* 電話番号のみを格納するstateを作った理由はここ。
                    にしてもフロント都合の酷い状態だ。
                    */}
                    {props.phoneNumber}にSMSで送信された
                    <br />
                    4桁の認証コードを入力して下さい。
                </p>
                <div className={style.authenticationWrap}>
                    {/* mapで描画。それぞれmaxLength(入力できる最大文字数)が1である。 */}
                    {refs.map((ref, index) => (
                        <input
                            key={index}
                            type="text"
                            className={style.authenticationInput}
                            maxLength={1}
                            ref={ref}
                            value={code[index]}
                            onChange={(e) => handleInputChange(e, index)}
                        />
                    ))}
                </div>
                {/* ダミー。クリックしても再送信されない。 */}
                <a href="#" className={style.resend}>
                    認証コードを再送信するｓ
                </a>
            </div>
        </>
    );
}

// ユーザー情報を入れてもらうための部分
export function UserInformation(props: name3) {
    // ユーザー情報を保持するstate。本当は型をつけるべきで、reducerを使用することが望ましいが...。
    const [userInfo, setUserInfo] = useState({
        userName: "",
        userGender: "",
        userBirthDate: "",
        userSchoolName: "",
    });

    // それぞれ入力し関してこの関数を通す
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        key: string
    ) => {
        // 誕生日の入力のみ入力チェック。
        if (key === "userBirthDate") {
            // まず正規表現で半角数字のみ受け付ける
            const value = e.target.value.replace(/[^\d]/g, "");

            // その後、スラッシュを自動挿入する。
            const format = (str: string) =>
                [
                    // 最初の4桁を切り出し
                    str.slice(0, 4),
                    // 次の2桁を切り出し
                    str.slice(4, 6),
                    // 最後の2桁を切り出し
                    str.slice(6, 8),
                    // undefinedや空の文字列を取り除き、切り出した3パーツをスラッシュで結合
                ]
                    .filter(Boolean)
                    .join("/");

            setUserInfo({
                ...userInfo,
                userBirthDate: format(value.slice(0, 10)),
            });
            return;
        }

        // 誕生日以外の入力はそのまま純粋にsetState。
        setUserInfo({
            ...userInfo,
            [key]: e.target.value,
        });
    };

    // 誕生日の入力が正しいかどうか
    const isBirthDateValid = (date: string) => {
        const pattern =
            /^(19[0-9]{2}|200[0-5])\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/;
        return pattern.test(date);
    };

    // buttonをクリックしたら、pageを+1し、かつユーザーが入力した情報をサーバーに送信。
    // もちろん非同期関数。
    const handleSomething = async () => {
        props.setPageState(props.pageState + 1);

        await authenticate(
            userInfo.userName,
            userInfo.userGender,
            userInfo.userBirthDate,
            userInfo.userSchoolName
        );
    };

    return (
        <div className={style.informationWrap}>
            <h2 className={style.title}>ユーザー情報を登録</h2>
            <div className={style.inputForm}>
                <label htmlFor="userName">ひらがな氏名</label>
                <input
                    type="text"
                    placeholder="たなか あきお"
                    value={userInfo.userName}
                    maxLength={30}
                    onChange={(e) => handleInputChange(e, "userName")}
                />
            </div>
            <div className={style.inputGroupe}>
                <div className={style.inputInner}>
                    <label htmlFor="userGender">性別</label>
                    <select
                        name="userGender"
                        id="userGender"
                        value={userInfo.userGender}
                        onChange={(e) => handleInputChange(e, "userGender")}
                    >
                        <option value="男性">男性</option>
                        <option value="女性">女性</option>
                        <option value="その他">その他</option>
                    </select>
                </div>
                <div className={style.inputInner}>
                    <label htmlFor="userBirthDate">生年月日</label>
                    <input
                        type="text"
                        placeholder="2000/01/01"
                        maxLength={10}
                        value={userInfo.userBirthDate}
                        onChange={(e) => handleInputChange(e, "userBirthDate")}
                    />
                </div>
            </div>
            <div className={style.inputForm}>
                <label htmlFor="userSchoolName">学校名</label>
                <input
                    type="text"
                    placeholder="ECCコンピュータ専門学校"
                    value={userInfo.userSchoolName}
                    onChange={(e) => handleInputChange(e, "userSchoolName")}
                />
            </div>

            <Button
                disabled={
                    // すべての項目が入力されてますか？
                    !Object.entries(userInfo).every(([key, value]) => {
                        // 誕生日は正しいフォーマットですか？
                        if (key === "userBirthDate") {
                            return isBirthDateValid(value);
                        }
                        // 学校名は5文字以上ですか？
                        if (key === "userSchoolName") {
                            return value.length > 5;
                        }
                        return value !== "";
                    })
                }
                text={"登録を完了する"}
                mainColor={false}
                onClick={() => {
                    handleSomething();
                }}
            />
        </div>
    );
}

// クレジットカードを登録する部分
function CardInformation(props: name4) {
    // カードの情報を保持するstate
    const [cardInfo, setCardInfo] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>, field: keyof any) => {
        // 正規表現で半角数字のみ受け付ける
        const value = e.target.value.replace(/[^\d]/g, "");

        // カード番号であれば、4桁ごとに半角スペースを挿入する
        if (field === "cardNumber") {
            const format = (str: string) => {
                return str
                    .replace(/\s/g, "")
                    .replace(/(.{4})/g, "$1 ")
                    .trim();
            };

            // stateの変更にはsetCardInfoを用いる。
            setCardInfo({ ...cardInfo, cardNumber: format(value) });
            return;
        }

        // 有効期限は2桁ごとにスラッシュで区切る
        if (field === "expiry") {
            const format = (str: string) =>
                [
                    str.slice(0, 2),
                    str.slice(2, 4),
                    // undefinedや空の文字列を取り除き、切り出した3パーツをスラッシュで結合
                ]
                    .filter(Boolean)
                    .join("/");

            setCardInfo({ ...cardInfo, expiry: format(value.slice(0, 5)) });
            return;
        }
        // それ以外(というか３桁の番号のアレ)はそのままsetState
        setCardInfo({
            ...cardInfo,
            [field]: value,
        });
    };

    const isValidCardInfo = (cardInfo: any): boolean => {
        // 簡易的なチェック例。本番環境ではより厳格なバリデーションが必要。というか、フロント領域で入力チェックすべきでない。
        return (
            cardInfo.cardNumber.length === 19 &&
            !!cardInfo.expiry.match(/^\d{2}\/\d{2}$/) &&
            cardInfo.cvv.length === 3
        );
    };

    // クリックされたら純粋にpage+1する。
    const handleSomething = () => {
        props.setPageState(props.pageState + 1);
    };

    return (
        <div className={style.informationWrap}>
            <h2 className={style.title}>クレジットカード登録</h2>
            <p className={style.text}>
                事前にクレジットカードを登録しておけば、
                <br />
                降車時もスムーズにお会計できます。
            </p>
            {/* Logo.tsxとしてコンポーネント化したのでは？ */}
            <div className={style.creditLogos}>
                <picture>
                    <img src="/images/svg/card/visa.svg" alt="" />
                    <img src="/images/svg/card/jcb.svg" alt="" />
                    <img src="/images/svg/card/mastercard.svg" alt="" />
                    <img src="/images/svg/card/amex.svg" alt="" />
                </picture>
            </div>
            <div className={style.inputForm + " " + style.inputCard}>
                <label htmlFor="">カード番号</label>
                <div className={style.iconWrap}>
                    {/* primeiconsのカードアイコン */}
                    <i className="pi pi-credit-card"></i>
                    <input
                        type="text"
                        maxLength={19}
                        value={cardInfo.cardNumber}
                        onChange={(e) => handleChange(e, "cardNumber")}
                    />
                </div>
            </div>
            <div className={style.inputGroupe}>
                <div className={style.inputInner}>
                    <label htmlFor="">有効期限</label>
                    <input
                        type="text"
                        placeholder="YY/MM"
                        maxLength={5}
                        value={cardInfo.expiry}
                        onChange={(e) => handleChange(e, "expiry")}
                    />
                </div>
                <div className={style.inputInner}>
                    <label htmlFor="">セキュリティコード</label>
                    <input
                        type="text"
                        placeholder="CVC"
                        maxLength={3}
                        value={cardInfo.cvv}
                        onChange={(e) => handleChange(e, "cvv")}
                    />
                </div>
            </div>
            <Button
                // 簡易な入力チェックが通れば有効になる。
                disabled={!isValidCardInfo(cardInfo)}
                mainColor={false}
                text={"登録を完了する"}
                onClick={() => {
                    handleSomething();
                }}
            />
            <button
                className={style.cardSkip}
                onClick={() => {
                    props.setPageState(props.pageState + 1);
                }}
            >
                今は登録しない
            </button>
        </div>
    );
}

// 権限の許可を求める部分。
function Authority() {
    // モーダル、というか権限の許可を求めてくるアレ。
    const [modalState, setModalState] = useState({
        flag: false, // モーダルは表示状態か？
        page: 0 // フロント都合の番号
    });

    // モーダルに表示するテキスト
    const [modalMessage, setModalMessage] = useState({
        access: '', // なんの権限にアクセスする？
        text: '' // 詳細なテキスト
    })

    // modalStateの値が変更されるたびに更新する
    useEffect(() => {
        switch (modalState.page) {
            case 0:
                setModalMessage({
                    access: '位置情報',
                    text: 'マッチング・迎車範囲の検出やユーザー同士の位置情報の共有に利用します。'
                });
                break;
            case 1:
                setModalMessage({
                    access: '通知',
                    text: 'マッチング・タクシーの到着や決済完了時にお知らせします。'
                });
                break;
            case 2:
                setModalMessage({
                    access: 'マイク',
                    text: '乗務員・マッチング相手との通話機能に利用します。録音はされません。'
                });
                break;
            default:
                setModalMessage({
                    access: 'デフォルトメッセージ',
                    text: 'これが表示されるということは...? なにかおかしいね。'
                });
                break;
        }
    }, [modalState])

    return (
        <>
            <div className={style.authorityWrap}>
                <h2 className={style.title}>最後に以下を許可してください</h2>
                <div className={style.authorityInner}>
                    <div className={style.authorityContents}>
                        {/* 果たしてあのアイコンたちはHTMLとして記述すべき者たちだろうか？ */}
                        {/* また、同じようなものたちだがコンポーネント化できないだろうか？ */}
                        <div className={style.logo}>
                            <picture>
                                <img src="/images/svg/Icon/location.svg" alt="" />
                            </picture>
                        </div>
                        <div className={style.textWrap}>
                            <h3>位置情報の利用</h3>
                            <p>
                                アプリ利用中の地図表示や移動中のタクシーの位置情報、マッチング範囲設定の際に必要です。
                            </p>
                        </div>
                    </div>
                    <div className={style.authorityContents}>
                        <div className={style.logo}>
                            <picture>
                                <img src="/images/svg/Icon/notif.svg" alt="" />
                            </picture>
                        </div>
                        <div className={style.textWrap}>
                            <h3>通知の設定</h3>
                            <p>
                                タクシーの到着・乗務員のメッセージ、マッチング通知などをユーザーにお知らせします。
                            </p>
                        </div>
                    </div>
                    <div className={style.authorityContents}>
                        <div className={style.logo}>
                            <picture>
                                <img src="/images/svg/Icon/mic.svg" alt="" />
                            </picture>
                        </div>
                        <div className={style.textWrap}>
                            <h3>マイクの有効化</h3>
                            <p>
                                乗務員・マッチング相手との通話機能や会計のお支払い時に利用します。録音はされません。
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={() => {
                        setModalState({
                            ...modalState,
                            flag: true,
                            page: 0
                        });
                    }}
                    disabled={false}
                    text="設定する"
                    mainColor={false}
                    className={style.setting}
                />
            </div>
            <div>
                {modalState.flag &&
                    <AccessModal
                        modalState={modalState} setModalState={setModalState}
                        access={modalMessage.access} text={modalMessage.text}
                    />
                }
            </div>
        </>
    );
}


// これがメインの関数。
export default function Page() {
    // アカウント登録のページが今どこなのか見てる。
    const [pageState, setPageState] = useState<number>(0);

    // サーバーで4桁の数字を生成して認証するためのstate。これも実装酷いな...。
    const [pincode, setPincode] = useState<pincodeState>({
        pincode: "", // サーバーから来たpinはここ。
        inputNumber: "", // ユーザーが入力したpinはここ。
    });

    // 電話番号。電話番号入力画面の次でも入力した電話番号を表示する都合だけで使用されている。
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    return (
        <Frame mode={'blue'}>
            <div>
                {/* 最初のページ以外であれば、notificationコンポーネントを描画。これで画面切り替え時もアニメーションが途切れたように見えない。 */}
                {/* しかし完全こちら都合で実装しているので全く良くない。 */}
                {(pageState !== 0) &&
                    <Notification notificationApp={'メッセージ'}
                        // サーバーから送られてきた認証コードを表示している。
                        notificationText={`認証コード : ${pincode.pincode}`}
                    />}

                {/* 戻るための  ＜  ←これ。 */}
                <button
                    // クラス名はprimeicons都合のものと併用している。
                    className={`${style.prev} pi pi-angle-left`}
                    onClick={() => {
                        // pageが一番最初(電話番号入力画面)であれば、その前の紹介ページまで戻る
                        if (pageState === 0) {
                            window.location.href = "/smartphoneApp/startPage/";
                            return;
                        }
                        // ユーザー情報登録から戻るボタンが押された場合、電話番号の入力まで戻す。
                        if (pageState === 2) {
                            setPageState(0)
                            return
                        }
                        // 上記2つの条件ではない場合はすなおにpage -1 する。
                        setPageState(pageState - 1);
                    }}
                ></button>

                {/* pageの番号に応じて表示する内容を変更している。 */}
                {pageState === 0 && (
                    <PhoneNumber
                        pageState={pageState}
                        setPageState={setPageState}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        pincode={pincode}
                        setPincode={setPincode}
                    />
                )}
                {pageState === 1 && (
                    <Authentication
                        phoneNumber={phoneNumber}
                        pageState={pageState}
                        setPageState={setPageState}
                        pincode={pincode}
                        setPincode={setPincode}
                    />
                )}
                {pageState === 2 && (
                    <UserInformation pageState={pageState} setPageState={setPageState} />
                )}
                {pageState === 3 && (
                    <CardInformation pageState={pageState} setPageState={setPageState} />
                )}
                {pageState === 4 && (
                    <Authority />
                )}
            </div>
        </Frame >
    );
}
