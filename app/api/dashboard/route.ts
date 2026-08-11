import {NextResponse} from 'next/server';

export const dynamic='force-dynamic';
export const revalidate=0;

type Group='BROAD'|'SECTORAL'|'THEMATIC';
type FundConfig=readonly [string,string,string,string[]];
type FundSnapshot={nav:number|null;previousNav:number|null;change:number|null;date:string|null;status:'LIVE'|'UNAVAILABLE';source:'AMFI'|'MFAPI'|'UNAVAILABLE'};
type IndexSnapshot={name:string;value:number|null;change:number|null;status:'LIVE'|'UNAVAILABLE';group:Group};

type IndexDef={name:string;group:Group};

const funds:FundConfig[]=[
 ['120843','Quant Flexi Cap Fund Direct Growth','Diversified',['NIFTY 50','NIFTY SERVICES SECTOR']],
 ['120826','Quant Large and Mid Cap Fund Direct Growth','Large & Mid Cap',['NIFTY 50','NIFTY NEXT 50','NIFTY MIDCAP 150']],
 ['120821','Quant Multi Asset Fund Direct Growth','Multi Asset',['NIFTY 50','NIFTY BANK','NIFTY 500']],
 ['120823','Quant Multi Cap Fund Direct Growth','Multi Cap',['NIFTY 50','NIFTY NEXT 50','NIFTY MIDCAP 150']],
 ['120833','Quant Infrastructure Fund Direct Growth','Infrastructure',['NIFTY INFRASTRUCTURE','NIFTY CAPITAL GOODS','NIFTY CONSTRUCTION','NIFTY CEMENT','NIFTY POWER']],
 ['151791','Quant BFSI Fund Direct Growth','Banking & Financial',['NIFTY BANK','NIFTY FINANCIAL SERVICES','NIFTY FINANCIAL SERVICES 25/50','NIFTY FINANCIAL SERVICES EX-BANK','NIFTY PRIVATE BANK','NIFTY PSU BANK','NIFTY NBFC','NIFTY INSURANCE','NIFTY HOUSING FINANCE']],
 ['119827','SBI Nifty 50 Index Fund Direct Growth','Nifty 50',['NIFTY 50']],
 ['119783','SBI Healthcare Opportunities Fund Direct Growth','Healthcare',['NIFTY HEALTHCARE','NIFTY PHARMA','NIFTY HOSPITALS','NIFTY500 HEALTHCARE','NIFTY MIDSMALL HEALTHCARE']],
 ['119727','SBI Focused Equity Fund Direct Growth','Focused Equity',['NIFTY 50','NIFTY FINANCIAL SERVICES','NIFTY IT']],
 ['148490',"SBI Children's Benefit Fund Direct Growth",'Children',['NIFTY 50','NIFTY CONSUMER SERVICES']],
 ['147946','Bandhan Small Cap Fund Direct Growth','Small Cap',['NIFTY SMALLCAP 50','NIFTY SMALLCAP 100','NIFTY SMALLCAP 250','NIFTY MIDSMALLCAP 400']],
 ['118989','HDFC Mid Cap Opportunities Fund Direct Growth','Mid Cap',['NIFTY MIDCAP 50','NIFTY MIDCAP 100','NIFTY MIDCAP 150','NIFTY NEXT 50']],
 ['143341','UTI Nifty Next 50 Index Fund Direct Growth','Nifty Next 50',['NIFTY NEXT 50']],
 ['150714','UTI Gold ETF FoF Direct Growth','Gold',['NIFTY COMMODITIES']],
 ['125497','SBI Small Cap Fund Direct Growth','Small Cap',['NIFTY SMALLCAP 50','NIFTY SMALLCAP 100','NIFTY SMALLCAP 250','NIFTY MIDSMALLCAP 400']],
 ['120586','ICICI Prudential Value Discovery Fund Direct Growth','Value',['NIFTY 50','NIFTY FINANCIAL SERVICES','NIFTY PRIVATE BANK','NIFTY REALTY','NIFTY REITS & REALTY']],
 ['120503','Axis ELSS Tax Saver Fund Direct Growth','ELSS',['NIFTY 50']],
 ['144835','Sundaram Services Fund Direct Growth','Services',['NIFTY SERVICES SECTOR','NIFTY CONSUMER SERVICES','NIFTY COMMERCIAL & TRANSPORT SERVICES']],
 ['135800','Tata Digital India Fund Direct Growth','Technology',['NIFTY IT','NIFTY MIDSMALL IT & TELECOM','NIFTY TELECOMMUNICATIONS']]
];

