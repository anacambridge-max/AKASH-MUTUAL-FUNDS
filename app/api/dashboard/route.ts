import {NextResponse} from 'next/server';

export const dynamic='force-dynamic';
export const revalidate=0;

type FundConfig=readonly [string,string,string,string[]];
type FundSnapshot={nav:number|null;previousNav:number|null;change:number|null;date:string|null;status:'LIVE'|'UNAVAILABLE';source:'AMFI'|'MFAPI'|'UNAVAILABLE'};
type IndexSnapshot={name:string;value:number|null;change:number|null;status:'LIVE'|'UNAVAILABLE';group:'BROAD'|'SECTORAL'|'THEMATIC'};

const funds:FundConfig[]=[
 ['120843','Quant Flexi Cap Fund Direct Growth','Diversified',['NIFTY 50','NIFTY SERVICES']],['120826','Quant Large and Mid Cap Fund Direct Growth','Large & Mid Cap',['NIFTY 50','NIFTY NEXT 50']],['120821','Quant Multi Asset Fund Direct Growth','Multi Asset',['NIFTY 50','NIFTY BANK','NIFTY GOLD']],['120823','Quant Multi Cap Fund Direct Growth','Multi Cap',['NIFTY 50','NIFTY NEXT 50']],['120833','Quant Infrastructure Fund Direct Growth','Infrastructure',['NIFTY INFRASTRUCTURE','NIFTY 50']],['151791','Quant BFSI Fund Direct Growth','Banking & Financial',['NIFTY BANK','NIFTY FINANCIAL SERVICES','NIFTY SERVICES']],['119827','SBI Nifty 50 Index Fund Direct Growth','Nifty 50',['NIFTY 50']],['119783','SBI Healthcare Opportunities Fund Direct Growth','Healthcare',['NIFTY HEALTHCARE','NIFTY PHARMA']],['119727','SBI Focused Equity Fund Direct Growth','Focused Equity',['NIFTY 50','NIFTY SERVICES']],['148490',"SBI Children's Benefit Fund Direct Growth",'Children',['NIFTY 50']],['147946','Bandhan Small Cap Fund Direct Growth','Small Cap',['NIFTY SMALLCAP 250','NIFTY 50']],['118989','HDFC Mid Cap Opportunities Fund Direct Growth','Mid Cap',['NIFTY MIDCAP 150','NIFTY NEXT 50']],['143341','UTI Nifty Next 50 Index Fund Direct Growth','Nifty Next 50',['NIFTY NEXT 50']],['150714','UTI Gold ETF FoF Direct Growth','Gold',['NIFTY GOLD']],['125497','SBI Small Cap Fund Direct Growth','Small Cap',['NIFTY SMALLCAP 250','NIFTY 50']],['120586','ICICI Prudential Value Discovery Fund Direct Growth','Value',['NIFTY 50','NIFTY FINANCIAL SERVICES']],['120503','Axis ELSS Tax Saver Fund Direct Growth','ELSS',['NIFTY 50']],['144835','Sundaram Services Fund Direct Growth','Services',['NIFTY SERVICES']],['135800','Tata Digital India Fund Direct Growth','Technology',['NIFTY IT']]
];

