import getBewilderedStr from "../utils/bewilder";
import {configure} from 'enzyme';
import * as React from "react";
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

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