const indexNames:IndexDef[]=[
 ...['NIFTY 50','NIFTY NEXT 50','NIFTY 100','NIFTY 200','NIFTY 500','NIFTY MIDCAP 50','NIFTY MIDCAP 100','NIFTY MIDCAP 150','NIFTY SMALLCAP 50','NIFTY SMALLCAP 100','NIFTY SMALLCAP 250','NIFTY MIDSMALLCAP 400'].map(name=>({name,group:'BROAD' as Group})),
 ...['NIFTY BANK','NIFTY FINANCIAL SERVICES','NIFTY FINANCIAL SERVICES 25/50','NIFTY FINANCIAL SERVICES EX-BANK','NIFTY IT','NIFTY HEALTHCARE','NIFTY PHARMA','NIFTY AUTO','NIFTY FMCG','NIFTY METAL','NIFTY MEDIA','NIFTY REALTY','NIFTY PRIVATE BANK','NIFTY PSU BANK','NIFTY OIL & GAS','NIFTY CONSUMER DURABLES','NIFTY CAPITAL GOODS','NIFTY POWER','NIFTY TELECOMMUNICATIONS','NIFTY RETAIL','NIFTY INSURANCE','NIFTY NBFC','NIFTY CEMENT','NIFTY CHEMICALS','NIFTY CONSTRUCTION','NIFTY CONSUMER SERVICES','NIFTY COMMERCIAL & TRANSPORT SERVICES','NIFTY HOSPITALS','NIFTY HOUSING FINANCE','NIFTY REITS & REALTY','NIFTY500 HEALTHCARE','NIFTY MIDSMALL FINANCIAL SERVICES','NIFTY MIDSMALL HEALTHCARE','NIFTY MIDSMALL IT & TELECOM'].map(name=>({name,group:'SECTORAL' as Group})),
 ...['NIFTY INFRASTRUCTURE','NIFTY SERVICES SECTOR','NIFTY ENERGY','NIFTY COMMODITIES'].map(name=>({name,group:'THEMATIC' as Group}))
];

