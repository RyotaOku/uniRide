import styles from '@/styles/components/smartphoneApp/common/frame.module.css'

// Frameコンポーネントに渡せるprops（プロパティ）の型を定義
export type FrameProps = {
    children?: React.ReactNode,  // 子コンポーネント（オプショナル）
    mode: string  // モードを指定する文字列（'map'か'blue'など）
}
// ↑ 正直、modeに関しては都合上追加しただけで駄作。


// Frameコンポーネントの定義。このFrameコンポーネントで各画面の幅やスタイルを統一して実装。
export function Frame(props: FrameProps) {
    // classNameを初期化。modeプロパティに応じて適用するCSSクラスを決定
    let className = props.mode === 'map' ? styles.map + ' ' : ''

    // modeが'blue'の場合は、styles.frameクラスを追加
    className += props.mode === 'blue' ? styles.frame + ' ' : ''

    // Frameコンポーネントのレンダリング
    return (
        <div className={className}>
            {/* 子コンポーネントを表示 */}
            {props.children}
        </div>
    )
}