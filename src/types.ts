export enum Position {
    /** Top left corner of the image */
    TopLeft = 'topleft',
    /** Top center of the image */
    TopCenter = 'topcenter',
    /** Top right corner of the image */
    TopRight = 'topright',
    /** Middle left side of the image */
    MiddleLeft = 'middleleft',
    /** Center of the image */
    MiddleCenter = 'middlecenter',
    /** Middle right side of the image */
    MiddleRight = 'middleright',
    /** Bottom left corner of the image */
    BottomLeft = 'bottomleft',
    /** Bottom center of the image */
    BottomCenter = 'bottomcenter',
    /** Bottom right corner of the image */
    BottomRight = 'bottomright',
    /** No rank display */
    None = 'none',
}

export interface Options {
    id: string;
    rank: Position;
    circle: boolean;
    size?: number;
}