const aliases:Record<string,string[]>= {
 'NIFTY NEXT 50':['NIFTY NEXT 50','NIFTY NEXT 50 TRI'],
 'NIFTY MIDSMALLCAP 400':['NIFTY MIDSMALLCAP 400','NIFTY MIDSMALLCAP400','NIFTY MIDSMALLCAP 400 TRI'],
 'NIFTY FINANCIAL SERVICES 25/50':['NIFTY FINANCIAL SERVICES 25/50','NIFTY FINSRV25 50','NIFTY FINSRV25 50 INDEX'],
 'NIFTY FINANCIAL SERVICES EX-BANK':['NIFTY FINANCIAL SERVICES EX-BANK','NIFTY FINANCIAL SERVICES EX BANK'],
 'NIFTY OIL & GAS':['NIFTY OIL & GAS','NIFTY OIL AND GAS','NIFTY OIL AND GAS INDEX'],
 'NIFTY CONSUMER DURABLES':['NIFTY CONSUMER DURABLES','NIFTY CONSUMER DURABLE'],
 'NIFTY TELECOMMUNICATIONS':['NIFTY TELECOMMUNICATIONS','NIFTY TELECOM'],
 'NIFTY SMALLCAP 250':['NIFTY SMALLCAP 250','NIFTY SMALL CAP 250'],
 'NIFTY REITS & REALTY':['NIFTY REITS & REALTY','NIFTY REITS & REALTY INDEX'],
 'NIFTY500 HEALTHCARE':['NIFTY500 HEALTHCARE','NIFTY500 HEALTHCARE INDEX'],
 'NIFTY MIDSMALL FINANCIAL SERVICES':['NIFTY MIDSMALL FINANCIAL SERVICES','NIFTY MIDSMALL FINANCIAL SERVICES INDEX'],
 'NIFTY MIDSMALL HEALTHCARE':['NIFTY MIDSMALL HEALTHCARE','NIFTY MIDSMALL HEALTHCARE INDEX'],
 'NIFTY MIDSMALL IT & TELECOM':['NIFTY MIDSMALL IT & TELECOM','NIFTY MIDSMALL IT & TELECOM INDEX'],
 'NIFTY COMMERCIAL & TRANSPORT SERVICES':['NIFTY COMMERCIAL & TRANSPORT SERVICES','NIFTY COMMERCIAL AND TRANSPORT SERVICES','NIFTY COMMERCIAL & TRANSPORT SERVICES INDEX'],
 'NIFTY INFRASTRUCTURE':['NIFTY INFRASTRUCTURE','NIFTY INFRASTRUCTURE INDEX','NIFTY INFRA'],
 'NIFTY SERVICES SECTOR':['NIFTY SERVICES SECTOR','NIFTY SERVICES SECTOR INDEX','NIFTY SERVICES'],
 'NIFTY CAPITAL GOODS':['NIFTY CAPITAL GOODS','NIFTY CAPITAL GOODS INDEX'],
 'NIFTY CONSTRUCTION':['NIFTY CONSTRUCTION','NIFTY CONSTRUCTION INDEX'],
 'NIFTY CONSUMER SERVICES':['NIFTY CONSUMER SERVICES','NIFTY CONSUMER SERVICES INDEX'],
 'NIFTY HOSPITALS':['NIFTY HOSPITALS','NIFTY HOSPITALS INDEX'],
 'NIFTY HOUSING FINANCE':['NIFTY HOUSING FINANCE','NIFTY HOUSING FINANCE INDEX'],
 'NIFTY INSURANCE':['NIFTY INSURANCE','NIFTY INSURANCE INDEX'],
 'NIFTY NBFC':['NIFTY NBFC','NIFTY NBFC INDEX'],
 'NIFTY POWER':['NIFTY POWER','NIFTY POWER INDEX'],
 'NIFTY RETAIL':['NIFTY RETAIL','NIFTY RETAIL INDEX']
};

const yahooSymbols:Record<string,string>={
 'NIFTY 50':'^NSEI','NIFTY NEXT 50':'^NSMIDCP','NIFTY 100':'^CNX100','NIFTY 200':'^CNX200','NIFTY 500':'^CRSLDX',
 'NIFTY MIDCAP 50':'^NSEMDCP50','NIFTY MIDCAP 100':'^CNXMDCP','NIFTY MIDCAP 150':'^NSEMDCP150','NIFTY BANK':'^NSEBANK','NIFTY FINANCIAL SERVICES':'^NSEFIN',
 'NIFTY IT':'^CNXIT','NIFTY PHARMA':'^CNXPHARMA','NIFTY AUTO':'^CNXAUTO','NIFTY FMCG':'^CNXFMCG','NIFTY METAL':'^CNXMETAL',
 'NIFTY MEDIA':'^CNXMEDIA','NIFTY REALTY':'^CNXREALTY','NIFTY PSU BANK':'^CNXPSUBANK','NIFTY INFRASTRUCTURE':'^CNXINFRA',
 'NIFTY CEMENT':'^CNXCEMENT','NIFTY ENERGY':'^CNXENERGY'
};

