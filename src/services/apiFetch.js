import { useNavigate } from 'react-router-dom';

export function useApiFetch() {
	const navigate = useNavigate();

	return async (url, options = {}) => {
		const res = await fetch(url, options);

		if (res.status === 401) {
			navigate('/');
			return;
		}
		return res;
	};
}
