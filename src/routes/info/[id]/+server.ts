import api from '$api';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (evt) => api.handle(evt);
