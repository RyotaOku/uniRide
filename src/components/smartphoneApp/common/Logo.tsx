import styles from '@/styles/components/smartphoneApp/common/logo.module.css'


// クレジットカードのロゴを表示するコンポーネント。もっとちゃんとした実装にしたい。
export function Logo() {
    return (
        <div className={styles.logoWrapper}>
            <img src="public/images/svg/amex.svg" alt="" />
            <img src="public/images/svg/jcb.svg" alt="" />
            <img src="public/images/svg/mastercard.svg" alt="" />
            <img src="public/images/svg/visa.svg" alt="" />
        </div>
    )
}