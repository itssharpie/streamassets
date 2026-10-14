/* Encode the existing SHARPIE glitch animation into the shell image.
   Requires Node.js, playwright, ffmpeg and ImageMagick. Set CHROMIUM_PATH if needed.
   No live controls are baked into this GIF. */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

async function main() {
  const root = __dirname;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rally-shell-'));
  const shell = pathToFileURL(path.join(root, 'assets/shell.png')).href;
  const effect = fs.readFileSync(path.join(root, 'source/shell-glitch.css'), 'utf8')
    .replaceAll('../assets/shell.png', shell);
  const html = `<!doctype html><meta charset="utf-8"><style>
  html,body {width:806px;height:598px;margin:0;background:transparent;overflow:hidden}
  .controller {position:relative;width:806px;height:598px;background:url("${shell}") 0 0 / 806px 598px no-repeat}
  .touchpad {position:absolute;left:272px;top:120px;width:262px;height:153px}
  ${effect}</style><div class="controller ds4 white"><div class="touchpad"></div></div>`;
  fs.writeFileSync(path.join(tmp, 'render.html'), html);
  const options = { headless:true, args:['--no-sandbox', '--disable-dev-shm-usage'] };
  if (process.env.CHROMIUM_PATH) options.executablePath = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(options);
  try {
    const page = await browser.newPage({ viewport:{width:806,height:598}, deviceScaleFactor:1 });
    await page.goto(pathToFileURL(path.join(tmp, 'render.html')).href);
    await page.evaluate(async src => { const image=new Image(); image.src=src; await image.decode(); }, shell);
    // One complete 5-second loop at 25 fps; the first glitch starts after 0.44 s.
    for (let i=0; i<125; i++) {
      await page.evaluate(t => document.getAnimations().forEach(a => { a.pause(); a.currentTime=t; }), ((i+90)%125)*40);
      await page.screenshot({path:path.join(tmp, `${String(i).padStart(3,'0')}.png`), omitBackground:true});
    }
  } finally { await browser.close(); }
  execFileSync('ffmpeg', ['-hide_banner','-loglevel','error','-y','-framerate','25',
    '-i',path.join(tmp,'%03d.png'),'-filter_complex',
    '[0:v]split[a][b];[a]palettegen=reserve_transparent=1:stats_mode=full[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle:alpha_threshold=128',
    '-loop','0',path.join(tmp,'unoptimized.gif')], {stdio:'inherit'});
  // Merge repeated idle frames and store only changing plate rectangles.
  execFileSync('convert', [path.join(tmp,'unoptimized.gif'),'-coalesce','-layers','Optimize',
    path.join(root,'assets/shell-glitch.gif')], {stdio:'inherit'});
  fs.rmSync(tmp,{recursive:true,force:true});
  console.log('Built assets/shell-glitch.gif (806 x 598; 5-second transparent loop).');
}
main().catch(error => { console.error(error); process.exit(1); });
