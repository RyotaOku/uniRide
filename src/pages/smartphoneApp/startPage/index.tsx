import Footer from "@/components/smartphoneApp/startPage/Footer";
import style from "@/styles/components/smartphoneApp/startPage/main.module.css";
import { Frame } from "@/components/smartphoneApp/common/Frame";
import "@egjs/react-flicking/dist/flicking.css";
import Flicking from "@egjs/react-flicking";

export default function Page() {
  return (
    <Frame mode={'blue'}>
      {/* Flickingを使用して簡単にスワイプでの切り替えを実装。 */}
      {/* コンポーネントの呼び出しには対応していないのか、純粋なHTMLタグでないとエラーになったのでもっと深掘りして見る必要がある */}
      <Flicking gap={100} circular={false} >
        <div className={style.text}>
          <h1 className={style.title}>終電なくてももう安心。</h1>
          {/* 今回はローワーキャメルケースでのclassNameの統一を言ってなかったのですまん。mainTextで合わせたかったね。 */}
          <div className={style.main_text}>
            <p>UniRideで割り勘しちゃおう。</p>
            <p>好きなスポットを選んでマッチングしよう。</p>
          </div>
          <div className={style.map}></div>
        </div>

        <div className={style.text}>
          <h1 className={style.title}>えらべる支払い方法</h1>
          <div className={style.main_text}>
            <p>主要電子マネー・QR決済に対応。</p>
            <p>利用ごとに履歴が残るから安心。</p>
          </div>
          <div className={style.map}></div>
        </div>

        <div className={style.text}>
          <h1 className={style.title}>安心安全なマッチング</h1>
          <div className={style.main_text}>
            <p>身分証明書での本人確認必須。</p>
            <p>学生同士だから安心してマッチングできる。</p>
          </div>
          <div className={style.map}></div>
        </div>
      </Flicking>

      <Footer />
    </Frame>
  );
}
