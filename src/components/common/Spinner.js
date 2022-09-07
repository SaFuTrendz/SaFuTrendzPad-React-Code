import React, { Fragment } from 'react';
import spinner from '../assets/img/Rocket.gif';
import { Loader } from 'rsuite';

const Spinner = () => (
	<div>
			<Fragment>
			<Loader size="lg" content="Loading..." />
		</Fragment>
	</div>
);

export default Spinner;
