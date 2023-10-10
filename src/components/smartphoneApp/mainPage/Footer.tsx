import { useState } from "react";
import style from "@/styles/components/smartphoneApp/mainPage/navigationBar.module.css";
import Button from "@/components/smartphoneApp/common/Button";

type navigation = {
    open: boolean;
    kind: string;
};

// main画面の下部
export function Footer() {
    // ナビゲーションの状態を管理するuseState。
    const [navigationOpen, setNavigationOpen] = useState<navigation>({
        open: false, // 開いている状態かどうか。
        kind: "", // 開かれている種類。今回はcallTaxiしかない。
    });

    // 現在地を入力しているように見せるためだけのstate。場所を入力する。
    const [spot, setSpot] = useState('')

    // タクシーを呼ぶフローの画面切り替えのためのstate。
    const [step, setStep] = useState(0)

    return (
        // navigationがopen状態かつ開かれている種類がcallTaxiの場合にopenWrapクラスがつく。
        <div className={(navigationOpen.open && navigationOpen.kind === 'callTaxi') ? style.openWrap : style.wrap}>
            {(navigationOpen.open && navigationOpen.kind === 'callTaxi') && (
                <>
                    {/* 閉じる線。 */}
                    <button className={style.switch} onClick={() => {
                        setNavigationOpen({
                            ...navigationOpen,
                            open: false,
                            kind: ''
                        })
                    }}></button>
                    {step === 0 && <>
                        {/* タグたち。radioで実装しているがタダのハリボテ */}
                        <div className={style.tags}>
                            <input type="radio" name='tags' className={style.check} id={'one'} />
                            <label htmlFor="one" className={style.label}>HOME</label>

                            <input type="radio" name='tags' className={style.check} id={'two'} />
                            <label htmlFor="two" className={style.label}>Favorite</label>

                            <input type="radio" name='tags' className={style.check} id={'three'} />
                            <label htmlFor="three" className={style.label}>Saved</label>

                            <input type="radio" name='tags' className={style.check} id={'four'} />
                            <label htmlFor="four" className={style.label}>Near</label>

                            <input type="radio" name='tags' className={style.check} id={'five'} />
                            <label htmlFor="five" className={style.label}>HOME</label>
                        </div>

                        {/* 検索するためのinput。本当はこれもコンポーネント化しなければならないが...。 */}
                        <div className={style.searchWrap}>
                            <div className={style.nowSpotWrap}>
                                {/* 「現在地を入力」の候補表示、クリックしたときに現在地(ECC comp.の住所)が入力され、
                                まるで本当に現在地を取得しているように見える。 */}
                                <input type="text" className={style.nowSpot} placeholder='乗車地を選択' value={spot} onChange={(e) => {
                                    setSpot(e.target.value)
                                }} />
                                {spot === '' && <button className={style.location} onClick={() => {
                                    setSpot('大阪市中崎西2丁目3-35')
                                    setTimeout(() => {
                                        setSpot('大阪市中崎西2丁目3-35')
                                    }, 200);
                                }}>現在地を使用する</button>}
                            </div>
                            <div className={style.nowSpotWrap}>
                                <input type="text" className={style.nowSpot} placeholder='目的地を選択' />
                            </div>
                            <Button disabled={false} mainColor={true} text={'次へ進む'} className={style.nextButton} onClick={() => {
                                setStep(1)
                            }} />
                        </div>
                    </>}

                    {step === 1 && <>
                        <div className={style.step2} onClick={() => {
                            window.location.href = "/smartphoneApp/mainPage/matching";
                        }}></div>
                    </>}
                </>
            )}
            {(navigationOpen.open && navigationOpen.kind === 'menu') && (
                <>
                    <div className={style.switch}>メニュー画面</div>
                </>
            )}

            {!navigationOpen.open && (
                <>
                    <button
                        className={style.navigation + " " + style.taxi}
                        id={(navigationOpen.open && navigationOpen.kind === 'callTaxi') ? style.on : ''}
                        onClick={() => {
                            setNavigationOpen({
                                ...navigationOpen,
                                open: true,
                                kind: "callTaxi",
                            });
                        }}
                    >
                        今すぐ呼ぶ
                    </button>

                    <button
                        className={style.navigation + " " + style.menu}
                        onClick={() => {
                            setNavigationOpen({
                                ...navigationOpen,
                                open: true,
                                kind: "menu",
                            });
                        }}
                    >
                        メニュー
                    </button>
                </>
            )}
        </div>
    );
}
