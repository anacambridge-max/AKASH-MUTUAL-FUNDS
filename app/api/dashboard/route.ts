import {NextResponse} from 'next/server';

export const dynamic='force-dynamic';
export const revalidate=0;

type FundConfig=readonly [string,string,string,string[]];
type FundSnapshot={nav:number|null;previousNav:number|null;change:number|null;date:string|null;status:'LIVE'|'UNAVAILABLE';source:'AMFI'|'MFAPI'|'UNAVAILABLE'};
type IndexSnapshot={name:string;value:number|null;change:number|null;status:'LIVE'|'UNAVAILABLE';group:'BROAD'|'SECTORAL'|'THEMATIC'};

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
 ['150714','UTI Gold ETF FoF Direct Growth','Gold',['NIFTY 50','NIFTY COMMODITIES']],
 ['125497','SBI Small Cap Fund Direct Growth','Small Cap',['NIFTY SMALLCAP 50','NIFTY SMALLCAP 100','NIFTY SMALLCAP 250','NIFTY MIDSMALLCAP 400']],
 ['120586','ICICI Prudential Value Discovery Fund Direct Growth','Value',['NIFTY 50','NIFTY FINANCIAL SERVICES','NIFTY PRIVATE BANK','NIFTY REALTY']],
 ['120503','Axis ELSS Tax Saver Fund Direct Growth','ELSS',['NIFTY 50']],
 ['144835','Sundaram Services Fund Direct Growth','Services',['NIFTY SERVICES SECTOR','NIFTY CONSUMER SERVICES','NIFTY COMMERCIAL & TRANSPORT SERVICES']],
 ['135800','Tata Digital India Fund Direct Growth','Technology',['NIFTY IT','NIFTY MIDSMALL IT & TELECOM','NIFTY TELECOMMUNICATIONS']]
];

// 12 broad-market + 34 sectoral + 4 thematic = the current 50-index equity map used by the terminal.
const indexNames:{name:string;group:IndexSnapshot['group']}[]=[
 {name:'NIFTY 50',group:'BROAD'},{name:'NIFTY NEXT 50',group:'BROAD'},{name:'NIFTY 100',group:'BROAD'},{name:'NIFTY 200',group:'BROAD'},{name:'NIFTY 500',group:'BROAD'},{name:'NIFTY MIDCAP 50',group:'BROAD'},{name:'NIFTY MIDCAP 100',group:'BROAD'},{name:'NIFTY MIDCAP 150',group:'BROAD'},{name:'NIFTY SMALLCAP 50',group:'BROAD'},{name:'NIFTY SMALLCAP 100',group:'BROAD'},{name:'NIFTY SMALLCAP 250',group:'BROAD'},{name:'NIFTY MIDSMALLCAP 400',group:'BROAD'},
 {name:'NIFTY BANK',group:'SECTORAL'},{name:'NIFTY FINANCIAL SERVICES',group:'SECTORAL'},{name:'NIFTY FINANCIAL SERVICES 25/50',group:'SECTORAL'},{name:'NIFTY FINANCIAL SERVICES EX-BANK',group:'SECTORAL'},{name:'NIFTY IT',group:'SECTORAL'},{name:'NIFTY HEALTHCARE',group:'SECTORAL'},{name:'NIFTY PHARMA',group:'SECTORAL'},{name:'NIFTY AUTO',group:'SECTORAL'},{name:'NIFTY FMCG',group:'SECTORAL'},{name:'NIFTY METAL',group:'SECTORAL'},{name:'NIFTY MEDIA',group:'SECTORAL'},{name:'NIFTY REALTY',group:'SECTORAL'},{name:'NIFTY PRIVATE BANK',group:'SECTORAL'},{name:'NIFTY PSU BANK',group:'SECTORAL'},{name:'NIFTY OIL & GAS',group:'SECTORAL'},{name:'NIFTY CONSUMER DURABLES',group:'SECTORAL'},{name:'NIFTY CAPITAL GOODS',group:'SECTORAL'},{name:'NIFTY POWER',group:'SECTORAL'},{name:'NIFTY TELECOMMUNICATIONS',group:'SECTORAL'},{name:'NIFTY RETAIL',group:'SECTORAL'},{name:'NIFTY INSURANCE',group:'SECTORAL'},{name:'NIFTY NBFC',group:'SECTORAL'},{name:'NIFTY CEMENT',group:'SECTORAL'},{name:'NIFTY CHEMICALS',group:'SECTORAL'},{name:'NIFTY CONSTRUCTION',group:'SECTORAL'},{name:'NIFTY CONSUMER SERVICES',group:'SECTORAL'},{name:'NIFTY COMMERCIAL & TRANSPORT SERVICES',group:'SECTORAL'},{name:'NIFTY HOSPITALS',group:'SECTORAL'},{name:'NIFTY HOUSING FINANCE',group:'SECTORAL'},{name:'NIFTY REITS & REALTY',group:'SECTORAL'},{name:'NIFTY500 HEALTHCARE',group:'SECTORAL'},{name:'NIFTY MIDSMALL FINANCIAL SERVICES',group:'SECTORAL'},{name:'NIFTY MIDSMALL HEALTHCARE',group:'SECTORAL'},{name:'NIFTY MIDSMALL IT & TELECOM',group:'SECTORAL'},
 {name:'NIFTY INFRASTRUCTURE',group:'THEMATIC'},{name:'NIFTY SERVICES SECTOR',group:'THEMATIC'},{name:'NIFTY ENERGY',group:'THEMATIC'},{name:'NIFTY COMMODITIES',group:'THEMATIC'}
];

