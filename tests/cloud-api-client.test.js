const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
let calls=[];
const ctx={window:{BILLY_CLOUD_API_BASE:'https://api.example.test/'},fetch:async(url,init={})=>{calls.push({url,init});return {ok:true,status:200,json:async()=>({ok:true,favorites:['a+b']})}},console,Set};
ctx.window.window=ctx.window;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'billy-cloud-api.js'),'utf8'),ctx);
(async()=>{const api=ctx.window.BillyCloudApi;if(!api.isConfigured())throw Error('API should be configured');await api.putFavorites('device-1',['a+b','a+b']);if(calls[0].url!=='https://api.example.test/api/users/device-1/favorites')throw Error('Wrong endpoint');const body=JSON.parse(calls[0].init.body);if(body.favorites.length!==1)throw Error('Favorites were not deduplicated');console.log('cloud API client tests passed')})().catch(e=>{console.error(e);process.exit(1)});
