import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const port=Number(process.env.PORT||3000);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2','.png':'image/png','.ico':'image/x-icon'};
await fs.access(path.join(root,'index.html')).catch(()=>{throw new Error('Önce npm run build çalıştırın.');});
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let relative=decodeURIComponent(url.pathname).replace(/^\/+/, '');if(!relative)relative='index.html';let file=path.resolve(root,relative);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{const stat=await fs.stat(file);if(stat.isDirectory())file=path.join(file,'index.html');}catch{if(!path.extname(file))file+='.html';}const body=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Sayfa bulunamadı.');}}).listen(port,'127.0.0.1',()=>console.log('Odak Atlası: http://127.0.0.1:'+port));