const aliases:Record<string,string[]>= {
 'NIFTY NEXT 50':['NIFTY NEXT 50','NIFTY NEXT 50 TRI'],
 'NIFTY MIDSMALLCAP 400':['NIFTY MIDSMALLCAP 400','NIFTY MIDSMALLCAP400'],
 'NIFTY FINANCIAL SERVICES 25/50':['NIFTY FINANCIAL SERVICES 25/50','NIFTY FINSRV25 50','NIFTY FINSRV25 50 Index'],
 'NIFTY FINANCIAL SERVICES EX-BANK':['NIFTY FINANCIAL SERVICES EX-BANK','NIFTY FINANCIAL SERVICES EX BANK'],
 'NIFTY OIL & GAS':['NIFTY OIL & GAS','NIFTY OIL AND GAS','NIFTY OIL AND GAS INDEX'],
 'NIFTY CONSUMER DURABLES':['NIFTY CONSUMER DURABLES','NIFTY CONSUMER DURABLE'],
 'NIFTY TELECOMMUNICATIONS':['NIFTY TELECOMMUNICATIONS','NIFTY TELECOM'],
 'NIFTY SMALLCAP 250':['NIFTY SMALLCAP 250','NIFTY SMALL CAP 250'],
 'NIFTY REITS & REALTY':['NIFTY REITS & REALTY','NIFTY REITs & Realty'],
 'NIFTY500 HEALTHCARE':['NIFTY500 HEALTHCARE','NIFTY500 Healthcare'],
 'NIFTY MIDSMALL FINANCIAL SERVICES':['NIFTY MIDSMALL FINANCIAL SERVICES','NIFTY MIDSMALL FINANCIAL SERVICES INDEX'],
 'NIFTY MIDSMALL HEALTHCARE':['NIFTY MIDSMALL HEALTHCARE','NIFTY MIDSMALL HEALTHCARE INDEX'],
 'NIFTY MIDSMALL IT & TELECOM':['NIFTY MIDSMALL IT & TELECOM','NIFTY MIDSMALL IT & TELECOM INDEX'],
 'NIFTY COMMERCIAL & TRANSPORT SERVICES':['NIFTY COMMERCIAL & TRANSPORT SERVICES','NIFTY COMMERCIAL AND TRANSPORT SERVICES'],
 'NIFTY INFRASTRUCTURE':['NIFTY INFRASTRUCTURE','NIFTY INFRA'],
 'NIFTY SERVICES SECTOR':['NIFTY SERVICES SECTOR','NIFTY SERVICES']
};

