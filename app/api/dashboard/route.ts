import {NextResponse} from 'next/server';
export const dynamic='force-dynamic';
export const revalidate=0;
export const maxDuration=60;

type Group='BROAD'|'SECTORAL'|'THEMATIC';
type FundConfig=[string,string,string,string[]];
type Point={date:string;value:number};
type IndexRow={name:string;value:number|null;change:number|null;status:'LIVE'|'UNAVAILABLE';group:Group;source:'NSE'|'YAHOO'|'UNAVAILABLE'};
type Analytics={beta:number|null;volatility:number|null;drawdown:number|null;cheapness:number;historyCoverage:number;basketSensitivity:number|null;estimatedChange:number|null};

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

const broad=['NIFTY 50','NIFTY NEXT 50','NIFTY 100','NIFTY 200','NIFTY 500','NIFTY MIDCAP 50','NIFTY MIDCAP 100','NIFTY MIDCAP 150','NIFTY SMALLCAP 50','NIFTY SMALLCAP 100','NIFTY SMALLCAP 250','NIFTY MIDSMALLCAP 400'];
const sectoral=['NIFTY BANK','NIFTY FINANCIAL SERVICES','NIFTY FINANCIAL SERVICES 25/50','NIFTY FINANCIAL SERVICES EX-BANK','NIFTY IT','NIFTY HEALTHCARE','NIFTY PHARMA','NIFTY AUTO','NIFTY FMCG','NIFTY METAL','NIFTY MEDIA','NIFTY REALTY','NIFTY PRIVATE BANK','NIFTY PSU BANK','NIFTY OIL & GAS','NIFTY CONSUMER DURABLES','NIFTY CAPITAL GOODS','NIFTY POWER','NIFTY TELECOMMUNICATIONS','NIFTY RETAIL','NIFTY INSURANCE','NIFTY NBFC','NIFTY CEMENT','NIFTY CHEMICALS','NIFTY CONSTRUCTION','NIFTY CONSUMER SERVICES','NIFTY COMMERCIAL & TRANSPORT SERVICES','NIFTY HOSPITALS','NIFTY HOUSING FINANCE','NIFTY REITS & REALTY','NIFTY500 HEALTHCARE','NIFTY MIDSMALL FINANCIAL SERVICES','NIFTY MIDSMALL HEALTHCARE','NIFTY MIDSMALL IT & TELECOM'];
const thematic=['NIFTY INFRASTRUCTURE','NIFTY SERVICES SECTOR','NIFTY ENERGY','NIFTY COMMODITIES'];
const indexNames:[string,Group][]=[...broad.map((x):[string,Group]=>[x,'BROAD']),...sectoral.map((x):[string,Group]=>[x,'SECTORAL']),...thematic.map((x):[string,Group]=>[x,'THEMATIC'])];

