import * as React from 'react';

export default ({children, ...props}) => {
	if (typeof children === 'string') {
		return (
			<div
				{...props}
				dangerouslySetInnerHTML={{__html: children}}
			/>
		);
	}

	return (
		<div
			{...props}
		>{children}</div>
	);
};
