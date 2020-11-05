const baseConfig = require('../webpack.config');

module.exports = ({config}) => {
	config.amd = baseConfig.amd;
	config.resolve.alias = baseConfig.resolve.alias;
	config.resolve.extensions = baseConfig.resolve.extensions;
	config.module.rules = baseConfig.module.rules;

	return config;
};
