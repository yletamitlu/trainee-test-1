import {configure} from '@storybook/react';

const requireContext = require.context('../src', true, /(.*\.)?stories\.tsx$/);

const loadStories = () =>
	requireContext.keys().map(requireContext);

configure(loadStories, module);
