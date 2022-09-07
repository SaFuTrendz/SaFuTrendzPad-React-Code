import { GET_VERIFY } from './types';

// Get current data
export const getVerify = (data) => {
	return {
		type: GET_VERIFY,
		payload: data
	};
};
