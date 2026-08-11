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
 ['150714','UTI Gold ETF FoF Direct Growth','Gold',['NIFTY COMMODITIES']],
 ['125497','SBI Small Cap Fund Direct Growth','Small Cap',['NIFTY SMALLCAP 50','NIFTY SMALLCAP 100','NIFTY SMALLCAP 250','NIFTY MIDSMALLCAP 400']],
 ['120586','ICICI Prudential Value Discovery Fund Direct Growth','Value',['NIFTY 50','NIFTY FINANCIAL SERVICES','NIFTY PRIVATE BANK','NIFTY REALTY','NIFTY REITS & REALTY']],
 ['120503','Axis ELSS Tax Saver Fund Direct Growth','ELSS',['NIFTY 50']],
 ['144835','Sundaram Services Fund Direct Growth','Services',['NIFTY SERVICES SECTOR','NIFTY CONSUMER SERVICES','NIFTY COMMERCIAL & TRANSPORT SERVICES']],
 ['135800','Tata Digital India Fund Direct Growth','Technology',['NIFTY IT','NIFTY MIDSMALL IT & TELECOM','NIFTY TELECOMMUNICATIONS']]
];

const indexNames:{name:string;group:IndexSnapshot['group']}[]=[
 {name:'NIFTY 50',group:'BROAD'},{name:'NIFTY NEXT 50',group:'BROAD'},{name:'NIFTY 100',group:'BROAD'},{name:'NIFTY 200',group:'BROAD'},{name:'NIFTY 500',group:'BROAD'},{name:'NIFTY MIDCAP 50',group:'BROAD'},{name:'NIFTY MIDCAP 100',group:'BROAD'},{name:'NIFTY MIDCAP 150',group:'BROAD'},{name:'NIFTY SMALLCAP 50',group:'BROAD'},{name:'NIFTY SMALLCAP 100',group:'BROAD'},{name:'NIFTY SMALLCAP 250',group:'BROAD'},{name:'NIFTY MIDSMALLCAP 400',group:'BROAD'},
 {name:'NIFTY BANK',group:'SECTORAL'},{name:'NIFTY FINANCIAL SERVICES',group:'SECTORAL'},{name:'NIFTY FINANCIAL SERVICES 25/50',group:'SECTORAL'},{name:'NIFTY FINANCIAL SERVICES EX-BANK',group:'SECTORAL'},{name:'NIFTY IT',group:'SECTORAL'},{name:'NIFTY HEALTHCARE',group:'SECTORAL'},{name:'NIFTY PHARMA',group:'SECTORAL'},{name:'NIFTY AUTO',group:'SECTORAL'},{name:'NIFTY FMCG',group:'SECTORAL'},{name:'NIFTY METAL',group:'SECTORAL'},{name:'NIFTY MEDIA',group:'SECTORAL'},{name:'NIFTY REALTY',group:'SECTORAL'},{name:'NIFTY PRIVATE BANK',group:'SECTORAL'},{name:'NIFTY PSU BANK',group:'SECTORAL'},{name:'NIFTY OIL & GAS',group:'SECTORAL'},{name:'NIFTY CONSUMER DURABLES',group:'SECTORAL'},{name:'NIFTY CAPITAL GOODS',group:'SECTORAL'},{name:'NIFTY POWER',group:'SECTORAL'},{name:'NIFTY TELECOMMUNICATIONS',group:'SECTORAL'},{name:'NIFTY RETAIL',group:'SECTORAL'},{name:'NIFTY INSURANCE',group:'SECTORAL'},{name:'NIFTY NBFC',group:'SECTORAL'},{name:'NIFTY CEMENT',group:'SECTORAL'},{name:'NIFTY CHEMICALS',group:'SECTORAL'},{name:'NIFTY CONSTRUCTION',group:'SECTORAL'},{name:'NIFTY CONSUMER SERVICES',group:'SECTORAL'},{name:'NIFTY COMMERCIAL & TRANSPORT SERVICES',group:'SECTORAL'},{name:'NIFTY HOSPITALS',group:'SECTORAL'},{name:'NIFTY HOUSING FINANCE',group:'SECTORAL'},{name:'NIFTY REITS & REALTY',group:'SECTORAL'},{name:'NIFTY500 HEALTHCARE',group:'SECTORAL'},{name:'NIFTY MIDSMALL FINANCIAL SERVICES',group:'SECTORAL'},{name:'NIFTY MIDSMALL HEALTHCARE',group:'SECTORAL'},{name:'NIFTY MIDSMALL IT & TELECOM',group:'SECTORAL'},
 {name:'NIFTY INFRASTRUCTURE',group:'THEMATIC'},{name:'NIFTY SERVICES SECTOR',group:'THEMATIC'},{name:'NIFTY ENERGY',group:'THEMATIC'},{name:'NIFTY COMMODITIES',group:'THEMATIC'}
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
 'NIFTY COMMERCIAL & TRANSPORT SERVICES':['NIFTY COMMERCIAL & TRANSPORT SERVICES','NIFTY COMMERCIAL AND TRANSPORT SERVICES'],
 'NIFTY INFRASTRUCTURE':['NIFTY INFRASTRUCTURE','NIFTY INFRASTRUCTURE INDEX','NIFTY INFRA'],
 'NIFTY SERVICES SECTOR':['NIFTY SERVICES SECTOR','NIFTY SERVICES SECTOR INDEX','NIFTY SERVICES'],
 'NIFTY CAPITAL GOODS':['NIFTY CAPITAL GOODS','NIFTY CAPITAL GOODS INDEX'],
 'NIFTY CONSTRUCTION':['NIFTY CONSTRUCTION','NIFTY CONSTRUCTION INDEX'],
 'NIFTY CONSUMER SERVICES':['NIFTY CONSUMER SERVICES','NIFTY CONSUMER SERVICES INDEX'],
 'NIFTY COMMERCIAL & TRANSPORT SERVICES':['NIFTY COMMERCIAL & TRANSPORT SERVICES','NIFTY COMMERCIAL AND TRANSPORT SERVICES','NIFTY COMMERCIAL & TRANSPORT SERVICES INDEX'],
 'NIFTY HOSPITALS':['NIFTY HOSPITALS','NIFTY HOSPITALS INDEX'],
 'NIFTY HOUSING FINANCE':['NIFTY HOUSING FINANCE','NIFTY HOUSING FINANCE INDEX'],
 'NIFTY INSURANCE':['NIFTY INSURANCE','NIFTY INSURANCE INDEX'],
 'NIFTY NBFC':['NIFTY NBFC','NIFTY NBFC INDEX'],
 'NIFTY POWER':['NIFTY POWER','NIFTY POWER INDEX'],
 'NIFTY RETAIL':['NIFTY RETAIL','NIFTY RETAIL INDEX']
};