const headers={'User-Agent':'Mozilla/5.0 (compatible; AkashMutualFunds/2.0)','Accept':'application/json,text/plain,*/*'};
async function json(url:string,extra:Record<string,string>={},cache:'no-store'|'force-cache'='no-store'){const r=await fetch(url,{cache,headers:{...headers,...extra}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}
async function text(url:string){const r=await fetch(url,{cache:'no-store',headers:{...headers,'Accept':'text/plain,*/*'}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text();}

type AmfiNav={nav:number;date:string};
async function fetchAmfiNavs():Promise<Map<string,AmfiNav>>{const map=new Map<string,AmfiNav>();try{const raw=await text('https://www.amfiindia.com/spages/NAVAll.txt');for(const line of raw.split(/\r?\n/)){const p=line.split(';');if(p.length<6)continue;const code=p[0].trim(),nav=Number(p[4]?.trim()),date=p[5]?.trim();if(/^\d+$/.test(code)&&Number.isFinite(nav)&&date)map.set(code,{nav,date});}}catch{}return map;}
async function mfapiHistory(code:string):Promise<{nav:number;previousNav:number;date:string}|null>{for(let attempt=0;attempt<2;attempt++){try{const j=await json(`https://api.mfapi.in/mf/${code}`,{},'force-cache');const d=Array.isArray(j.data)?j.data:[];const nav=Number(d[0]?.nav),previousNav=Number(d[1]?.nav);if(Number.isFinite(nav)&&Number.isFinite(previousNav)&&previousNav!==0)return{nav,previousNav,date:d[0]?.date??''};}catch{}}return null;}
async function fund(code:string,amfi:Map<string,AmfiNav>):Promise<FundSnapshot>{const current=amfi.get(code);if(current){const h=await mfapiHistory(code);if(h)return{nav:current.nav,previousNav:h.previousNav,change:((current.nav-h.previousNav)/h.previousNav)*100,date:current.date||h.date,status:'LIVE',source:'AMFI'};return{nav:current.nav,previousNav:null,change:null,date:current.date,status:'LIVE',source:'AMFI'};}const h=await mfapiHistory(code);if(h)return{nav:h.nav,previousNav:h.previousNav,change:((h.nav-h.previousNav)/h.previousNav)*100,date:h.date,status:'LIVE',source:'MFAPI'};return{nav:null,previousNav:null,change:null,date:null,status:'UNAVAILABLE',source:'UNAVAILABLE'};}

function cookieHeader(value:string|null){if(!value)return '';return value.split(/,(?=\s*[^;,=]+=[^;,]+)/).map(x=>x.split(';')[0].trim()).filter(Boolean).join('; ');}
async function getAllNseIndices(){try{const home=await fetch('https://www.nseindia.com/',{cache:'no-store',headers});const cookie=(home.headers as any).getSetCookie?.()?.join('; ')||cookieHeader(home.headers.get('set-cookie'));const apiHeaders={'accept-language':'en-US,en;q=0.9','referer':'https://www.nseindia.com/market-data/live-market-indices','sec-fetch-site':'same-origin',...(cookie?{cookie}:{})};const j=await json('https://www.nseindia.com/api/allIndices',apiHeaders);return Array.isArray(j.data)?j.data:[];}catch{try{const j=await json('https://www.nseindia.com/api/allIndices',{'accept-language':'en-US,en;q=0.9','referer':'https://www.nseindia.com/market-data/live-market-indices'});return Array.isArray(j.data)?j.data:[];}catch{return[];}}}

async function getNiftyLiveWatch():Promise<any[]> {try{const j=await json('https://iislliveblob.niftyindices.com/jsonfiles/LiveIndicesWatch.json');if(Array.isArray(j?.data))return j.data;if(Array.isArray(j))return j;return [];}catch{return[];}}

async function yahooChart(symbol:string){const j=await json(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`);const c=(j.chart?.result?.[0]?.indicators?.quote?.[0]?.close||[]).filter((x:any)=>x!=null) as number[];const last=Number(c.at(-1)),prev=Number(c.at(-2));if(!Number.isFinite(last))throw new Error('No quote');return{value:last,change:Number.isFinite(prev)&&prev!==0?((last-prev)/prev)*100:null};}
async function yahooSearch(name:string){try{const j=await json(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(name)}&quotesCount=8&newsCount=0`);const q=Array.isArray(j.quotes)?j.quotes:[];return q.find((x:any)=>x.quoteType==='INDEX'&&typeof x.symbol==='string')?.symbol||q.find((x:any)=>typeof x.symbol==='string'&&x.symbol.startsWith('^'))?.symbol||null;}catch{return null;}}

const norm=(s:string)=>s.toUpperCase().replace(/&/g,' AND ').replace(/[^A-Z0-9]+/g,' ').replace(/\s+/g,' ').trim();
function findIndexName(target:string):string[]{return [target,...(aliases[target]||[])].map(norm);}
function readNseRow(target:string,rows:any[]):{value:number;change:number}|null{const names=findIndexName(target);const candidates=rows.filter(r=>typeof r?.index==='string');let row=candidates.find(r=>names.includes(norm(r.index)));if(!row)row=candidates.find(r=>names.some(a=>{const b=norm(r.index);return b===a||b===`${a} INDEX`||a===`${b} INDEX`;}));if(!row)row=candidates.find(r=>names.some(a=>{const b=norm(r.index);return a.length>=10&&(b.includes(a)||a.includes(b));}));const value=Number(row?.last),change=Number(row?.percentChange);return row&&Number.isFinite(value)&&Number.isFinite(change)?{value,change}:null;}
function readLiveWatch(target:string,rows:any[]):{value:number;change:number}|null{const names=findIndexName(target);for(const r of rows){const raw=String(r?.indexName??r?.name??r?.index??'');const n=norm(raw);if(!names.some(a=>n===a||n===`${a} INDEX`||a===`${n} INDEX`||a.length>=10&&(n.includes(a)||a.includes(n))))continue;const value=Number(r?.indexValue??r?.last??r?.indexPrice??r?.value);const change=Number(r?.percentChange??r?.pChange??r?.change??r?.percent_change);if(Number.isFinite(value)&&Number.isFinite(change))return{value,change};}return null;}

async function resolveIndex(item:IndexDef,nseRows:any[],watchRows:any[]):Promise<IndexSnapshot>{const nse=readNseRow(item.name,nseRows);if(nse)return{name:item.name,value:nse.value,change:nse.change,status:'LIVE',group:item.group};const watch=readLiveWatch(item.name,watchRows);if(watch)return{name:item.name,value:watch.value,change:watch.change,status:'LIVE',group:item.group};try{const direct=yahooSymbols[item.name]||await yahooSearch(item.name);if(!direct)throw new Error('No symbol');const q=await yahooChart(direct);return{name:item.name,value:q.value,change:q.change,status:'LIVE',group:item.group};}catch{return{name:item.name,value:null,change:null,status:'UNAVAILABLE',group:item.group};}}

async function mapLimit<T,R>(items:T[],limit:number,fn:(item:T)=>Promise<R>):Promise<R[]>{const out:R[]=[];let cursor=0;const worker=async()=>{while(true){const i=cursor++;if(i>=items.length)return;out[i]=await fn(items[i]);}};await Promise.all(Array.from({length:Math.min(limit,items.length)},()=>worker()));return out;}

const qualityByCategory:Record<string,number>={'Diversified':8,'Large & Mid Cap':7,'Multi Asset':6,'Value':6,'Focused Equity':5,'Nifty 50':4,'ELSS':4,'Mid Cap':4,'Small Cap':3,'Infrastructure':5,'Banking & Financial':5,'Healthcare':5,'Technology':5,'Services':4,'Gold':3,'Children':2,'Multi Cap':5,'Nifty Next 50':4};
const clamp=(n:number,min=0,max=100)=>Math.max(min,Math.min(max,n));

export async function GET(){
 try{
  const [amfi,nseRows,watchRows]=await Promise.all([fetchAmfiNavs(),getAllNseIndices(),getNiftyLiveWatch()]);
  const indices=await mapLimit(indexNames,10,x=>resolveIndex(x,nseRows,watchRows));
  const indexMap=new Map(indices.map(x=>[x.name,x]));
  const fundData=await mapLimit(funds,6,async([code,name,category,mappedNames])=>{
   const snap=await fund(code,amfi);
   const mapped=mappedNames.map(s=>indexMap.get(s)).filter((x):x is IndexSnapshot=>!!x&&x.change!=null);
   const moves=mapped.map(x=>x.change as number);
   const falling=moves.filter(x=>x<0);
   const averageMove=moves.length?moves.reduce((a,b)=>a+b,0)/moves.length:null;
   const worstMove=moves.length?Math.min(...moves):null;
   const breadth=moves.length?falling.length/moves.length:0;
   const meaningfulFalling=falling.filter(x=>x<=-0.5).length;
   const lead=mapped.slice().sort((a,b)=>(a.change??0)-(b.change??0))[0]??null;
   const sectorMove=averageMove;
   const fundChange=snap.change;
   const relativeCorrection=fundChange!=null&&sectorMove!=null?fundChange-sectorMove:null;
   const quality=qualityByCategory[category]??3;

   // Sector weakness rewards broad confirmation, not a single outlier index.
   const sectorWeakness=sectorMove!=null?clamp(Math.max(0,-sectorMove)*14,0,22):0;
   const worstBonus=worstMove!=null?clamp(Math.max(0,-worstMove)*4,0,6):0;
   const breadthBonus=clamp(breadth*7,0,7);
   const confirmationBonus=clamp(meaningfulFalling*2.5,0,7);
   const fundCorrection=fundChange!=null?clamp(Math.max(0,-fundChange)*22,0,28):0;
   // Negative relativeCorrection means the fund fell more than its mapped index: useful discount.
   const relativeDiscount=relativeCorrection!=null?clamp(-relativeCorrection*14,0,12):0;
   const positivePenalty=fundChange!=null&&fundChange>0?clamp(fundChange*12,0,18):0;

   const score=Math.round(clamp(20+sectorWeakness+worstBonus+breadthBonus+confirmationBonus+fundCorrection+relativeDiscount+quality-positivePenalty,0,100)*10)/10;
   const broadConfirmation=(sectorMove!=null&&sectorMove<=-0.35&&breadth>=0.4)||(sectorMove!=null&&sectorMove<=-0.6&&breadth>=0.25);
   const fundConfirmed=fundChange!=null&&fundChange<=-0.35;
   const strongCorrection=fundChange!=null&&fundChange<=-0.75;
   const relativeCheap=relativeCorrection!=null&&relativeCorrection<=-0.1;
   const signal=strongCorrection&&broadConfirmation&&relativeCheap&&score>=70?'BUY':fundConfirmed&&broadConfirmation&&score>=58?'ACCUMULATE':score>=45?'WATCH':'WAIT';
   const reason=lead?`${lead.name} ${lead.change!>=0?'+':''}${lead.change!.toFixed(2)}%`:'No mapped index feed';
   return{code,name,category,nav:snap.nav,previousNav:snap.previousNav,change:fundChange,date:snap.date,status:snap.status,sectorMove:averageMove,leadSector:lead?.name??'No mapped index',leadMove:lead?.change??null,relativeCorrection,score,signal,reason};
  });
  fundData.sort((a,b)=>b.score-a.score);
  const sectors=indices.filter(x=>x.group==='SECTORAL'||x.group==='THEMATIC').map(x=>({name:x.name,value:x.value,change:x.change,status:x.status,severity:x.change==null?'NONE':x.change<=-1?'HIGH':x.change<0?'MEDIUM':'LOW'}));
  const liveFunds=fundData.filter(x=>x.status==='LIVE').length;
  const liveIndices=indices.filter(x=>x.status==='LIVE').length;
  const fallingIndices=indices.filter(x=>x.change!=null&&x.change<0).length;
  const buySignals=fundData.filter(x=>x.signal==='BUY').length;
  const accumulateSignals=fundData.filter(x=>x.signal==='ACCUMULATE').length;
  return NextResponse.json({funds:fundData,indices,sectors,summary:{trackedFunds:funds.length,liveFunds,liveIndices,fallingIndices,buySignals,accumulateSignals},updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'no-store, max-age=0'}});
 }catch(error){
  return NextResponse.json({error:error instanceof Error?error.message:'Dashboard feed error'},{status:500,headers:{'Cache-Control':'no-store'}});
 }
}
