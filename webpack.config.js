const path = require('path');

module.exports = {

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'awesome-typescript-loader',
			},
		]
	},

	resolve: {
		alias: {
			'@': path.join(__dirname, 'src'),
			'smokescreen': path.join(__dirname, 'libs/smokescreen'),
		},
		extensions: ['.js', '.ts', '.tsx'],
	},
};
