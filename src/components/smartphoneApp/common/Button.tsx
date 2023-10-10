import style from '@/styles/components/smartphoneApp/common/button.module.css'

// Buttonコンポーネントに渡せるprops（プロパティ）の型を定義
type ButtonProps = {
    disabled: boolean,  // ボタンが無効かどうか（true: 無効, false: 有効）
    text: string,  // ボタンに表示されるテキスト
    mainColor: boolean,  // メインカラーを適用するかどうか
    link?: string,  // クリック時に遷移するURL（オプショナル）
    onClick?: () => void,  // クリック時に実行する関数（オプショナル）
    className?: string  // 任意の追加CSSクラス（オプショナル）
}
// 値の末尾に?がついている場合、そのプロパティはオプショナル（つまり、必須ではない）



// Buttonコンポーネントの定義
export default function Button(props: ButtonProps) {

    // ボタンの基本的なCSSクラス名を設定
    // 無効かどうかでまず基本を設定
    let baseClassName = props.disabled ? style.disabledButton : style.button;

    // 追加で適用するCSSクラス名（メインカラーを適用する場合）
    let additionalClassName = props.mainColor ? style.mainColor : "";

    // 最終的なCSSクラス名を結合
    let className = `${baseClassName} ${additionalClassName}`;

    // ボタンクリック時の処理。本当はちゃんと名前を決めなければならないが...。
    const handleClick = () => {
        // ボタンが無効な場合、何もしない
        if (props.disabled) {
            return;
        }

        // linkプロパティが指定されている場合、そのURLに遷移する
        if (props.link) {
            window.location.href = props.link;
            return;
        }

        // onClickプロパティが指定されている場合、その関数を呼び出す
        if (props.onClick) {
            props.onClick();
            return;
        }
    }

    // Buttonコンポーネントのレンダリング
    return (
        <>
            {/* ボタン要素の生成。クラス名とクリック時の処理を設定 */}
            <button className={className.trim() + ' ' + props.className} onClick={handleClick}>{props.text}</button>
        </>
    )
}