const yahooSymbols:Record<string,string>={
 'NIFTY 50':'^NSEI','NIFTY NEXT 50':'^NSMIDCP','NIFTY 100':'^CNX100','NIFTY 200':'^CNX200','NIFTY 500':'^CRSLDX',
 'NIFTY MIDCAP 50':'^NSEMDCP50','NIFTY MIDCAP 100':'^CNXMDCP','NIFTY BANK':'^NSEBANK','NIFTY FINANCIAL SERVICES':'^NSEFIN','NIFTY IT':'^CNXIT',
 'NIFTY PHARMA':'^CNXPHARMA','NIFTY AUTO':'^CNXAUTO','NIFTY FMCG':'^CNXFMCG','NIFTY METAL':'^CNXMETAL','NIFTY MEDIA':'^CNXMEDIA','NIFTY REALTY':'^CNXREALTY',
 'NIFTY PSU BANK':'^CNXPSUBANK','NIFTY INFRASTRUCTURE':'^CNXINFRA','NIFTY CEMENT':'^CNXCEMENT','NIFTY ENERGY':'^CNXENERGY'
};

const headers={'User-Agent':'Mozilla/5.0 (compatible; AkashMutualFunds/1.0)','Accept':'application/json,text/plain,*/*'};
async function json(url:string,extra:Record<string,string>={},cache:'no-store'|'force-cache'='no-store'){
 const r=await fetch(url,{cache,headers:{...headers,...extra}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();
}
async function text(url:string){const r=await fetch(url,{cache:'no-store',headers:{...headers,'Accept':'text/plain,*/*'}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text();}

type AmfiNav={nav:number;date:string};
async function fetchAmfiNavs():Promise<Map<string,AmfiNav>>{const map=new Map<string,AmfiNav>();try{const raw=await text('https://www.amfiindia.com/spages/NAVAll.txt');for(const line of raw.split(/\r?\n/)){const p=line.split(';');if(p.length<6)continue;const code=p[0].trim(),nav=Number(p[4]?.trim()),date=p[5]?.trim();if(/^\d+$/.test(code)&&Number.isFinite(nav)&&date)map.set(code,{nav,date});}}catch{}return map;}
async function mfapiHistory(code:string):Promise<{nav:number;previousNav:number;date:string}|null>{for(let attempt=0;attempt<2;attempt++){try{const j=await json(`https://api.mfapi.in/mf/${code}`,{},'force-cache');const d=Array.isArray(j.data)?j.data:[];const nav=Number(d[0]?.nav),previousNav=Number(d[1]?.nav);if(Number.isFinite(nav)&&Number.isFinite(previousNav)&&previousNav!==0)return{nav,previousNav,date:d[0]?.date??''};}catch{}}return null;}
async function fund(code:string,amfi:Map<string,AmfiNav>):Promise<FundSnapshot>{const current=amfi.get(code);if(current){const h=await mfapiHistory(code);if(h)return{nav:current.nav,previousNav:h.previousNav,change:((current.nav-h.previousNav)/h.previousNav)*100,date:current.date||h.date,status:'LIVE',source:'AMFI'};return{nav:current.nav,previousNav:null,change:null,date:current.date,status:'LIVE',source:'AMFI'};}const h=await mfapiHistory(code);if(h)return{nav:h.nav,previousNav:h.previousNav,change:((h.nav-h.previousNav)/h.previousNav)*100,date:h.date,status:'LIVE',source:'MFAPI'};return{nav:null,previousNav:null,change:null,date:null,status:'UNAVAILABLE',source:'UNAVAILABLE'};}

function cookieHeader(value:string|null){if(!value)return '';return value.split(/,(?=\s*[^;,=]+=[^;,]+)/).map(x=>x.split(';')[0].trim()).filter(Boolean).join('; ');}
async function getAllNseIndices(){
 try{
  const home=await fetch('https://www.nseindia.com/',{cache:'no-store',headers});
  const cookie=(home.headers as any).getSetCookie?.()?.join('; ')||cookieHeader(home.headers.get('set-cookie'));
  const apiHeaders={'accept-language':'en-US,en;q=0.9','referer':'https://www.nseindia.com/market-data/live-market-indices','sec-fetch-site':'same-origin',...(cookie?{cookie}:{})};
  const j=await json('https://www.nseindia.com/api/allIndices',apiHeaders);
  return Array.isArray(j.data)?j.data:[];
 }catch{
  try{const j=await json('https://www.nseindia.com/api/allIndices',{'accept-language':'en-US,en;q=0.9','referer':'https://www.nseindia.com/market-data/live-market-indices'});return Array.isArray(j.data)?j.data:[];}catch{return[];}
 }
}

async function yahooChart(symbol:string){const j=await json(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`);const c=(j.chart?.result?.[0]?.indicators?.quote?.[0]?.close||[]).filter((x:any)=>x!=null) as number[];const last=Number(c.at(-1)),prev=Number(c.at(-2));if(!Number.isFinite(last))throw new Error('No quote');return{value:last,change:Number.isFinite(prev)&&prev!==0?((last-prev)/prev)*100:null};}
async function yahooSearch(name:string){try{const j=await json(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(name)}&quotesCount=8&newsCount=0`);const q=Array.isArray(j.quotes)?j.quotes:[];return q.find((x:any)=>x.quoteType==='INDEX'&&typeof x.symbol==='string')?.symbol||q.find((x:any)=>typeof x.symbol==='string'&&x.symbol.startsWith('^'))?.symbol||null;}catch{return null;}}
async function yahooIndex(name:string,group:IndexSnapshot['group']):Promise<IndexSnapshot>{
 try{const direct=yahooSymbols[name]||await yahooSearch(name);if(!direct)return{name,value:null,change:null,status:'UNAVAILABLE',group};const q=await yahooChart(direct);return{name,value:q.value,change:q.change,status:'LIVE',group};}catch{return{name,value:null,change:null,status:'UNAVAILABLE',group};}
}
async function mapLimit<T,R>(items:T[],limit:number,fn:(item:T)=>Promise<R>):Promise<R[]>{const out:R[]=new Array(items.length);let cursor=0;const worker=async()=>{while(true){const i=cursor++;if(i>=items.length)return;out[i]=await fn(items[i]);}};await Promise.all(Array.from({length:Math.min(limit,items.length)},()=>worker()));return out;}

const qualityByCategory:Record<string,number>={'Diversified':7,'Large & Mid Cap':6,'Multi Asset':6,'Value':5,'Focused Equity':4,'Nifty 50':3,'ELSS':3,'Mid Cap':2,'Small Cap':1,'Infrastructure':3,'Banking & Financial':3,'Healthcare':3,'Technology':3,'Services':2,'Gold':2,'Children':1,'Multi Cap':3,'Nifty Next 50':3};

export async function GET(){
 const [amfi,nseRows]=await Promise.all([fetchAmfiNavs(),getAllNseIndices()]);
 const fundData=await mapLimit(funds,4,async([code,name,category,sectors])=>({code,name,category,sectors,data:await fund(code,amfi)}));
 const nseMap=new Map<string,any>();for(const row of nseRows){const key=String(row.index||'').trim().toUpperCase();if(key)nseMap.set(key,row);}
 const preliminary=indexNames.map(({name,group})=>{const candidates=[name,...(aliases[name]||[])];const row=candidates.map(x=>nseMap.get(x)).find(Boolean);if(row&&Number.isFinite(Number(row.last)))return Promise.resolve<IndexSnapshot>({name,value:Number(row.last),change:Number(row.percentChange)||0,status:'LIVE',group});return yahooIndex(name,group);});
 const indexData=await Promise.all(preliminary);
 const indexMap=new Map(indexData.map(x=>[x.name,x]));
 const enriched=fundData.map(f=>{
  const liveMoves=f.sectors.map(s=>indexMap.get(s)?.change).filter((x):x is number=>typeof x==='number');
  const sectorMove=liveMoves.length?liveMoves.reduce((a,b)=>a+b,0)/liveMoves.length:null;
  const lead=f.sectors.map(s=>({name:s,move:indexMap.get(s)?.change??null})).filter(x=>x.move!=null).sort((a,b)=>(a.move??0)-(b.move??0))[0]||{name:f.sectors[0]||'Market',move:null};
  const navChange=f.data.change;
  const correction=Math.max(0,-(navChange??0));
  const weakness=Math.max(0,-(sectorMove??0));
  const relative=navChange!=null&&sectorMove!=null?sectorMove-navChange:null;
  const relativeAdvantage=relative!=null?Math.max(-2,Math.min(2,relative)):0;
  const confirmation=(lead.move!=null&&lead.move<=-0.75?4:lead.move!=null&&lead.move<0?2:0);
  const depth=(weakness>=1.5?8:weakness>=1?5:weakness>=0.5?3:0);
  const score=Math.max(0,Math.min(100,48+depth+correction*10+relativeAdvantage*4+confirmation+(qualityByCategory[f.category]||2)));
  const signal=score>=78&&weakness>=0.75?'BUY':score>=65&&weakness>=0.35?'ACCUMULATE':score>=52?'WATCH':'WAIT';
  const reason=lead.move==null?'No mapped live index feed':`${lead.name.replace('NIFTY ','')} ${lead.move>=0?'+':''}${lead.move.toFixed(2)}%`; 
  return{code:f.code,name:f.name,category:f.category,sectors:f.sectors,nav:f.data.nav,previousNav:f.data.previousNav,change:f.data.change,date:f.data.date,status:f.data.status,navSource:f.data.source,sectorMove:sectorMove==null?null:Number(sectorMove.toFixed(2)),leadSector:lead.name,leadMove:lead.move==null?null:Number(lead.move.toFixed(2)),relativeCorrection:relative==null?null:Number(relative.toFixed(2)),score:Number(score.toFixed(1)),signal,reason};
 }).sort((a,b)=>b.score-a.score);
 const falling=indexData.filter(x=>(x.change??0)<0).sort((a,b)=>(a.change??0)-(b.change??0));
 const sectors=indexData.filter(x=>x.group!=='BROAD').map(x=>({name:x.name,value:x.value,change:x.change,status:x.status,severity:(x.change??0)<=-1.5?'HIGH':(x.change??0)<0?'MEDIUM':'STABLE'}));
 const liveFunds=enriched.filter(x=>x.status==='LIVE').length,liveIndices=indexData.filter(x=>x.status==='LIVE').length;
 const actionable=enriched.filter(x=>x.signal==='BUY'||x.signal==='ACCUMULATE');
 return NextResponse.json({updatedAt:new Date().toISOString(),funds:enriched,indices:indexData,sectors,summary:{trackedFunds:funds.length,liveFunds,liveIndices,fallingIndices:falling.length,buySignals:enriched.filter(x=>x.signal==='BUY').length,accumulateSignals:enriched.filter(x=>x.signal==='ACCUMULATE').length},fallingIndices:falling.slice(0,10),actionable:actionable.slice(0,5),source:'AMFI NAVAll + MFAPI history + NSE All Indices with cookie-backed Yahoo fallback',note:'NAV is end-of-day. Index movement is used as an opportunity signal; BUY/ACCUMULATE are rule-based analytical signals, not guaranteed returns.'},{headers:{'Cache-Control':'no-store,max-age=0'}});
}
