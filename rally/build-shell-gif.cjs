/* Approved SHARPIE glitch: 0.6-second burst every 4 seconds.
   Requires sharp, @napi-rs/canvas, ffmpeg, and ImageMagick. */
const fs=require('fs'),path=require('path'),os=require('os');
const {execFileSync}=require('child_process');
const sharp=require('sharp');
const {createCanvas,ImageData}=require('@napi-rs/canvas');
(async()=>{
 const root=__dirname,tmp=fs.mkdtempSync(path.join(os.tmpdir(),'rally-glitch-'));
 const {data,info}=await sharp(path.join(root,'assets/shell.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const original=createCanvas(info.width,info.height);original.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(data),info.width,info.height),0,0);
 const base=createCanvas(806,598);base.getContext('2d').drawImage(original,0,0,806,598);
 const canvas=createCanvas(806,598),c=canvas.getContext('2d');
 const states=[[0,80,5,11,10,-4,32,4,'cyan'],[80,160,-7,25,8,5,17,4,'red'],[160,240,3,14,17,-3,35,4,'cyan'],[360,440,6,30,9,-5,12,4,'red'],[440,520,-4,19,6,5,36,4,'cyan'],[520,600,2,34,7,-2,21,2,'cyan']];
 for(let i=0;i<100;i++){
  c.clearRect(0,0,806,598);c.drawImage(base,0,0);
  const ms=((i/25+3.5)%4)*1000,s=states.find(s=>ms>=s[0]&&ms<s[1]);
  if(s){c.save();c.drawImage(base,282,178+s[3],244,s[4],282+s[2],178+s[3],244,s[4]);c.globalAlpha=.85;c.filter=s[8]==='red'?'brightness(.4) sepia(1) saturate(12) hue-rotate(310deg)':'brightness(.4) sepia(1) saturate(12) hue-rotate(135deg) brightness(1.6)';c.drawImage(base,282,178+s[6],244,s[7],282+s[5],178+s[6],244,s[7]);c.restore();}
  fs.writeFileSync(path.join(tmp,String(i).padStart(3,'0')+'.png'),canvas.toBuffer('image/png'));
 }
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-framerate','25','-i',tmp+'/%03d.png','-filter_complex','[0:v]split[a][b];[a]palettegen=reserve_transparent=1:stats_mode=full[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle:alpha_threshold=128','-loop','0',tmp+'/raw.gif']);
 execFileSync('convert',[tmp+'/raw.gif','-coalesce','-layers','Optimize',path.join(root,'assets/shell-glitch.gif')]);
 fs.rmSync(tmp,{recursive:true,force:true});console.log('Built approved transparent shell: 806x598, 4-second loop.');
})().catch(e=>{console.error(e);process.exit(1)});
