import {NextResponse} from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type FundConfig = readonly [string, string, string, string[]];
type FundSnapshot = {nav:number|null; previousNav:number|null; change:number|null; date:string|null; status:'LIVE'|'UNAVAILABLE'};
type IndexSnapshot = {name:string; value:number|null; change:number|null; status:'LIVE'|'UNAVAILABLE'};

const funds: FundConfig[] = [
 ['120843','Quant Flexi Cap Fund Direct Growth','Diversified',['NIFTY 50','NIFTY SERVICES']],
 ['120826','Quant Large and Mid Cap Fund Direct Growth','Large & Mid Cap',['NIFTY 50','NIFTY NEXT 50']],
 ['120821','Quant Multi Asset Fund Direct Growth','Multi Asset',['NIFTY 50','NIFTY BANK','NIFTY GOLD']],
 ['120823','Quant Multi Cap Fund Direct Growth','Multi Cap',['NIFTY 50','NIFTY NEXT 50']],
 ['120833','Quant Infrastructure Fund Direct Growth','Infrastructure',['NIFTY INFRA','NIFTY 50']],
 ['151791','Quant BFSI Fund Direct Growth','Banking & Financial',['NIFTY BANK','NIFTY SERVICES']],
 ['119827','SBI Nifty 50 Index Fund Direct Growth','Nifty 50',['NIFTY 50']],
 ['119783','SBI Healthcare Opportunities Fund Direct Growth','Healthcare',['NIFTY HEALTHCARE']],
 ['119727','SBI Focused Equity Fund Direct Growth','Focused Equity',['NIFTY 50','NIFTY SERVICES']],
 ['148490',"SBI Children's Benefit Fund Direct Growth",'Children',['NIFTY 50']],
 ['147946','Bandhan Small Cap Fund Direct Growth','Small Cap',['NIFTY 50','NIFTY NEXT 50']],
 ['118989','HDFC Mid Cap Opportunities Fund Direct Growth','Mid Cap',['NIFTY NEXT 50','NIFTY 50']],
 ['143341','UTI Nifty Next 50 Index Fund Direct Growth','Nifty Next 50',['NIFTY NEXT 50']],
 ['150714','UTI Gold ETF FoF Direct Growth','Gold',['NIFTY GOLD']],
 ['125497','SBI Small Cap Fund Direct Growth','Small Cap',['NIFTY 50','NIFTY NEXT 50']],
 ['120586','ICICI Prudential Value Discovery Fund Direct Growth','Value',['NIFTY 50','NIFTY BANK']],
 ['120503','Axis ELSS Tax Saver Fund Direct Growth','ELSS',['NIFTY 50']],
 ['144835','Sundaram Services Fund Direct Growth','Services',['NIFTY SERVICES']],
 ['135800','Tata Digital India Fund Direct Growth','Technology',['NIFTY IT']]
];

const indexNames = ['NIFTY 50','NIFTY NEXT 50','NIFTY BANK','NIFTY IT','NIFTY HEALTHCARE','NIFTY INFRA','NIFTY SERVICES'];

async function json(url:string, headers:Record<string,string>={}) {
 const r = await fetch(url,{cache:'no-store',headers:{'User-Agent':'Mozilla/5.0','Accept':'application/json,text/plain,*/*',...headers}});
 if(!r.ok) throw new Error(`HTTP ${r.status}`);
 return r.json();
}

async function fund(code:string):Promise<FundSnapshot>{
 try {
  const j = await json(`https://api.mfapi.in/mf/${code}`);
  const d = Array.isArray(j.data) ? j.data : [];
  const nav = Number(d[0]?.nav);
  const previousNav = Number(d[1]?.nav);
  return {
   nav:Number.isFinite(nav)?nav:null,
   previousNav:Number.isFinite(previousNav)?previousNav:null,
   change:Number.isFinite(nav)&&Number.isFinite(previousNav)&&previousNav!==0?((nav-previousNav)/previousNav)*100:null,
   date:d[0]?.date ?? null,
   status:Number.isFinite(nav)?'LIVE':'UNAVAILABLE'
  };
 } catch {
  return {nav:null,previousNav:null,change:null,date:null,status:'UNAVAILABLE'};
 }
}

