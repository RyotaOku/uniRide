import { useState } from "react";
import { Footer } from "@/components/smartphoneApp/mainPage/Footer";
import { Frame } from "@/components/smartphoneApp/common/Frame";

export default function Page() {
    // mainのマップページ。最初の読込み時のmapアニメーションはCSSのみで実装している。
    return (
        <Frame mode={'map'}>
            <Footer />
        </Frame>
    )
}
