# SHARPIE / RALLY

Custom Gamepad Viewer skin for the white PS4 layout (`s=8`): blue shell, red-and-white racing stripes, cyan controls, and a SHARPIE touchpad with a brief red/cyan glitch every five seconds. The animation is part of the transparent shell GIF. Each moving control is a separate asset; Gamepad Viewer continues to handle live input.

## Install in OBS

Open the [Rally controller overlay](https://app.gpv.gg/?p=1&s=8&editcss=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fitssharpie%2Fstreamassets%40main%2Frally%2Frally.css) and copy its full address into the existing Controller Browser Source URL.

Replace old custom skin CSS in the OBS source with:

```css
body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }
```

Keep the existing Browser Source viewport and scene transform. Hide the separate sharpie text or glitch source because the animated name is already in the artwork. Remove any earlier glitch Custom CSS to avoid applying the effect twice. Refresh the source cache if needed.

The link above loads the main branch through jsDelivr. For a fixed release, replace `main` in the CSS URL with the full commit SHA, then URL-encode that CSS address as the `editcss` parameter.

## Files

- `rally.css`: controller styling, using relative image paths.
- `assets/shell-glitch.gif`: transparent animated shell and nameplate; 806 × 598, five-second loop.
- `assets/shell.png`: original full-resolution static artwork, retained for rebuilding.
- `assets/stick-cap.png`: independently moving cap for each stick.
- `assets/face-*.svg`, `dpad-*.svg`, and `trigger-*.svg`: idle and pressed artwork.
- `assets/bumper-pressed.svg`: bumper activation artwork.
- `build.mjs`: regenerates SVG controls, CSS, and an embedded OBS stylesheet with Node.js; preserves the PNG and GIF artwork.
- `build-shell-gif.cjs` and `source/shell-glitch.css`: reproducible animation source. With Node.js, Playwright Chromium, FFmpeg, and ImageMagick installed, run `node build-shell-gif.cjs` and then `node build.mjs`. Optionally set `CHROMIUM_PATH` to an existing Chromium executable.
- `make-viewer-link.html`: local link builder for another public CSS address.

The stylesheet and complete `assets` directory must stay together. GIF uses an indexed palette and binary transparency; the original PNG remains available for a static version.

## Validation

The kit was checked with Gamepad Viewer's input drawing functions: stick movement and rotation, L3/R3, all face buttons and D-pad directions, bumpers, Share/Options, touchpad, trigger pressure, release, and disconnect. The embedded and separate-asset stylesheets produced identical screenshots. Verify the physical controller in OBS after installation.

## Credits

The original DS4 layout is based on Gamepad Viewer / Mr McPowned and its white-skin contributor. Rally artwork and implementation were created for sharpie as an independent stream customization.
