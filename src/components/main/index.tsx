import * as React from 'react';

import {updateStyle} from '../../utils/slotSheet';

import sheet from './styles';

import Block from '../base/Block';

import Left from './left/index';

let style = null;

export default class extends React.Component<any> {

	componentWillMount() {
		const {
			locator,
		} = this.props;

		style = updateStyle(style, locator, sheet(locator));
	}

	render() {
		const {
			locator,
			items,
			transform,
			onRender,
		} = this.props;

		return (
			<Block className={transform(`mimic mimic_left`)}>
				<Left
					items={items}
					locator={locator}
					transform={transform}
					onRender={onRender}
				/>
			</Block>
		);
	}
}
