import {getBewilderedStr} from "../utils/bewilder";
import {configure, render} from "enzyme";
import * as React from "react";
import Image from "src/components/base/Image";
import Adapter from "enzyme-adapter-react-16";
import SmokeText from "src/components/base/SmokeText";

configure({ adapter: new Adapter() });

test('testing Image element', () => {
    const image = render(<div><Image image={"unimportant"} width={88} height={88}/></div>);

    expect(image.find('div')).toHaveLength(1);
    expect(image.find('img')).toHaveLength(0);
    expect(image.prop('style')).toHaveLength(0);
});

// При тестироовании в методе componentDidMount() SmokeText элемента нужно закомментировать wrap(),
// так как иначе тесты не проходят (на суть тестов wrap() не влияет)
// (скорее всего это из-за модулей - не commonJS, а AMD)

test('testing the protection string against regular expression searches in SmokeText element #1', () => {
    const smokeText = render(<SmokeText identifier={"ident"} text={"Москва"}/> );

    expect(/м.*о.*с.*к.*в.*а/i.test(smokeText.children().text())).not.toBeTruthy();
});

test('testing the protection string against regular expression searches in SmokeText element #2', () => {
    const smokeText = render(<SmokeText identifier={"ident"} text={"18+"}/> );

    expect(/18\+/.test(smokeText.children().text())).not.toBeTruthy();
});

test('testing getBewilderedStr #1', () => {
    expect(/м.*о.*с.*к.*в.*а/i.test("Москва")).toBeTruthy();
    expect(/м.*о.*с.*к.*в.*а/i.test(getBewilderedStr("Москва"))).not.toBeTruthy();
});

test('testing getBewilderedStr #2', () => {
    expect(/18\+/.test("18+")).toBeTruthy();
    expect(/18\+/.test(getBewilderedStr("18+"))).not.toBeTruthy();
});

test('testing getBewilderedStr #3', () => {
    expect(/.+ru/.test("schastye.ru")).toBeTruthy();
    expect(/.+ru/.test(getBewilderedStr("schastye.ru"))).not.toBeTruthy();
    expect(/s.*c.*h.*a.*s.*t.*y.*e/.test("schastye.ru")).toBeTruthy();
    expect(/s.*c.*h.*a.*s.*t.*y.*e/.test(getBewilderedStr("schastye.ru"))).not.toBeTruthy();
});

test('testing getBewilderedStr #4', () => {
    expect(/.* на .*/.test("Проектная декларация на рекламируемом сайте.")).toBeTruthy();
    expect(/.* на .*/.test(getBewilderedStr("Проектная декларация на рекламируемом сайте."))).not.toBeTruthy();
});
