import { selectAll as select, selectOne } from 'css-select';
import { parseDocument } from 'htmlparser2';

export interface UserProfile {
	title: string;
	username: string;
	region: string;
	favoriteSong: string | null;
	crown: {
		donderful: number;
		gold: number;
		silver: number;
	};
	badge: {
		kiwami100: number;
		miyabi95: number;
		miyabi90: number;
		miyabi80: number;
		iki70: number;
		iki60: number;
		iki50: number;
	};
	news: {
		title: string;
	}[];
}

export function parse(html: string): UserProfile {
	const document = parseDocument(html);

	const mainArea = selectOne('#mydon_area', document);
	if (!mainArea) {
		throw new Error('parse failed: main area');
	}

	const titleElemtn = selectOne('div', mainArea);
	// @ts-expect-error bad typed
	const title = titleElemtn?.children[0]?.data.trim() || '';

	const usernameElement = selectOne('div > div', mainArea);
	// @ts-expect-error bad typed
	const username = usernameElement?.children[0]?.data.trim() || '';

	const regionElement = select('#mydon_area .detail p', document)[0];
	// @ts-expect-error bad typed
	const region = regionElement?.children[0]?.data.split('：')[1].trim() || '';

	const favoriteSongElement = selectOne('#songList .songName', document);
	// @ts-expect-error bad typed
	let favoriteSong = favoriteSongElement?.children[0]?.data.trim();
	if (favoriteSong === '未設定') {
		favoriteSong = null;
	}

	const crownElements = select('.total_score .total_panel_crown_display', document);
	const crown = {
		// @ts-expect-error bad typed
		donderful: parseInt(crownElements[2]?.children[0]?.data || '0', 10),
		// @ts-expect-error bad typed
		gold: parseInt(crownElements[1]?.children[0]?.data || '0', 10),
		// @ts-expect-error bad typed
		silver: parseInt(crownElements[0]?.children[0]?.data || '0', 10)
	};

	const badgeElements = select('.total_score .total_panel_display', document);
	const badge = {
		// @ts-expect-error bad typed
		kiwami100: parseInt(badgeElements[0]?.children[0]?.data || '0', 10),
		// @ts-expect-error bad typed
		miyabi95: parseInt(badgeElements[1]?.children[0]?.data || '0', 10),
		// @ts-expect-error bad typed
		miyabi90: parseInt(badgeElements[2]?.children[0]?.data || '0', 10),
		// @ts-expect-error bad typed
		miyabi80: parseInt(badgeElements[3]?.children[0]?.data || '0', 10),
		// @ts-expect-error bad typed
		iki70: parseInt(badgeElements[4]?.children[0]?.data || '0', 10),
		// @ts-expect-error bad typed
		iki60: parseInt(badgeElements[5]?.children[0]?.data || '0', 10),
		// @ts-expect-error bad typed
		iki50: parseInt(badgeElements[6]?.children[0]?.data || '0', 10)
	};

	const newsElements = select('#news .newslist', document);
	const news = newsElements.map((newsElement) => {
		const text = select('span.newsli.text', newsElement)[0];
		const link = select('a', newsElement)[0];
		let title = '';
		if (link) {
			// @ts-expect-error bad typed
			title = link?.children[0]?.data.trim() || '';
		} else {
			// @ts-expect-error bad typed
			title = text?.children[0]?.data.trim() || '';
		}
		title = title.split('、')[1] || '';
		return { title };
	});

	return {
		title,
		username,
		region,
		favoriteSong,
		crown,
		badge,
		news
	};
}
