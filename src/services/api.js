export const API_URL = 'http://localhost:3000';
import { useApiFetch } from './apiFetch';

export async function getPosts() {
	const res = await useApiFetch(`${API_URL}/posts`);
	const json = await res.json();
	return json.data;
}
