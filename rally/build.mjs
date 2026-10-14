import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const assets=path.join(root,'assets');
const write=(name,text)=>fs.writeFileSync(path.join(assets,name),text);
const svg=(w,h,body,defs='')=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`;
const gradient=(id,a,b)=>`<linearGradient id="${id}" x1="0" y1="0" x2=".6" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

const glyphs={
 cross:'<path d="M17 17L38 38M38 17L17 38"/>',
 circle:'<circle cx="27.5" cy="27.5" r="15"/>',
 square:'<path d="M14 14H41V41H14Z"/>',
 triangle:'<path d="M27.5 12L44 40H11Z"/>'
};
const colors={cross:'#65b8ff',circle:'#ff456b',square:'#ed65f1',triangle:'#41f6d2'};
for(const [name,glyph] of Object.entries(glyphs))for(const active of [false,true]){
 const color=active?'#ffffff':colors[name];
 const defs=gradient('rim',active?'#e9ffff':'#263648',active?'#76ddff':'#070d18')+gradient('face',active?'#087dfb':'#121a27',active?'#052f90':'#060a12');
 const body=`<circle cx="27.5" cy="27.5" r="26" fill="url(#rim)" stroke="${active?'#ecffff':'#1d2938'}" stroke-width="1.3"/><circle cx="27.5" cy="27.5" r="22.5" fill="url(#face)"/><g fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>`;
 write(`face-${name}${active?'-pressed':''}.svg`,svg(55,55,body,defs));
}

const dShape='M2 8Q2 1 10 1H26Q34 1 34 8V30Q34 34 31 37L21 49Q18 53 15 49L5 37Q2 34 2 30Z';
for(const direction of ['up','down','left','right'])for(const active of [false,true]){
 const horizontal=['left','right'].includes(direction);
 const [w,h]=horizontal?[52,36]:[36,52];
 const transform={up:'',down:'translate(36 52) rotate(180)',left:'translate(0 36) rotate(-90)',right:'translate(52 0) rotate(90)'}[direction];
 const defs=gradient('blue',active?'#ffffff':'#04edff',active?'#86ccff':'#0073f1');
 const body=`<g transform="${transform}"><path d="${dShape}" fill="url(#blue)" stroke="${active?'#ffffff':'#00b7ff'}" stroke-width="1.4"/><path d="M7 8Q8 5 13 5H26" fill="none" stroke="${active?'#ffffff':'#78ffff'}" stroke-width="1.4" opacity=".8"/><path d="M7 35L17 45Q18 47 20 45L30 34" fill="none" stroke="#004aa0" stroke-width="1" opacity=".45"/></g>`;
 write(`dpad-${direction}${active?'-pressed':''}.svg`,svg(w,h,body,defs));
}

for(const side of ['left','right'])for(const active of [false,true]){
 const defs=gradient('trigger',active?'#ecffff':'#0570fc',active?'#0098ed':'#00249d');
 const body=`<path d="M4 87C7 64 11 26 24 12Q34 2 50 3Q71 3 81 20C89 40 93 66 96 87Q48 79 4 87Z" fill="url(#trigger)" stroke="#05dfff" stroke-width="1.5"/><path d="M6 84Q49 77 94 84L96 89Q49 81 4 89Z" fill="#ee1338"/><path d="M29 13Q49 7 72 15" stroke="#5aeaff" fill="none" stroke-width="2" opacity=".9"/><text x="50" y="66" text-anchor="middle" fill="${active?'#003b85':'#40e9ff'}" font-family="Arial,Helvetica,sans-serif" font-size="19" font-weight="700">${side==='left'?'L2':'R2'}</text>`;
 write(`trigger-${side}${active?'-pressed':''}.svg`,svg(99,90,body,defs));
}
write('bumper-pressed.svg',svg(99,23,'<path d="M2 20Q2 8 16 6Q48-1 83 6Q97 9 97 20Z" fill="url(#b)" stroke="#b4faff" stroke-width="1.3"/>',gradient('b','#f2ffff','#168bec')));

