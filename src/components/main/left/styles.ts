import teaserSheet from './teaser/styles';

export default locator => {

	const styles = {
		'.mimic_left .wrapper': {
			'width':  locator.calcString(240, 'px')
		},

		'.mimic_left .wrapper_frame': {
			'border-radius': locator.calcString(2, 'px'),
			'border': '1px solid #ccc',
		},
	};

	Object.assign(styles, teaserSheet(locator));

	return styles;
};
