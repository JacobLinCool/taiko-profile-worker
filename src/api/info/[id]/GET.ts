import { env } from '$env/dynamic/private';
import { parse } from '$lib';
import { Endpoint, error, z } from 'sveltekit-api';

export const Param = z.object({
	id: z.string().regex(/^[0-9]+$/)
});

export const Output = z.any();

export const Error = {
	404: error(404, 'Player not found'),
	500: error(500, 'Token not set')
};

export default new Endpoint({ Param, Output, Error }).handle(async (param) => {
	const token = env.TAIKO_TOKEN;
	if (!token) {
		throw Error[500];
	}

	const url = `https://donderhiroba.jp/user_profile.php?taiko_no=${param.id}`;
	const html = await fetch(url, {
		headers: {
			cookie: `_token_v2=${token}`,
			'user-agent': 'Mozilla/5.0 AppleWebKit'
		}
	}).then((r) => r.text());

	return parse(html);
});
