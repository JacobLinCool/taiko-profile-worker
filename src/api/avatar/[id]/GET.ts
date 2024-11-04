import { BlendMode, Jimp, JimpMime, ResizeStrategy } from 'jimp';
import { Endpoint, error, z } from 'sveltekit-api';

const BASIC_Y_OFFSET = 15;
const CACHE_DURATION = 3600;

export enum Position {
	/** Top left corner of the image */
	TopLeft = 'top-left',
	/** Top center of the image */
	TopCenter = 'top-center',
	/** Top right corner of the image */
	TopRight = 'top-right',
	/** Middle left side of the image */
	MiddleLeft = 'middle-left',
	/** Center of the image */
	MiddleCenter = 'middle-center',
	/** Middle right side of the image */
	MiddleRight = 'middle-right',
	/** Bottom left corner of the image */
	BottomLeft = 'bottom-left',
	/** Bottom center of the image */
	BottomCenter = 'bottom-center',
	/** Bottom right corner of the image */
	BottomRight = 'bottom-right',
	/** No rank display */
	None = 'none'
}

export interface Options {
	id: string;
	rank: Position;
	circle: boolean;
	size?: number;
}

export const Param = z.object({
	id: z.string().regex(/^[0-9]+$/)
});

export const Query = z.object({
	rank: z.nativeEnum(Position).default(Position.TopCenter),
	circle: z.coerce.boolean().default(false),
	size: z.coerce.number().min(16).max(512).optional()
});

export const Output = z.instanceof(Response);

export const Error = {
	404: error(404, 'Player not found')
};

export default new Endpoint({ Param, Query, Output, Error }).handle(async (param) => {
	const id = param.id;
	const rank = param.rank;
	const circle = param.circle;
	const size = param.size;

	const options = { id, rank, circle, size };
	return await generate(options);
});

function getImageUrls(id: string) {
	return {
		background: `https://img.taiko-p.jp/imgsrc.php?v=&kind=mydon&fn=mydon_${id}`,
		rank: `https://donderhiroba.jp/imgsrc_danlabel.php?taiko_no=${id}`
	};
}

function calculatePosition(
	background: Awaited<ReturnType<typeof Jimp.read>>,
	rank: Awaited<ReturnType<typeof Jimp.read>>,
	position: Position
): { x: number; y: number } | null {
	if (position === Position.None) {
		return null;
	}

	const width = background.bitmap.width;
	const height = background.bitmap.height;
	const rankWidth = rank.bitmap.width;
	const rankHeight = rank.bitmap.height;

	const positions = {
		[Position.TopLeft]: { x: 0, y: BASIC_Y_OFFSET },
		[Position.TopCenter]: { x: (width - rankWidth) / 2, y: BASIC_Y_OFFSET },
		[Position.TopRight]: { x: width - rankWidth, y: BASIC_Y_OFFSET },
		[Position.MiddleLeft]: { x: 0, y: (height - rankHeight) / 2 },
		[Position.MiddleCenter]: { x: (width - rankWidth) / 2, y: (height - rankHeight) / 2 },
		[Position.MiddleRight]: { x: width - rankWidth, y: (height - rankHeight) / 2 },
		[Position.BottomLeft]: { x: 0, y: height - rankHeight - BASIC_Y_OFFSET },
		[Position.BottomCenter]: {
			x: (width - rankWidth) / 2,
			y: height - rankHeight - BASIC_Y_OFFSET
		},
		[Position.BottomRight]: { x: width - rankWidth, y: height - rankHeight - BASIC_Y_OFFSET }
	};

	return positions[position] || null;
}

async function generate(opt: Options): Promise<Response> {
	const { id, rank: rankPosition, circle, size } = opt;

	try {
		const urls = getImageUrls(id);
		const [background, rank] = await Promise.all([
			Jimp.read(urls.background),
			Jimp.read(urls.rank)
		]);

		const startTime = Date.now();

		const position = calculatePosition(background, rank, rankPosition);
		if (position) {
			background.composite(rank, position.x, position.y, { mode: BlendMode.SRC_OVER });
		}

		if (circle) {
			background.circle({ radius: background.bitmap.width / 2 });
		}

		if (size && size !== background.bitmap.width) {
			const sz = Math.min(size, 512);
			background.resize({ w: sz, h: sz, mode: ResizeStrategy.BICUBIC });
		}

		console.log('Image generated in', Date.now() - startTime, 'ms');

		const buffer = await background.getBuffer(JimpMime.png);
		return new Response(buffer, {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}`
			}
		});
	} catch (err) {
		console.error('Error generating image:', err);
		return new Response('An error occurred while processing the image.', { status: 500 });
	}
}
