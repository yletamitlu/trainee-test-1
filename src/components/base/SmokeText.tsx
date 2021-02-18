import * as React from "react";
import {wrap} from "smokescreen/Welter.js"
import getBewilderedStr from "./utils/bewilder"

// Для защиты от XPath - использование функции wrap для генерации DOM-элементов вокруг SmokeText и
// использование кастомного тега, который каждый раз меняется при перезагрузке страницы (класс элемента - таким же образом)

// Для защиты от поиска по регулярному выражению - подмена визуально похожими символами из таблицы Юникода

interface ISmokeTextProps {
    text: string,
    identifier: string
}

interface ISmokeTextState {}

class SmokeText extends React.Component<ISmokeTextProps, ISmokeTextState> {
    constructor(props: ISmokeTextProps) {
        super(props);
        this.state = {isRendered: false};
    }

    componentDidMount() {
        const currentItem = document.querySelector(
            `[data-text="${getBewilderedStr(this.props.text)}"]`);

        if (currentItem) {
            wrap(currentItem.parentElement, `.${this.extractIdentifier()}-smoke`);
        }
    }

    extractIdentifier() {
        const array = this.props.identifier.split(' ');

        if (array[0]) {
            return array[0];
        }

        return this.props.identifier;
    }

    render() {
        const tag = this.extractIdentifier();
        let content = getBewilderedStr(this.props.text);
        let data = getBewilderedStr(this.props.text);

        return <div className={`${tag}-smoke-wrapper`} dangerouslySetInnerHTML={{
            __html:
                `<${tag} class="${tag}-smoke" data-text="${data}">${content}</${tag}>`
        }}/>;
    }
}

export default SmokeText;