const indexNames:{name:string;group:IndexSnapshot['group']}[]=[
 {name:'NIFTY 50',group:'BROAD'},{name:'NIFTY NEXT 50',group:'BROAD'},{name:'NIFTY 100',group:'BROAD'},{name:'NIFTY 200',group:'BROAD'},{name:'NIFTY 500',group:'BROAD'},{name:'NIFTY MIDCAP 50',group:'BROAD'},{name:'NIFTY MIDCAP 100',group:'BROAD'},{name:'NIFTY MIDCAP 150',group:'BROAD'},{name:'NIFTY SMALLCAP 50',group:'BROAD'},{name:'NIFTY SMALLCAP 100',group:'BROAD'},{name:'NIFTY SMALLCAP 250',group:'BROAD'},{name:'NIFTY MIDSMALLCAP 400',group:'BROAD'},
 {name:'NIFTY BANK',group:'SECTORAL'},{name:'NIFTY FINANCIAL SERVICES',group:'SECTORAL'},{name:'NIFTY FINANCIAL SERVICES EX-BANK',group:'SECTORAL'},{name:'NIFTY IT',group:'SECTORAL'},{name:'NIFTY HEALTHCARE',group:'SECTORAL'},{name:'NIFTY PHARMA',group:'SECTORAL'},{name:'NIFTY AUTO',group:'SECTORAL'},{name:'NIFTY FMCG',group:'SECTORAL'},{name:'NIFTY METAL',group:'SECTORAL'},{name:'NIFTY MEDIA',group:'SECTORAL'},{name:'NIFTY REALTY',group:'SECTORAL'},{name:'NIFTY PRIVATE BANK',group:'SECTORAL'},{name:'NIFTY PSU BANK',group:'SECTORAL'},{name:'NIFTY OIL & GAS',group:'SECTORAL'},{name:'NIFTY CONSUMER DURABLES',group:'SECTORAL'},{name:'NIFTY CAPITAL GOODS',group:'SECTORAL'},{name:'NIFTY POWER',group:'SECTORAL'},{name:'NIFTY TELECOMMUNICATIONS',group:'SECTORAL'},{name:'NIFTY RETAIL',group:'SECTORAL'},{name:'NIFTY INSURANCE',group:'SECTORAL'},{name:'NIFTY NBFC',group:'SECTORAL'},{name:'NIFTY CEMENT',group:'SECTORAL'},{name:'NIFTY CHEMICALS',group:'SECTORAL'},{name:'NIFTY CONSTRUCTION',group:'SECTORAL'},{name:'NIFTY CONSUMER SERVICES',group:'SECTORAL'},{name:'NIFTY COMMERCIAL & TRANSPORT SERVICES',group:'SECTORAL'},{name:'NIFTY INFRASTRUCTURE',group:'THEMATIC'},{name:'NIFTY SERVICES SECTOR',group:'THEMATIC'},{name:'NIFTY ENERGY',group:'THEMATIC'},{name:'NIFTY COMMODITIES',group:'THEMATIC'}
];

const aliases:Record<string,string[]>= {
 'NIFTY INFRASTRUCTURE':['NIFTY INFRASTRUCTURE','NIFTY INFRA'],'NIFTY SERVICES SECTOR':['NIFTY SERVICES SECTOR','NIFTY SERVICES'],'NIFTY OIL & GAS':['NIFTY OIL & GAS','NIFTY OIL AND GAS'],'NIFTY CONSUMER DURABLES':['NIFTY CONSUMER DURABLES','NIFTY CONSUMER DURABLE'],'NIFTY TELECOMMUNICATIONS':['NIFTY TELECOMMUNICATIONS','NIFTY TELECOM'],'NIFTY SMALLCAP 250':['NIFTY SMALLCAP 250','NIFTY SMALL CAP 250'],'NIFTY MIDSMALLCAP 400':['NIFTY MIDSMALLCAP 400','NIFTY MIDSMALLCAP400'],'NIFTY FINANCIAL SERVICES EX-BANK':['NIFTY FINANCIAL SERVICES EX-BANK','NIFTY FINANCIAL SERVICES EX BANK'],'NIFTY COMMERCIAL & TRANSPORT SERVICES':['NIFTY COMMERCIAL & TRANSPORT SERVICES','NIFTY COMMERCIAL AND TRANSPORT SERVICES']
};

async function json(url:string,headers:Record<string,string>={},cache:'no-store'|'force-cache'='no-store'){
 const r=await fetch(url,{cache,headers:{'User-Agent':'Mozilla/5.0 (compatible; AkashMutualFunds/1.0)','Accept':'application/json,text/plain,*/*',...headers}});
 if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();
}

