import style from "@/styles/components/smartphoneApp/startPage/footer.module.css";
import Button from "@/components/smartphoneApp/common/Button";
import { Frame } from "@/components/smartphoneApp/common/Frame";

export default function Footer() {
    return (
        // Frameコンポーネントを使って背景を設定（'blue'モード）
        <Frame mode={'blue'}>
            <div className={style.wrap}>
                <Button
                    disabled={false}  // ボタンは有効な状態
                    text={"UniRideを利用する"}  // ボタンのテキスト
                    mainColor={true}  // メインカラー（青）でボタンを表示
                    link={"/smartphoneApp/startPage/accountRegistration"}  // ボタンをクリックすると遷移するURL
                />
                <a href="#" className={style.already}>
                    既にアカウントをお持ちの方
                    {/* すでにアカウントを持っている人のためのリンク */}
                </a>
            </div>
        </Frame>
    );
}