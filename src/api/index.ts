// file: src/api/index.ts
import { API } from 'sveltekit-api';

const api = new API(import.meta.glob('./**/*.ts'), {
	openapi: '3.0.0',
	info: {
		title: 'Taiko Profile API',
		version: '1.0.0',
		description: 'Taiko Profile API'
	}
});

api.base = '';

export default api;
