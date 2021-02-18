import {getRandomStr} from "../../utils/bewilder"

import * as React from "react";

interface IImageProps {
    image: string,
    width: string,
    height: string,
}

interface IImage {
}

class SmokeText extends React.Component<IImageProps, IImage> {
    className: string;

    constructor(props: IImageProps) {
        super(props);

        this.className = getRandomStr();
    }

    componentDidMount() {
        const image = document.querySelector(`.${this.className}-image`);

        if (image) {
            const childStyle = image.children[0];
            if (childStyle) {
                childStyle.innerHTML = `.${image.className} {
                        background-image: url(${this.props.image});
                        width: ${this.props.width}px;
                        height: ${this.props.height}px;}`;
            }
        }
    }

    render() {
        return <div className={`${this.className}-image`}><style></style></div>
    }
}

export default SmokeText;
