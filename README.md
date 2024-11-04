# Taiko Profile Worker

Generate avatars for Taiko no Tatsujin players.

[![circle](https://taiko-profile.jacob.workers.dev/?id=953144833346&circle)](https://taiko-profile.jacob.workers.dev/?id=953144833346&circle)

[![square](https://taiko-profile.jacob.workers.dev/?id=051574601641)](https://taiko-profile.jacob.workers.dev/?id=051574601641)

## Options

- `id`: The player's ID. **Required**.
- `circle`: Crop the avatar into a circle. Optional.
- `size`: The size of the avatar. Optional. Default: 290. Maximum: 512.
- `rank`: The player's rank position. Optional. Default: `top-center`. Available: `top-left`, `top-center`, `top-right`, `middle-left`, `middle-center`, `middle-right`, `bottom-left`, `bottom-center`, `bottom-right`, `none`.

```sh
https://taiko-profile.jacob.workers.dev/?id=<id>&rank=<rank>&size=<size>&circle
```