async function text(url:string){
 const r=await fetch(url,{cache:'no-store',headers:{'User-Agent':'Mozilla/5.0 (compatible; AkashMutualFunds/1.0)','Accept':'text/plain,*/*'}});
 if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text();
}

type AmfiNav={nav:number;date:string};

async function fetchAmfiNavs():Promise<Map<string,AmfiNav>>{
 const map=new Map<string,AmfiNav>();
 try{
  const raw=await text('https://www.amfiindia.com/spages/NAVAll.txt');
  for(const line of raw.split(/\r?\n/)){
   const p=line.split(';');
   if(p.length<6)continue;
   const code=p[0].trim(),nav=Number(p[4]?.trim()),date=p[5]?.trim();
   if(/^\d+$/.test(code)&&Number.isFinite(nav)&&date)map.set(code,{nav,date});
  }
 }catch{}
 return map;
}

async function mfapiHistory(code:string):Promise<{nav:number;previousNav:number;date:string}|null>{
 for(let attempt=0;attempt<2;attempt++){
  try{
   const j=await json(`https://api.mfapi.in/mf/${code}`,{},'force-cache');
   const d=Array.isArray(j.data)?j.data:[];
   const nav=Number(d[0]?.nav),previousNav=Number(d[1]?.nav);
   if(Number.isFinite(nav)&&Number.isFinite(previousNav)&&previousNav!==0)return{nav,previousNav,date:d[0]?.date??''};
  }catch{}
 }
 return null;
}

async function fund(code:string,amfi:Map<string,AmfiNav>):Promise<FundSnapshot>{
 const current=amfi.get(code);
 if(current){
  const h=await mfapiHistory(code);
  if(h){
   const nav=current.nav;
   return{nav,previousNav:h.previousNav,change:((nav-h.previousNav)/h.previousNav)*100,date:current.date||h.date,status:'LIVE',source:'AMFI'};
  }
  return{nav:current.nav,previousNav:null,change:null,date:current.date,status:'LIVE',source:'AMFI'};
 }
 const h=await mfapiHistory(code);
 if(h)return{nav:h.nav,previousNav:h.previousNav,change:((h.nav-h.previousNav)/h.previousNav)*100,date:h.date,status:'LIVE',source:'MFAPI'};
 return{nav:null,previousNav:null,change:null,date:null,status:'UNAVAILABLE',source:'UNAVAILABLE'};
}