const css=`/* SHARPIE / RALLY — Gamepad Viewer DS4 White (s=8)
   Hosted use: https://app.gpv.gg/?p=1&s=8&editcss=YOUR_ENCODED_CSS_URL
   This file and the assets directory must stay together.
   GPV continues to own live input, stick movement and trigger pressure.
*/
html, body { background:transparent !important; margin:0; overflow:hidden; }
/* Warm the pressed-state images before the first controller input. */
body::before {
  content: url("assets/bumper-pressed.svg") url("assets/dpad-down-pressed.svg") url("assets/dpad-left-pressed.svg") url("assets/dpad-right-pressed.svg") url("assets/dpad-up-pressed.svg") url("assets/face-circle-pressed.svg") url("assets/face-cross-pressed.svg") url("assets/face-square-pressed.svg") url("assets/face-triangle-pressed.svg") url("assets/trigger-left-pressed.svg") url("assets/trigger-right-pressed.svg");
  position:fixed; left:-10000px; top:-10000px;
  width:1px; height:1px; overflow:hidden;
  visibility:hidden; pointer-events:none;
}
.controller.ds4.white:not(.disconnected) {
  background-image:url("assets/shell-glitch.gif");
  background-size:806px 598px;
  background-repeat:no-repeat;
  background-position:0 0;
}
/* Keep the control layers separate from the illustrated shell. */
.ds4.white .sticks { left:229.4px; top:308.1px; }
.ds4.white .stick,
.ds4.white .stick.left,
.ds4.white .stick.right,
.ds4.white .stick.pressed.left,
.ds4.white .stick.pressed.right {
  width:94px; height:94px;
  background-image:url("assets/stick-cap.png");
  background-repeat:no-repeat;
  background-size:108.2px 108.5px;
  background-position:-7.08px -7.34px;
  border-radius:50%;
}
.ds4.white .stick.left { left:0; top:0; }
.ds4.white .stick.right { left:253px; top:0; }
.ds4.white .stick.pressed {
  filter:grayscale(1) brightness(1.7) drop-shadow(0 0 3px #64dfff);
}
.ds4.white .button,
.ds4.white .button.pressed {
  background-size:55px 55px;
  background-position:0 0;
  background-repeat:no-repeat;
}
.ds4.white .button.a { background-image:url("assets/face-cross.svg"); }
.ds4.white .button.b { background-image:url("assets/face-circle.svg"); }
.ds4.white .button.x { background-image:url("assets/face-square.svg"); }
.ds4.white .button.y { background-image:url("assets/face-triangle.svg"); }
.ds4.white .button.a.pressed { background-image:url("assets/face-cross-pressed.svg"); }
.ds4.white .button.b.pressed { background-image:url("assets/face-circle-pressed.svg"); }
.ds4.white .button.x.pressed { background-image:url("assets/face-square-pressed.svg"); }
.ds4.white .button.y.pressed { background-image:url("assets/face-triangle-pressed.svg"); }
.ds4.white .dpad { left:92px; top:181px; }
.ds4.white .face,
.ds4.white .face.pressed { background-repeat:no-repeat; background-position:0 0; }
.ds4.white .face.up { background-image:url("assets/dpad-up.svg"); }
.ds4.white .face.down { background-image:url("assets/dpad-down.svg"); }
.ds4.white .face.left { background-image:url("assets/dpad-left.svg"); }
.ds4.white .face.right { background-image:url("assets/dpad-right.svg"); }
.ds4.white .face.up.pressed { background-image:url("assets/dpad-up-pressed.svg"); }
.ds4.white .face.down.pressed { background-image:url("assets/dpad-down-pressed.svg"); }
.ds4.white .face.left.pressed { background-image:url("assets/dpad-left-pressed.svg"); }
.ds4.white .face.right.pressed { background-image:url("assets/dpad-right-pressed.svg"); }
.ds4.white .button.pressed,
.ds4.white .face.pressed { filter:drop-shadow(0 0 3px #63ddff); }
.ds4.white .triggers { top:0; }
.ds4.white .triggers::before,
.ds4.white .triggers::after {
  content:""; position:absolute; top:0; width:99px; height:90px;
  background-size:99px 90px; background-repeat:no-repeat;
  pointer-events:none;
}
.ds4.white .triggers::before { left:0; background-image:url("assets/trigger-left.svg"); }
.ds4.white .triggers::after { right:0; background-image:url("assets/trigger-right.svg"); }
.ds4.white .trigger {
  position:relative; z-index:1;
  background-repeat:no-repeat; background-size:99px 90px;
  background-position:0 0;
}
.ds4.white .trigger.left { background-image:url("assets/trigger-left-pressed.svg"); }
.ds4.white .trigger.right { background-image:url("assets/trigger-right-pressed.svg"); background-position:0 0; }
.ds4.white .trigger-button { display:none; }
.ds4.white .bumper { background-image:url("assets/bumper-pressed.svg"); background-size:99px 23px; }
.ds4.white .arrows { top:138px; left:229px; width:347px; }
.ds4.white .back,
.ds4.white .start {
  background:none; border-radius:12px;
  box-shadow:inset 0 0 0 2px #dcffff,0 0 8px #46dfff;
}
.ds4.white .back.pressed,
.ds4.white .start.pressed { background:rgba(215,250,255,.7); }
.ds4.white .touchpad { left:272px; top:120px; width:262px; height:153px; border-radius:16px; }
.ds4.white .touchpad::before,
.ds4.white .touchpad::after { content:none; }
.ds4.white .touchpad.pressed {
  background-image:none;
  box-shadow:inset 0 0 0 3px #fff,0 0 10px #6fefff;
}
.ds4.white .meta.pressed {
  background:none; border-radius:50%;
  box-shadow:inset 0 0 0 2px #fff,0 0 8px #76eaff;
}
.controller.ds4.white.disconnected { background:none; }
.controller.ds4.white.disconnected::after {
  content:"CONTROLLER DISCONNECTED";
  position:absolute; top:190px; left:130px; right:130px;
  padding:22px 10px; border:2px solid #00bfff; border-radius:12px;
  background:rgba(4,13,31,.96); color:white;
  font:700 24px/1.4 Arial,sans-serif; text-align:center;
}
`;
fs.writeFileSync(path.join(root,'rally.css'),css);
const embedded=css.replace(/url\("(assets\/[^\"]+)"\)/g,(_,rel)=>{
 const mime=rel.endsWith('.gif')?'image/gif':rel.endsWith('.png')?'image/png':'image/svg+xml';
 return `url("data:${mime};base64,${fs.readFileSync(path.join(root,rel)).toString('base64')}")`;
});
fs.writeFileSync(path.join(root,'RALLY-PASTE-INTO-OBS.txt'),embedded);
console.log('Built Rally hosted CSS, embedded fallback, and',fs.readdirSync(assets).length,'separate image assets.');