const yahooSymbols:Record<string,string>={
 'NIFTY 50':'^NSEI','NIFTY NEXT 50':'^NSMIDCP','NIFTY 100':'^CNX100','NIFTY 200':'^CNX200','NIFTY 500':'^CRSLDX',
 'NIFTY MIDCAP 50':'^NSEMDCP50','NIFTY MIDCAP 100':'^CNXMDCP','NIFTY BANK':'^NSEBANK','NIFTY FINANCIAL SERVICES':'^NSEFIN',
 'NIFTY IT':'^CNXIT','NIFTY PHARMA':'^CNXPHARMA','NIFTY AUTO':'^CNXAUTO','NIFTY FMCG':'^CNXFMCG','NIFTY METAL':'^CNXMETAL',
 'NIFTY MEDIA':'^CNXMEDIA','NIFTY REALTY':'^CNXREALTY','NIFTY PSU BANK':'^CNXPSUBANK','NIFTY INFRASTRUCTURE':'^CNXINFRA',
 'NIFTY CEMENT':'^CNXCEMENT','NIFTY ENERGY':'^CNXENERGY'
};

const headers={'User-Agent':'Mozilla/5.0 (compatible; AkashMutualFunds/1.0)','Accept':'application/json,text/plain,*/*'};
async function json(url:string,extra:Record<string,string>={},cache:'no-store'|'force-cache'='no-store'){const r=await fetch(url,{cache,headers:{...headers,...extra}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}
async function text(url:string){const r=await fetch(url,{cache:'no-store',headers:{...headers,'Accept':'text/plain,*/*'}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text();}

type AmfiNav={nav:number;date:string};
async function fetchAmfiNavs():Promise<Map<string,AmfiNav>>{const map=new Map<string,AmfiNav>();try{const raw=await text('https://www.amfiindia.com/spages/NAVAll.txt');for(const line of raw.split(/\r?\n/)){const p=line.split(';');if(p.length<6)continue;const code=p[0].trim(),nav=Number(p[4]?.trim()),date=p[5]?.trim();if(/^\d+$/.test(code)&&Number.isFinite(nav)&&date)map.set(code,{nav,date});}}catch{}return map;}
async function mfapiHistory(code:string):Promise<{nav:number;previousNav:number;date:string}|null>{for(let attempt=0;attempt<2;attempt++){try{const j=await json(`https://api.mfapi.in/mf/${code}`,{},'force-cache');const d=Array.isArray(j.data)?j.data:[];const nav=Number(d[0]?.nav),previousNav=Number(d[1]?.nav);if(Number.isFinite(nav)&&Number.isFinite(previousNav)&&previousNav!==0)return{nav,previousNav,date:d[0]?.date??''};}catch{}}return null;}
async function fund(code:string,amfi:Map<string,AmfiNav>):Promise<FundSnapshot>{const current=amfi.get(code);if(current){const h=await mfapiHistory(code);if(h)return{nav:current.nav,previousNav:h.previousNav,change:((current.nav-h.previousNav)/h.previousNav)*100,date:current.date||h.date,status:'LIVE',source:'AMFI'};return{nav:current.nav,previousNav:null,change:null,date:current.date,status:'LIVE',source:'AMFI'};}const h=await mfapiHistory(code);if(h)return{nav:h.nav,previousNav:h.previousNav,change:((h.nav-h.previousNav)/h.previousNav)*100,date:h.date,status:'LIVE',source:'MFAPI'};return{nav:null,previousNav:null,change:null,date:null,status:'UNAVAILABLE',source:'UNAVAILABLE'};}

function cookieHeader(value:string|null){if(!value)return '';return value.split(/,(?=\s*[^;,=]+=[^;,]+)/).map(x=>x.split(';')[0].trim()).filter(Boolean).join('; ');}
async function getAllNseIndices(){try{const home=await fetch('https://www.nseindia.com/',{cache:'no-store',headers});const cookie=(home.headers as any).getSetCookie?.()?.join('; ')||cookieHeader(home.headers.get('set-cookie'));const apiHeaders={'accept-language':'en-US,en;q=0.9','referer':'https://www.nseindia.com/market-data/live-market-indices','sec-fetch-site':'same-origin',...(cookie?{cookie}:{})};const j=await json('https://www.nseindia.com/api/allIndices',apiHeaders);return Array.isArray(j.data)?j.data:[];}catch{try{const j=await json('https://www.nseindia.com/api/allIndices',{'accept-language':'en-US,en;q=0.9','referer':'https://www.nseindia.com/market-data/live-market-indices'});return Array.isArray(j.data)?j.data:[];}catch{return[];}}}

async function yahooChart(symbol:string){const j=await json(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`);const c=(j.chart?.result?.[0]?.indicators?.quote?.[0]?.close||[]).filter((x:any)=>x!=null) as number[];const last=Number(c.at(-1)),prev=Number(c.at(-2));if(!Number.isFinite(last))throw new Error('No quote');return{value:last,change:Number.isFinite(prev)&&prev!==0?((last-prev)/prev)*100:null};}
async function yahooSearch(name:string){try{const j=await json(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(name)}&quotesCount=8&newsCount=0`);const q=Array.isArray(j.quotes)?j.quotes:[];return q.find((x:any)=>x.quoteType==='INDEX'&&typeof x.symbol==='string')?.symbol||q.find((x:any)=>typeof x.symbol==='string'&&x.symbol.startsWith('^'))?.symbol||null;}catch{return null;}}
async function yahooIndex(name:string,group:IndexSnapshot['group']):Promise<IndexSnapshot>{try{const direct=yahooSymbols[name]||await yahooSearch(name);if(!direct)return{name,value:null,change:null,status:'UNAVAILABLE',group};const q=await yahooChart(direct);return{name,value:q.value,change:q.change,status:'LIVE',group};}catch{return{name,value:null,change:null,status:'UNAVAILABLE',group};}}
async function mapLimit<T,R>(items:T[],limit:number,fn:(item:T)=>Promise<R>):Promise<R[]>{const out:R[]=new Array(items.length);let cursor=0;const worker=async()=>{while(true){const i=cursor++;if(i>=items.length)return;out[i]=await fn(items[i]);}};await Promise.all(Array.from({length:Math.min(limit,items.length)},()=>worker()));return out;}

const qualityByCategory:Record<string,number>={'Diversified':7,'Large & Mid Cap':6,'Multi Asset':6,'Value':5,'Focused Equity':4,'Nifty 50':3,'ELSS':3,'Mid Cap':2,'Small Cap':1,'Infrastructure':3,'Banking & Financial':3,'Healthcare':3,'Technology':3,'Services':2,'Gold':2,'Children':1,'Multi Cap':3,'Nifty Next 50':3};
const clamp=(n:number,min=0,max=100)=>Math.max(min,Math.min(max,n));
const norm=(s:string)=>s.toUpperCase().replace(/&/g,' AND ').replace(/[^A-Z0-9]+/g,' ').replace(/\s+/g,' ').trim();

function readNseRow(target:string,rows:any[]):{value:number;change:number}|null{
 const targetNames=[target,...(aliases[target]||[])].map(norm);
 const candidates=rows.filter(r=>typeof r?.index==='string');
 let row=candidates.find(r=>targetNames.includes(norm(r.index)));
 if(!row){row=candidates.find(r=>targetNames.some(a=>{const b=norm(r.index);return b===a||b===`${a} INDEX`||a===`${b} INDEX`;}));}
 if(!row){row=candidates.find(r=>targetNames.some(a=>{const b=norm(r.index);return a.length>=12&&(b.includes(a)||a.includes(b));}));}
 const value=Number(row?.last),change=Number(row?.percentChange);
 return row&&Number.isFinite(value)&&Number.isFinite(change)?{value,change}:null;
}

async function resolveIndex(item:{name:string;group:IndexSnapshot['group']},rows:any[]):Promise<IndexSnapshot>{
 const nse=readNseRow(item.name,rows);
 if(nse)return{name:item.name,value:nse.value,change:nse.change,status:'LIVE',group:item.group};
 return yahooIndex(item.name,item.group);
}

export async function GET(){
 try{
  const [amfi,nseRows]=await Promise.all([fetchAmfiNavs(),getAllNseIndices()]);
  const indices=await mapLimit(indexNames,8,x=>resolveIndex(x,nseRows));
  const indexMap=new Map(indices.map(x=>[x.name,x]));
  const fundData=await mapLimit(funds,5,async([code,name,category,sectors])=>{
   const snap=await fund(code,amfi);
   const mapped=sectors.map(s=>indexMap.get(s)).filter((x):x is IndexSnapshot=>!!x&&x.change!=null);
   const lead=mapped.length?mapped.slice().sort((a,b)=>(a.change??0)-(b.change??0))[0]:null;
   const sectorMove=lead?.change??null;
   const fundChange=snap.change;
   const relativeCorrection=fundChange!=null&&sectorMove!=null?fundChange-sectorMove:null;
   const quality=qualityByCategory[category]??2;
   const sectorWeakness=sectorMove!=null?clamp(-sectorMove*10,0,30):0;
   const fundCorrection=fundChange!=null?clamp(-fundChange*20,0,25):0;
   const relativeBonus=(fundChange!=null&&fundChange<0&&relativeCorrection!=null)?clamp(relativeCorrection*10,0,18):0;
   const correctionBonus=fundChange!=null&&fundChange<=-0.5?6:fundChange!=null&&fundChange<0?3:0;
   const positivePenalty=fundChange!=null&&fundChange>0?Math.min(18,fundChange*8):0;
   const score=Math.round(clamp(30+sectorWeakness+fundCorrection+relativeBonus+correctionBonus+quality-positivePenalty,0,100)*10)/10;
   const confirmed=sectorMove!=null&&sectorMove<=-0.8&&fundChange!=null&&fundChange<0&&relativeCorrection!=null&&relativeCorrection>0.2;
   const strong=sectorMove!=null&&sectorMove<=-1.2&&fundChange!=null&&fundChange<=-0.6&&relativeCorrection!=null&&relativeCorrection>0.3;
   const signal=strong&&score>=72?'BUY':confirmed&&score>=62?'ACCUMULATE':score>=50?'WATCH':'WAIT';
   const reason=lead?`${lead.name} ${lead.change!>=0?'+':''}${lead.change!.toFixed(2)}%`:'No mapped index feed';
   return{code,name,category,nav:snap.nav,previousNav:snap.previousNav,change:fundChange,date:snap.date,status:snap.status,sectorMove,leadSector:lead?.name??'No mapped index',leadMove:sectorMove,relativeCorrection,score,signal,reason};
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