const yahooSymbols:Record<string,string>={'NIFTY 50':'^NSEI','NIFTY NEXT 50':'^NSMIDCP','NIFTY BANK':'^NSEBANK','NIFTY IT':'^CNXIT','NIFTY MIDCAP 50':'^NSEMDCP50','NIFTY MIDCAP 100':'^CNXMDCP','NIFTY 100':'^CNX100','NIFTY 500':'^CRSLDX','NIFTY FINANCIAL SERVICES':'^NSEFIN','NIFTY INFRASTRUCTURE':'^CNXINFRA'};
async function yahooIndex(name:string,group:IndexSnapshot['group']):Promise<IndexSnapshot>{const symbol=yahooSymbols[name];if(!symbol)return{name,value:null,change:null,status:'UNAVAILABLE',group};try{const j=await json(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`);const c=(j.chart?.result?.[0]?.indicators?.quote?.[0]?.close||[]).filter((x:any)=>x!=null) as number[];const last=Number(c.at(-1)),prev=Number(c.at(-2));return{name,value:Number.isFinite(last)?last:null,change:Number.isFinite(last)&&Number.isFinite(prev)&&prev!==0?((last-prev)/prev)*100:null,status:Number.isFinite(last)?'LIVE':'UNAVAILABLE',group}}catch{return{name,value:null,change:null,status:'UNAVAILABLE',group}}}
async function getAllNseIndices(){try{const j=await json('https://www.nseindia.com/api/allIndices',{'accept-language':'en-US,en;q=0.9','referer':'https://www.nseindia.com/market-data/live-market-indices','sec-fetch-site':'same-origin'});return Array.isArray(j.data)?j.data:[]}catch{return[]}}

async function mapLimit<T,R>(items:T[],limit:number,fn:(item:T)=>Promise<R>):Promise<R[]>{
 const out:R[] = new Array(items.length);let cursor=0;
 const worker=async()=>{while(true){const i=cursor++;if(i>=items.length)return;out[i]=await fn(items[i]);}};
 await Promise.all(Array.from({length:Math.min(limit,items.length)},()=>worker()));return out;
}

export async function GET(){
 const [amfi,nseRows]=await Promise.all([fetchAmfiNavs(),getAllNseIndices()]);
 const fundData=await mapLimit(funds,4,async([code,name,category,sectors])=>({code,name,category,sectors,data:await fund(code,amfi)}));
 const nseMap=new Map<string,any>();for(const row of nseRows){const key=String(row.index||'').trim().toUpperCase();if(key)nseMap.set(key,row);}
 const indexData:IndexSnapshot[]=await Promise.all(indexNames.map(async({name,group})=>{const candidates=[name,...(aliases[name]||[])];const row=candidates.map(x=>nseMap.get(x)).find(Boolean);if(row&&Number.isFinite(Number(row.last)))return{name,value:Number(row.last),change:Number(row.percentChange)||0,status:'LIVE',group};return yahooIndex(name,group);}));
 const indexMap=new Map(indexData.map(x=>[x.name,x]));
 const enriched=fundData.map(f=>{const moves=f.sectors.map(s=>indexMap.get(s)?.change).filter((x):x is number=>typeof x==='number');const sectorMove=moves.length?moves.reduce((a,b)=>a+b,0)/moves.length:0;const navChange=f.data.change??0;const correction=Math.max(0,-navChange);const marketWeakness=Math.max(0,-sectorMove);const qualityBonus=['Diversified','Large & Mid Cap','Multi Asset','Value','Focused Equity'].includes(f.category)?5:0;const score=Math.max(0,Math.min(100,50+marketWeakness*10+correction*8+qualityBonus));const signal=score>=78?'BUY':score>=65?'ACCUMULATE':score>=52?'WATCH':'WAIT';const leadSector=f.sectors.slice().sort((a,b)=>(indexMap.get(a)?.change??0)-(indexMap.get(b)?.change??0))[0]??'Market';return{code:f.code,name:f.name,category:f.category,sectors:f.sectors,nav:f.data.nav,previousNav:f.data.previousNav,change:f.data.change,date:f.data.date,status:f.data.status,navSource:f.data.source,sectorMove:Number(sectorMove.toFixed(2)),leadSector,score:Number(score.toFixed(1)),signal};}).sort((a,b)=>b.score-a.score);
 const falling=indexData.filter(x=>(x.change??0)<0).sort((a,b)=>(a.change??0)-(b.change??0));
 const sectors=indexData.filter(x=>x.group!=='BROAD').map(x=>({name:x.name,value:x.value,change:x.change,status:x.status,severity:(x.change??0)<=-1.5?'HIGH':(x.change??0)<0?'MEDIUM':'STABLE'}));
 const liveFunds=enriched.filter(x=>x.status==='LIVE').length,liveIndices=indexData.filter(x=>x.status==='LIVE').length;
 return NextResponse.json({updatedAt:new Date().toISOString(),funds:enriched,indices:indexData,sectors,summary:{trackedFunds:funds.length,liveFunds,liveIndices,fallingIndices:falling.length,buySignals:enriched.filter(x=>x.signal==='BUY').length,accumulateSignals:enriched.filter(x=>x.signal==='ACCUMULATE').length},fallingIndices:falling.slice(0,8),source:'AMFI NAVAll + MFAPI history + NSE All Indices with Yahoo fallback',note:'AMFI provides the latest published NAV for all schemes; mutual-fund NAV is end-of-day. Intraday index movement is used as an opportunity signal, not as a live NAV quote.'},{headers:{'Cache-Control':'no-store,max-age=0'}});}