const yahoo:Record<string,string>={
 'NIFTY 50':'^NSEI','NIFTY NEXT 50':'^NSMIDCP','NIFTY 100':'^CNX100','NIFTY 200':'^CNX200','NIFTY 500':'^CRSLDX','NIFTY MIDCAP 50':'^NSEMDCP50','NIFTY MIDCAP 100':'^CNXMDCP','NIFTY MIDCAP 150':'^CNXMDCP150','NIFTY BANK':'^NSEBANK','NIFTY FINANCIAL SERVICES':'^NSEFIN','NIFTY IT':'^CNXIT','NIFTY HEALTHCARE':'^CNXHEALTH','NIFTY PHARMA':'^CNXPHARMA','NIFTY AUTO':'^CNXAUTO','NIFTY FMCG':'^CNXFMCG','NIFTY METAL':'^CNXMETAL','NIFTY MEDIA':'^CNXMEDIA','NIFTY REALTY':'^CNXREALTY','NIFTY PRIVATE BANK':'^CNXPVTBANK','NIFTY PSU BANK':'^CNXPSUBANK','NIFTY OIL & GAS':'^CNXENERGY','NIFTY CAPITAL GOODS':'^CNXCG','NIFTY CEMENT':'^CNXCEMENT','NIFTY INFRASTRUCTURE':'^CNXINFRA','NIFTY ENERGY':'^CNXENERGY','NIFTY COMMODITIES':'^CNXCOMMODITIES'
};
const aliases:Record<string,string[]>={
 'NIFTY 50':['NIFTY 50','NIFTY50'],'NIFTY NEXT 50':['NIFTY NEXT 50','NIFTY NEXT50'],'NIFTY 100':['NIFTY 100','NIFTY100'],'NIFTY 200':['NIFTY 200','NIFTY200'],'NIFTY 500':['NIFTY 500','NIFTY500'],
 'NIFTY MIDCAP 50':['NIFTY MIDCAP 50','NIFTY MIDCAP50'],'NIFTY MIDCAP 100':['NIFTY MIDCAP 100','NIFTY MIDCAP100'],'NIFTY MIDCAP 150':['NIFTY MIDCAP 150','NIFTY MIDCAP150'],
 'NIFTY SMALLCAP 50':['NIFTY SMALLCAP 50','NIFTY SMALL CAP 50'],'NIFTY SMALLCAP 100':['NIFTY SMALLCAP 100','NIFTY SMALL CAP 100'],'NIFTY SMALLCAP 250':['NIFTY SMALLCAP 250','NIFTY SMALL CAP 250'],'NIFTY MIDSMALLCAP 400':['NIFTY MIDSMALLCAP 400','NIFTY MIDSMALLCAP400'],
 'NIFTY FINANCIAL SERVICES 25/50':['NIFTY FINANCIAL SERVICES 25/50','NIFTY FINSRV25 50'],'NIFTY FINANCIAL SERVICES EX-BANK':['NIFTY FINANCIAL SERVICES EX-BANK','NIFTY FINANCIAL SERVICES EX BANK'],
 'NIFTY OIL & GAS':['NIFTY OIL & GAS','NIFTY OIL AND GAS'],'NIFTY CONSUMER DURABLES':['NIFTY CONSUMER DURABLES','NIFTY CONSUMER DURABLE'],'NIFTY TELECOMMUNICATIONS':['NIFTY TELECOMMUNICATIONS','NIFTY TELECOM'],
 'NIFTY REITS & REALTY':['NIFTY REITS & REALTY','NIFTY REITS AND REALTY'],'NIFTY500 HEALTHCARE':['NIFTY500 HEALTHCARE','NIFTY 500 HEALTHCARE'],'NIFTY MIDSMALL IT & TELECOM':['NIFTY MIDSMALL IT & TELECOM','NIFTY MIDSMALL IT AND TELECOM'],
 'NIFTY COMMERCIAL & TRANSPORT SERVICES':['NIFTY COMMERCIAL & TRANSPORT SERVICES','NIFTY COMMERCIAL AND TRANSPORT SERVICES'],'NIFTY INFRASTRUCTURE':['NIFTY INFRASTRUCTURE','NIFTY INFRA'],'NIFTY SERVICES SECTOR':['NIFTY SERVICES SECTOR','NIFTY SERVICES']
};
const quality:Record<string,number>={'Diversified':78,'Large & Mid Cap':82,'Multi Asset':84,'Multi Cap':78,'Infrastructure':76,'Banking & Financial':75,'Nifty 50':92,'Healthcare':82,'Focused Equity':76,'Children':80,'Small Cap':72,'Mid Cap':78,'Nifty Next 50':90,'Gold':80,'Value':84,'ELSS':80,'Services':75,'Technology':78};
const headers={'User-Agent':'Mozilla/5.0 (compatible; AkashMutualFunds/6.0)','Accept':'application/json,text/plain,*/*'};

