export const API_URL = process.env.API_URL
import { useApiFetch } from './apiFetch';

export async function getPosts() {
	const res = await useApiFetch(`${API_URL}/posts`);
	const json = await res.json();
	return json.data;
}