async function nseIndex(name:string):Promise<IndexSnapshot>{
 try {
  const j = await json('https://www.nseindia.com/api/allIndices',{
   'accept-language':'en-US,en;q=0.9',
   'referer':'https://www.nseindia.com/market-data/live-market-indices',
   'sec-fetch-site':'same-origin'
  });
  const rows = Array.isArray(j.data)?j.data:[];
  const row = rows.find((x:any)=>String(x.index||'').trim().toUpperCase()===name.toUpperCase());
  if(row && Number.isFinite(Number(row.last))){
   return {name,value:Number(row.last),change:Number(row.percentChange)||0,status:'LIVE'};
  }
  throw new Error('Index not found');
 } catch {
  return yahooIndex(name);
 }
}

const yahooSymbols:Record<string,string> = {
 'NIFTY 50':'^NSEI',
 'NIFTY BANK':'^NSEBANK',
 'NIFTY IT':'^CNXIT',
 'NIFTY INFRA':'^CNXINFRA'
};

async function yahooIndex(name:string):Promise<IndexSnapshot>{
 const symbol=yahooSymbols[name];
 if(!symbol) return {name,value:null,change:null,status:'UNAVAILABLE'};
 try {
  const j=await json(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`);
  const q=j.chart?.result?.[0]?.indicators?.quote?.[0];
  const c=(q?.close||[]).filter((x:any)=>x!=null) as number[];
  const last=Number(c.at(-1));
  const prev=Number(c.at(-2));
  return {name,value:Number.isFinite(last)?last:null,change:Number.isFinite(last)&&Number.isFinite(prev)&&prev!==0?((last-prev)/prev)*100:null,status:Number.isFinite(last)?'LIVE':'UNAVAILABLE'};
 } catch { return {name,value:null,change:null,status:'UNAVAILABLE'}; }
}

export async function GET(){
 const [fundData,indexData] = await Promise.all([
  Promise.all(funds.map(async ([code,name,category,sectors])=>({code,name,category,sectors,data:await fund(code)}))),
  Promise.all(indexNames.map(n=>nseIndex(n)))
 ]);

 const indexMap = new Map(indexData.map(x=>[x.name,x]));
 const enriched = fundData.map(f=>{
  const sectorMoves=f.sectors.map(s=>indexMap.get(s)?.change).filter((x):x is number=>typeof x==='number');
  const sectorMove=sectorMoves.length?sectorMoves.reduce((a,b)=>a+b,0)/sectorMoves.length:0;
  const navChange=f.data.change ?? 0;
  const correction=Math.max(0,-navChange);
  const marketWeakness=Math.max(0,-sectorMove);
  const qualityBonus=['Diversified','Large & Mid Cap','Multi Asset','Value','Focused Equity'].includes(f.category)?5:0;
  const score=Math.max(0,Math.min(100,50+marketWeakness*10+correction*8+qualityBonus));
  const signal=score>=78?'BUY':score>=65?'ACCUMULATE':score>=52?'WATCH':'WAIT';
  const leadSector=f.sectors.slice().sort((a,b)=>(indexMap.get(a)?.change??0)-(indexMap.get(b)?.change??0))[0] ?? 'Market';
  return {code:f.code,name:f.name,category:f.category,sectors:f.sectors,nav:f.data.nav,previousNav:f.data.previousNav,change:f.data.change,date:f.data.date,status:f.data.status,sectorMove:Number(sectorMove.toFixed(2)),leadSector,score:Number(score.toFixed(1)),signal};
 }).sort((a,b)=>b.score-a.score);

 const falling=indexData.filter(x=>(x.change??0)<0).sort((a,b)=>(a.change??0)-(b.change??0));
 const sectors=indexData.map(x=>({name:x.name,change:x.change,value:x.value,status:x.status,severity:(x.change??0)<=-1.5?'HIGH':(x.change??0)<0?'MEDIUM':'STABLE'}));
 const liveFunds=enriched.filter(x=>x.status==='LIVE').length;
 const liveIndices=indexData.filter(x=>x.status==='LIVE').length;

 return NextResponse.json({
  updatedAt:new Date().toISOString(),
  funds:enriched,
  indices:indexData,
  sectors,
  summary:{trackedFunds:funds.length,liveFunds,liveIndices,fallingIndices:falling.length,buySignals:enriched.filter(x=>x.signal==='BUY').length,accumulateSignals:enriched.filter(x=>x.signal==='ACCUMULATE').length},
  fallingIndices:falling.slice(0,5),
  source:'MFAPI + NSE market indices with Yahoo fallback',
  note:'Mutual-fund NAV is end-of-day. Intraday index movement is used as an opportunity signal, not as a live NAV quote.'
 },{headers:{'Cache-Control':'no-store,max-age=0'}});
}