async function getJson(url:string,extra:Record<string,string>={}):Promise<unknown>{const c=new AbortController();const t=setTimeout(()=>c.abort(),6500);try{const r=await fetch(url,{cache:'no-store',signal:c.signal,headers:{...headers,...extra}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return await r.json();}finally{clearTimeout(t);}}
async function getText(url:string):Promise<string>{const c=new AbortController();const t=setTimeout(()=>c.abort(),6500);try{const r=await fetch(url,{cache:'no-store',signal:c.signal,headers});if(!r.ok)throw new Error(`HTTP ${r.status}`);return await r.text();}finally{clearTimeout(t);}}
function dateKey(v:string){const p=v.split('-');if(p.length!==3)return v;const months:Record<string,string>={Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};const day=p[0].padStart(2,'0'),month=months[p[1]]??p[1].padStart(2,'0'),year=p[2];return `${year}-${month}-${day}`;}
function norm(v:string){return v.toUpperCase().replace(/&/g,' AND ').replace(/[^A-Z0-9]+/g,' ').replace(/\s+/g,' ').trim();}
function percentile(v:number,arr:number[]){if(!arr.length)return 0;return arr.filter(x=>x<=v).length/arr.length*100;}
function returns(points:Point[]){const out=new Map<string,number>();for(let i=1;i<points.length;i++){const a=points[i-1].value,b=points[i].value;if(a>0&&b>0)out.set(points[i].date,(b/a-1)*100);}return out;}
function beta(xs:number[],ys:number[]):number|null{if(xs.length<30||ys.length!==xs.length)return null;const mx=xs.reduce((a,b)=>a+b,0)/xs.length,my=ys.reduce((a,b)=>a+b,0)/ys.length;let cov=0,v=0;for(let i=0;i<xs.length;i++){cov+=(xs[i]-mx)*(ys[i]-my);v+=(ys[i]-my)**2;}return v>0?Math.max(.1,Math.min(3,cov/v)):null;}

async function amfi(){const out=new Map<string,{nav:number;date:string}>();try{const raw=await getText('https://www.amfiindia.com/spages/NAVAll.txt');for(const line of raw.split(/\r?\n/)){const p=line.split(';');if(p.length<6)continue;const code=p[0]?.trim()??'',nav=Number(p[4]?.trim()),date=p[5]?.trim()??'';if(/^\d+$/.test(code)&&Number.isFinite(nav)&&date)out.set(code,{nav,date});}}catch{}return out;}
async function fundHistory(code:string):Promise<Point[]>{try{const raw=await getJson(`https://api.mfapi.in/mf/${code}`) as {data?:Array<{nav?:string;date?:string}>};return(Array.isArray(raw.data)?raw.data:[]).map(x=>({date:dateKey(String(x.date??'')),value:Number(x.nav)})).filter(x=>Boolean(x.date)&&Number.isFinite(x.value)).sort((a,b)=>a.date.localeCompare(b.date));}catch{return[];}}
async function yahooHistory(symbol:string):Promise<Point[]>{try{const raw=await getJson(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=2y&interval=1d`) as {chart?:{result?:Array<{timestamp?:number[];indicators?:{quote?:Array<{close?:Array<number|null>}>}}>} };const r=raw.chart?.result?.[0],ts=r?.timestamp??[],cl=r?.indicators?.quote?.[0]?.close??[];return ts.map((t,i)=>({date:new Date(t*1000).toISOString().slice(0,10),value:Number(cl[i])})).filter(x=>Number.isFinite(x.value));}catch{return[];}}
async function nseRows():Promise<Array<Record<string,unknown>>>{try{const home=await fetch('https://www.nseindia.com/',{cache:'no-store',headers});const cookie=home.headers.get('set-cookie')?.split(';')[0]??'';const raw=await getJson('https://www.nseindia.com/api/allIndices',{'accept-language':'en-US,en;q=0.9','referer':'https://www.nseindia.com/market-data/live-market-indices',...(cookie?{cookie}:{})}) as {data?:unknown};return Array.isArray(raw.data)?raw.data.filter((x):x is Record<string,unknown>=>typeof x==='object'&&x!==null):[];}catch{return[];}}
async function yahooQuote(symbol:string){const h=await yahooHistory(symbol);const a=h.at(-1),b=h.at(-2);return a?{value:a.value,change:b&&b.value?((a.value-b.value)/b.value)*100:0}:null;}
function findIndex(target:string,rows:Array<Record<string,unknown>>){const names=[target,...(aliases[target]??[])].map(norm);const row=rows.find(x=>{const name=norm(String(x.index??x.indexName??x.name??''));return names.some(n=>name===n||name===`${n} INDEX`||n===`${name} INDEX`||(n.length>8&&(name.includes(n)||n.includes(name))));});if(!row)return null;const value=Number(row.last??row.indexValue??row.value),change=Number(row.percentChange??row.percChange??row.changePercent??row.change);return Number.isFinite(value)&&Number.isFinite(change)?{value,change}:null;}

async function analytics(history:Point[],nav:number|null,mappedNames:string[],indexHistories:Map<string,Point[]>,expectedMove:number|null):Promise<Analytics>{
 const fr=returns(history);const negative=Array.from(fr.values()).filter(x=>x<0).map(Math.abs);
 const cheapness=expectedMove!=null&&expectedMove<0?Math.min(100,percentile(Math.abs(expectedMove),negative)*1.05):0;
 const last60=history.slice(-60).map(x=>x.value);const peak=Math.max(...last60,nav??0);const dd=nav!=null&&peak>0?Math.max(0,(peak-nav)/peak*100):0;
 const recent=Array.from(fr.values()).slice(-60),mean=recent.length?recent.reduce((a,b)=>a+b,0)/recent.length:0;const vol=recent.length?Math.sqrt(252)*Math.sqrt(recent.reduce((a,x)=>a+(x-mean)**2,0)/recent.length):null;
 const fundArr:number[]=[],basketArr:number[]=[];const returnMaps=mappedNames.map(n=>returns(indexHistories.get(n)??[]));const allDates=new Set<string>();returnMaps.forEach(m=>Array.from(m.keys()).forEach(d=>allDates.add(d)));
 for(const d of Array.from(allDates)){const fv=fr.get(d);if(fv==null)continue;const vals=returnMaps.map(m=>m.get(d)).filter((x):x is number=>x!=null);if(vals.length){fundArr.push(fv);basketArr.push(vals.reduce((a,b)=>a+b,0)/vals.length);}}
 const b=beta(fundArr,basketArr);return{beta:b,volatility:vol,drawdown:dd,cheapness,historyCoverage:Math.min(100,history.length/500*100),basketSensitivity:b,estimatedChange:null};
}

function sectorAlignment(category:string,lead:string){const s=lead.toUpperCase();if(!lead||lead==='NO LIVE MAPPED INDEX')return 0.35;if(s.includes('IT')||s.includes('TELECOMMUNICATION'))return category==='Technology'?1:category==='Focused Equity'?0.45:['Diversified','Multi Cap','Large & Mid Cap','ELSS'].includes(category)?0.35:0.25;if(s.includes('HEALTH')||s.includes('PHARMA')||s.includes('HOSPITAL'))return category==='Healthcare'?1:category==='Focused Equity'?0.45:['Diversified','Multi Cap','Large & Mid Cap'].includes(category)?0.35:0.25;if(s.includes('BANK')||s.includes('FINANCIAL')||s.includes('NBFC')||s.includes('INSURANCE')||s.includes('HOUSING FINANCE'))return category==='Banking & Financial'?1:category==='Focused Equity'||category==='Value'?0.45:['Multi Asset','Diversified','Multi Cap','Large & Mid Cap'].includes(category)?0.35:0.25;if(s.includes('INFRA')||s.includes('CAPITAL GOODS')||s.includes('POWER')||s.includes('CEMENT')||s.includes('CONSTRUCTION'))return category==='Infrastructure'?1:['Diversified','Multi Cap','Large & Mid Cap'].includes(category)?0.35:0.25;if(s.includes('SERVICES'))return category==='Services'?1:['Diversified','Multi Cap','Large & Mid Cap'].includes(category)?0.35:0.25;if(s.includes('COMMODITIES'))return category==='Gold'?1:0.2;if(s==='NIFTY 50')return category==='Nifty 50'?1:['Focused Equity','Diversified','Multi Cap','Large & Mid Cap','ELSS','Children','Value'].includes(category)?0.45:0.3;if(s.includes('MIDCAP'))return category==='Mid Cap'?1:category==='Large & Mid Cap'?0.65:['Multi Cap','Diversified'].includes(category)?0.45:0.25;if(s.includes('SMALLCAP'))return category==='Small Cap'?1:['Multi Cap','Diversified'].includes(category)?0.35:0.2;return 0.3;}

export async function GET(){
 try{
  const [amfiMap,nse]=await Promise.all([amfi(),nseRows()]);
  const indices:IndexRow[]=await Promise.all(indexNames.map(async([name,group])=>{const n=findIndex(name,nse);if(n)return{name,value:n.value,change:n.change,status:'LIVE',group,source:'NSE'};const q=yahoo[name]?await yahooQuote(yahoo[name]):null;return{name,value:q?.value??null,change:q?.change??null,status:q?'LIVE':'UNAVAILABLE',group,source:q?'YAHOO':'UNAVAILABLE'};}));
  const map=new Map(indices.map(x=>[x.name,x]));
  const needed=Array.from(new Set(funds.flatMap(x=>x[3]).filter(n=>Boolean(yahoo[n]))));
  const indexHistories=new Map<string,Point[]>((await Promise.all(needed.map(async n=>[n,await yahooHistory(yahoo[n])] as [string,Point[]]))).filter(([,h])=>h.length>30));
  const histories=await Promise.all(funds.map(async([code])=>[code,await fundHistory(code)] as [string,Point[]]));
  const histMap=new Map(histories);
  const output=await Promise.all(funds.map(async([code,name,category,mappedNames])=>{
   const h=histMap.get(code)??[];const a=amfiMap.get(code);const nav=a?.nav??h.at(-1)?.value??null;const prev=h.at(-2)?.value??null;const change=a&&prev?((a.nav-prev)/prev)*100:(h.length>1?((h.at(-1)!.value-h.at(-2)!.value)/h.at(-2)!.value)*100:null);
   const live=mappedNames.map(n=>map.get(n)).filter((x):x is IndexRow=>Boolean(x&&x.status==='LIVE'&&x.change!=null));const move=live.length?live.reduce((s,x)=>s+(x.change??0),0)/live.length:null;const falling=live.filter(x=>(x.change??0)<0).length;const confirmation=live.length?falling/live.length:0;const lead=live.length?live.reduce((best,x)=>(x.change??0)<(best.change??0)?x:best):null;
   const provisional=await analytics(h,nav,mappedNames,indexHistories,null);const expectedMove=move!=null&&provisional.beta!=null?move*provisional.beta:null;const an=await analytics(h,nav,mappedNames,indexHistories,expectedMove);const relative=expectedMove!=null&&move!=null?expectedMove-move:null;
   const primarySectorScore=lead?.change!=null&&lead.change<0?Math.min(100,Math.abs(lead.change)*45):0;
   const basketSectorScore=move!=null&&move<0?Math.min(100,Math.abs(move)*35):0;
   const baseSectorScore=Math.max(primarySectorScore,basketSectorScore);
   const alignment=sectorAlignment(category,lead?.name??'');
   const sectorScore=baseSectorScore*alignment;
   const relativeScore=relative!=null&&relative<0?Math.min(100,Math.abs(relative)*55):0;
   const confirmationScore=confirmation*100;
   const qualityScore=quality[category]??75;
   const historyScore=an.cheapness;
   const dataConfidence=Math.round((live.length/Math.max(1,mappedNames.length)*60)+(an.historyCoverage*.20)+(an.beta!=null?20:0));
   const rawScore=sectorScore*.55+relativeScore*.15+confirmationScore*.10+historyScore*.10+qualityScore*.05+(alignment*100)*.05;
   const risk=Math.max(0,Math.min(100,(an.volatility??0)*5+(an.drawdown??0)*2));
   const score=Math.max(0,Math.min(100,rawScore*(.75+.25*dataConfidence/100)));
   const confidence=Math.max(0,Math.min(100,dataConfidence*.55+confirmationScore*.25+qualityScore*.20));
   let signal='WAIT';
   if(score>=75&&confidence>=75&&risk<65&&historyScore>=55&&confirmation>=.33)signal='STRONG BUY';
   else if(score>=60&&confidence>=60&&risk<70&&confirmation>=.33)signal='BUY';
   else if(score>=42&&confidence>=45&&confirmation>=.33)signal='ACCUMULATE';
   else if(score>=30)signal='WATCH';
   const base=prev??(nav!=null&&change!=null?nav/(1+change/100):null);const estimatedChange=expectedMove;const estimatedNav=base!=null&&estimatedChange!=null?base*(1+estimatedChange/100):null;
   return{code,name,category,nav,previousNav:prev,change,date:a?.date??h.at(-1)?.date??null,status:nav!=null?'LIVE':'UNAVAILABLE',sectorMove:move,leadSector:lead?.name??'NO LIVE MAPPED INDEX',leadMove:lead?.change??null,relativeCorrection:relative,confirmation,mappedLive:live.length,mappedTotal:mappedNames.length,sectorScore:Number(sectorScore.toFixed(1)),sectorAlignment:Number(alignment.toFixed(2)),relativeScore:Number(relativeScore.toFixed(1)),confirmationScore:Number(confirmationScore.toFixed(1)),qualityScore,score:Number(score.toFixed(1)),opportunityScore:Number(score.toFixed(1)),riskScore:Number(risk.toFixed(1)),confidenceScore:Number(confidence.toFixed(1)),signal,reason:lead?`${lead.name} ${(lead.change??0)>=0?'+':''}${(lead.change??0).toFixed(2)}% • sector alignment ${(alignment*100).toFixed(0)}% • ${live.length}/${mappedNames.length} proxy indexes live • expected NAV Δ ${estimatedChange==null?'—':estimatedChange.toFixed(2)+'%'}`:'Waiting for mapped proxy index data',historicalCheapness:Number(historyScore.toFixed(1)),volatility:an.volatility==null?null:Number(an.volatility.toFixed(1)),drawdown:an.drawdown==null?null:Number(an.drawdown.toFixed(1)),beta:an.beta==null?null:Number(an.beta.toFixed(2)),dataConfidence,estimatedNav,estimatedChange:estimatedChange==null?null:Number(estimatedChange.toFixed(2)),proxyBasket:true};
  }));
  output.sort((a,b)=>b.opportunityScore-a.opportunityScore);
  const liveIndices=indices.filter(x=>x.status==='LIVE').length,falling=indices.filter(x=>x.status==='LIVE'&&(x.change??0)<0).length,breadth=liveIndices?falling/liveIndices*100:0;const regime=breadth>=80?'PANIC':breadth>=65?'STRONG CORRECTION':breadth>=40?'CORRECTION':breadth>=25?'MIXED':'RISK-ON';
  const sectors=indices.filter(x=>x.group!=='BROAD').map(x=>({name:x.name,value:x.value,change:x.change,status:x.status,severity:x.change!=null&&x.change<0?'WEAK':'STRONG'}));
  const overallDataConfidence=indices.length?Math.round(indices.filter(x=>x.status==='LIVE').length/indices.length*100):0;
  return NextResponse.json({updatedAt:new Date().toISOString(),funds:output,indices,sectors,summary:{trackedFunds:funds.length,liveFunds:output.filter(x=>x.status==='LIVE').length,liveIndices,unavailableIndices:indices.length-liveIndices,fallingIndices:falling,buySignals:output.filter(x=>x.signal==='BUY'||x.signal==='STRONG BUY').length,accumulateSignals:output.filter(x=>x.signal==='ACCUMULATE').length,breadth:Number(breadth.toFixed(1)),regime,dataConfidence:overallDataConfidence,coverage:`${liveIndices}/${indices.length}`},disclaimer:'Mapped indices are analytical proxy baskets, not actual portfolio holdings. Sector alignment now penalizes diversified funds when a specific sector falls; beta is estimated from fund NAV history versus available mapped proxy-index history. 2:30 PM NAV is an estimate until official NAV is published.'},{headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('dashboard error',error);return NextResponse.json({error:'Live market feed unavailable',detail:error instanceof Error?error.message:'Unknown error'},{status:500,headers:{'Cache-Control':'no-store'}});}
}
