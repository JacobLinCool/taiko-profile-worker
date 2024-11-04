import { BlendMode, Jimp, JimpMime, ResizeStrategy } from 'jimp';
import { Options, Position } from './types';

const DEFAULT_ID = '953144833346';
const BASIC_Y_OFFSET = 15;
const CACHE_DURATION = 3600;

export default {
    async fetch(request: Request) {
        if (request.url.includes('favicon.ico')) {
            return new Response(null, { status: 404 });
        }

        const url = new URL(request.url);
        const id = url.searchParams.get('id') || DEFAULT_ID;
        const rank =
            (url.searchParams
                .get('rank')
                ?.toLowerCase()
                .replace(/[^a-z]/g, '') as Position) || Position.TopCenter;
        const circle = url.searchParams.has('circle');
        const size = parseInt(url.searchParams.get('size') || '0', 10) || undefined;

        const options = { id, rank, circle, size };
        return await generate(options);
    },
} satisfies ExportedHandler<Env>;

const getImageUrls = (id: string) => ({
    background: `https://img.taiko-p.jp/imgsrc.php?v=&kind=mydon&fn=mydon_${id}`,
    rank: `https://donderhiroba.jp/imgsrc_danlabel.php?taiko_no=${id}`,
});

const calculatePosition = (
    background: Awaited<ReturnType<typeof Jimp.read>>,
    rank: Awaited<ReturnType<typeof Jimp.read>>,
    position: Position,
): { x: number; y: number } | null => {
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
            y: height - rankHeight - BASIC_Y_OFFSET,
        },
        [Position.BottomRight]: { x: width - rankWidth, y: height - rankHeight - BASIC_Y_OFFSET },
    };

    return positions[position] || null;
};

async function generate(opt: Options): Promise<Response> {
    const { id, rank: rankPosition, circle, size } = opt;

    try {
        const urls = getImageUrls(id);
        const [background, rank] = await Promise.all([
            Jimp.read(urls.background),
            Jimp.read(urls.rank),
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
                'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}`,
            },
        });
    } catch (err) {
        console.error('Error generating image:', err);
        return new Response('An error occurred while processing the image.', { status: 500 });
    }
}
