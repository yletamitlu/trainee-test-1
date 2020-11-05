import * as React from 'react';

import {storiesOf} from '@storybook/react';

import RenderComponent from '../.storybook/components/RenderComponent';

const stories = storiesOf('components', module);

stories
	.add('left', () => (
		<RenderComponent/>
	));
