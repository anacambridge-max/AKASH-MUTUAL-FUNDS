'use client';

import {useEffect,useMemo,useState} from 'react';
import {Activity,ArrowDownRight,ArrowUpRight,BarChart3,BrainCircuit,Calculator,ChartNoAxesCombined,Clock3,RefreshCw,ShieldCheck,Sparkles,Target,TimerReset,TrendingDown,WalletCards,AlertTriangle,Bell} from 'lucide-react';

type Fund={code:string;name:string;category:string;nav:number|null;previousNav:number|null;change:number|null;date:string|null;status:string;sectorMove:number|null;leadSector:string;leadMove:number|null;relativeCorrection:number|null;confirmation:number;mappedLive:number;mappedTotal:number;sectorScore:number;relativeScore:number;confirmationScore:number;qualityScore:number;score:number;opportunityScore:number;riskScore:number;confidenceScore:number;signal:string;reason:string;historicalCheapness:number|null;volatility:number|null;drawdown:number|null;beta:number|null;dataConfidence:number};
type Index={name:string;value:number|null;change:number|null;status:string;group:'BROAD'|'SECTORAL'|'THEMATIC';source?:string};
type Sector={name:string;value:number|null;change:number|null;status:string;severity:string};
type Summary={trackedFunds:number;liveFunds:number;liveIndices:number;fallingIndices:number;buySignals:number;accumulateSignals:number;breadth:number;regime:string};
type SnapshotFund={estimateNav:number|null;estimateChange:number|null;marketMove:number|null;relativeCorrection:number|null;score:number;signal:string;mappedLive:number;mappedTotal:number};
type Snapshot={date:string;capturedAt:string;timezone:string;funds:Record<string,SnapshotFund>;summary:Record<string,number>};
type Backtest={code:string;name:string;sampleCount:number;threshold:number;horizon:number;winRate:number|null;averageForward:number|null;medianForward:number|null;bestForward:number|null;worstForward:number|null;maxDrawdown?:number};

const pct=(n:number|null|undefined)=>n==null?'—':`${n>=0?'+':''}${n.toFixed(2)}%`;
const money=(n:number|null|undefined)=>n==null?'—':`₹${n.toFixed(4)}`;
const num=(n:number|null|undefined,d=1)=>n==null?'—':n.toFixed(d);
const cls=(n:number|null|undefined)=>n==null?'muted':n<0?'negative':'positive';
const signalClass=(s:string|undefined)=>(s||'WAIT').toLowerCase().replaceAll(' ','-');

function ist(){
 const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',weekday:'short',hour12:false}).formatToParts(new Date());
 const g=(x:string)=>p.find(a=>a.type===x)?.value||'';
 return{date:`${g('year')}-${g('month')}-${g('day')}`,hour:Number(g('hour')),minute:Number(g('minute')),weekday:g('weekday')};
}
function in3PmWindow(){const p=ist();return p.weekday!=='Sat'&&p.weekday!=='Sun'&&((p.hour===14&&p.minute>=55)||(p.hour===15&&p.minute<=10));}
function estimate3pm(f:Fund,s:Snapshot|null){
 const saved=s?.funds?.[f.code];
 if(saved?.estimateNav!=null)return saved;
 const base=f.previousNav??(f.nav!=null&&f.change!=null?f.nav/(1+f.change/100):null);
 const move=f.sectorMove==null?null:f.sectorMove*(f.beta??1);
 return{estimateNav:base!=null&&move!=null?base*(1+move/100):null,estimateChange:move,marketMove:move,relativeCorrection:f.relativeCorrection,score:f.opportunityScore,signal:f.signal,mappedLive:f.mappedLive,mappedTotal:f.mappedTotal};
}

export default function Home(){
 const [funds,setFunds]=useState<Fund[]>([]),[indices,setIndices]=useState<Index[]>([]),[sectors,setSectors]=useState<Sector[]>([]),[summary,setSummary]=useState<Summary|null>(null),[snapshot,setSnapshot]=useState<Snapshot|null>(null),[updated,setUpdated]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const [filter,setFilter]=useState<'ALL'|'BROAD'|'SECTORAL'|'THEMATIC'>('ALL'),[search,setSearch]=useState(''),[capital,setCapital]=useState(10000),[holdings,setHoldings]=useState<Record<string,number>>({}),[alerts,setAlerts]=useState(false),[backtests,setBacktests]=useState<Backtest[]>([]),[btLoading,setBtLoading]=useState(false),[horizon,setHorizon]=useState(20),[threshold,setThreshold]=useState(1);

 const load=async()=>{
  setLoading(true);setError('');
  try{
   const [a,b]=await Promise.all([fetch('/api/dashboard',{cache:'no-store'}),fetch('/api/capture-3pm',{cache:'no-store'})]);
   if(!a.ok)throw new Error('Dashboard API unavailable');
   const d=await a.json();
   setFunds(Array.isArray(d.funds)?d.funds:[]);setIndices(Array.isArray(d.indices)?d.indices:[]);setSectors(Array.isArray(d.sectors)?d.sectors:[]);setSummary(d.summary||null);setUpdated(d.updatedAt||'');
   if(b.ok){const x=await b.json();if(x?.snapshot?.date===ist().date)setSnapshot(x.snapshot);}
  }catch(e){setError(e instanceof Error?e.message:'Live market feed unavailable.');}
  finally{setLoading(false);}
 };

 useEffect(()=>{
  try{
   const h=window.localStorage.getItem('akash-holdings');if(h)setHoldings(JSON.parse(h));
   const c=window.localStorage.getItem('akash-capital');if(c)setCapital(Number(c));
   const raw=window.localStorage.getItem('akash-3pm-snapshot');if(raw){const saved=JSON.parse(raw) as Snapshot;if(saved?.date===ist().date)setSnapshot(saved);}
  }catch{}
  void load();
  const timer=window.setInterval(()=>void load(),5*60*1000);
  return()=>window.clearInterval(timer);
 },[]);
 useEffect(()=>{try{if(snapshot)window.localStorage.setItem('akash-3pm-snapshot',JSON.stringify(snapshot));}catch{}},[snapshot]);
 useEffect(()=>{try{window.localStorage.setItem('akash-holdings',JSON.stringify(holdings));window.localStorage.setItem('akash-capital',String(capital));}catch{}},[holdings,capital]);
 useEffect(()=>{
  if(!alerts||!funds.length||typeof Notification==='undefined')return;
  const candidate=funds.find(f=>['STRONG BUY','BUY'].includes(f.signal)&&f.confidenceScore>=70);
  if(!candidate)return;
  if(Notification.permission==='granted')new Notification('AKASH MF opportunity',{body:`${candidate.name}: ${candidate.signal} • ${num(candidate.opportunityScore)}/100 • ${num(candidate.confidenceScore)}% confidence`});
 },[alerts,funds]);

 const best=useMemo(()=>funds[0],[funds]);
 const top=useMemo(()=>funds.slice(0,5),[funds]);
 const falling=useMemo(()=>indices.filter(i=>i.change!=null).sort((a,b)=>(a.change??0)-(b.change??0)).slice(0,10),[indices]);
 const visible=useMemo(()=>indices.filter(i=>(filter==='ALL'||i.group===filter)&&i.name.toLowerCase().includes(search.toLowerCase())),[indices,filter,search]);
 const picks=useMemo(()=>funds.filter(f=>['STRONG BUY','BUY','ACCUMULATE'].includes(f.signal)).slice(0,4),[funds]);
 const plan=useMemo(()=>{
  if(!picks.length||capital<=0)return[];
  const weights=picks.map(f=>Math.max(1,f.opportunityScore*(1-Math.min(100,f.riskScore)/140)*(Math.max(20,f.confidenceScore)/100)));
  const total=weights.reduce((a,b)=>a+b,0);
  return picks.map((f,i)=>({...f,allocation:Math.floor((capital*weights[i]/total)/100)*100}));
 },[funds,picks,capital]);
 const allocated=plan.reduce((a,f)=>a+f.allocation,0); const reserve=Math.max(0,capital-allocated);
 const portfolioValue=Object.values(holdings).reduce((a,b)=>a+b,0);
 const concentration=portfolioValue>0?Math.max(...Object.values(holdings))/portfolioValue*100:0;
 const threePm=best?estimate3pm(best,snapshot):null;
 const threePmState=snapshot?'READY':in3PmWindow()?'LIVE':'WAITING';

 const requestAlerts=async()=>{if(typeof Notification==='undefined')return;try{const p=await Notification.requestPermission();setAlerts(p==='granted');}catch{setAlerts(false);}};
 const runBacktest=async()=>{
  setBtLoading(true);
  try{const r=await fetch(`/api/backtest?threshold=${threshold}&horizon=${horizon}`,{cache:'no-store'});if(!r.ok)throw new Error('Backtest failed');const d=await r.json();setBacktests(Array.isArray(d.results)?d.results:[]);}catch{setError('Backtest engine could not load. Try again.');}finally{setBtLoading(false);}
 };

 return <main>
  <header className="hero">
   <div><div className="eyebrow"><span className="live-dot"/> AKASH • PREMIUM INVESTMENT TERMINAL</div><h1>AKASH MUTUAL FUNDS</h1><p>19-fund opportunity intelligence • 50-index market map • historical cheapness • 3 PM purchase engine</p></div>
   <div className="hero-actions"><div className="last-sync"><Clock3 size={14}/>{updated?new Date(updated).toLocaleString('en-IN'):'Syncing market…'}</div><button className="refresh" onClick={()=>void load()} disabled={loading}><RefreshCw size={17} className={loading?'spin':''}/>{loading?'Syncing…':'Refresh Now'}</button></div>
  </header>

  {error&&<div className="error"><AlertTriangle size={16}/><span>{error}</span><button onClick={()=>void load()}>Retry</button></div>}

  <section className="regime-grid">
   <div className="regime-card"><span>MARKET REGIME</span><strong>{summary?.regime||'SYNCING'}</strong><small>{summary?.breadth??0}% of live indexes falling</small></div>
   <div className="regime-card"><span>BEST OPPORTUNITY</span><strong>{best?.name||'Waiting for data'}</strong><small>{best?`${best.signal} • ${num(best.opportunityScore)}/100 • ${num(best.confidenceScore)}% confidence`:''}</small></div>
   <div className="regime-card"><span>3 PM ENGINE</span><strong>{threePmState==='READY'?'SNAPSHOT READY':threePmState==='LIVE'?'WINDOW LIVE':'WAITING FOR 3 PM'}</strong><small>{snapshot?`Captured ${new Date(snapshot.capturedAt).toLocaleTimeString('en-IN')}`:'Server-side target: 03:00 PM IST'}</small></div>
  </section>

  <section className="hero-opportunity">
   <div className="opportunity-copy">
    <div className="section-kicker">TODAY'S BEST OPPORTUNITY</div><h2>{best?.name||'No live opportunity yet'}</h2>
    <div className="big-signal"><span className={`badge ${signalClass(best?.signal)}`}>{best?.signal||'WAIT'}</span><b>{best?num(best.opportunityScore):'—'}/100</b><span>Confidence {best?num(best.confidenceScore):'—'}%</span></div>
    <p>{best?.reason||'Waiting for live market confirmation.'}</p>
    <div className="metric-row"><div><span>Estimated NAV</span><b>{money(threePm?.estimateNav)}</b></div><div><span>3 PM Δ</span><b className={cls(threePm?.estimateChange)}>{pct(threePm?.estimateChange)}</b></div><div><span>Historical Cheapness</span><b>{best?.historicalCheapness!=null?`${num(best.historicalCheapness)}%`:'—'}</b></div><div><span>Risk Score</span><b>{best?num(best.riskScore):'—'}/100</b></div></div>
   </div>
   <div className="opportunity-chain"><div><b>1</b><span>Market / sector fall</span><strong>{best?best.leadSector:'—'} {pct(best?.leadMove)}</strong></div><i>↓</i><div><b>2</b><span>Mapped confirmation</span><strong>{best?`${best.mappedLive}/${best.mappedTotal} live`:'—'}</strong></div><i>↓</i><div><b>3</b><span>Fund sensitivity</span><strong>β {num(best?.beta,2)}</strong></div><i>↓</i><div><b>4</b><span>Decision</span><strong>{best?.signal||'WAIT'}</strong></div></div>
  </section>

  <section className="cutoff-panel"><div className="cutoff-main"><div className="cutoff-icon"><TimerReset size={20}/></div><div><span className="section-kicker">3 PM NAV CUT-OFF ENGINE</span><h2>3 PM Purchase Snapshot</h2><p>Server-side Vercel Cron captures the mapped-index market move around 3 PM IST and estimates the same-day closing NAV. This is an estimate; the official NAV remains end-of-day published NAV.</p></div></div><div className="cutoff-status"><b className={threePmState!=='WAITING'?'positive':''}>{threePmState==='LIVE'?'3 PM WINDOW LIVE':threePmState==='READY'?'3 PM SNAPSHOT READY':'WAITING FOR 3 PM'}</b><span>{snapshot?`Captured: ${new Date(snapshot.capturedAt).toLocaleString('en-IN')}`:'Cron target: 03:00 PM IST'}</span></div></section>

  <section className="stats"><div className="stat"><span>Tracked Funds</span><b>{summary?.trackedFunds??19}</b><small>{summary?.liveFunds??0} NAV feeds live</small></div><div className="stat"><span>BUY Signals</span><b className="positive">{summary?.buySignals??0}</b><small>{summary?.accumulateSignals??0} accumulate setups</small></div><div className="stat"><span>Falling Indices</span><b className="negative">{summary?.fallingIndices??0}</b><small>Across monitored universe</small></div><div className="stat"><span>Data Confidence</span><b className="positive">{best?num(best.dataConfidence):'—'}%</b><small>Best signal feed quality</small></div></section>

  <section className="panel index-monitor"><div className="panelhead"><div><span className="section-kicker">NIFTY INDEX MONITOR</span><h2>Complete Market Map</h2></div><BarChart3 size={19}/></div><div className="index-tools"><div className="index-tabs"><button className={filter==='ALL'?'active':''} onClick={()=>setFilter('ALL')}>ALL <em>{indices.length}</em></button>{[['BROAD','Broad Market'],['SECTORAL','Sectoral'],['THEMATIC','Thematic']].map(([k,l])=><button key={k} className={filter===k?'active':''} onClick={()=>setFilter(k as typeof filter)}>{l} <em>{indices.filter(i=>i.group===k).length}</em></button>)}</div><input className="searchbox" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Nifty index…"/></div><div className="index-grid">{visible.map(i=><div className={`index-card ${i.change!=null&&i.change<0?'down':''}`} key={i.name}><div className="index-card-top"><span>{i.group}</span><b className={cls(i.change)}>{pct(i.change)}</b></div><strong>{i.name}</strong><small>{i.value!=null?i.value.toLocaleString('en-IN',{maximumFractionDigits:2}):'Feed unavailable'}</small></div>)}</div></section>

  <section className="main-grid">
   <div className="panel"><div className="panelhead"><div><span className="section-kicker">MARKET INTELLIGENCE</span><h2>Where the market is weak</h2></div><Activity size={19}/></div>{falling.map(i=><div className="market-row" key={i.name}><div><strong>{i.name}</strong><small>{i.value!=null?i.value.toLocaleString('en-IN',{maximumFractionDigits:2}):'—'}</small></div><div className={`move ${cls(i.change)}`}>{i.change!=null&&i.change<0?<ArrowDownRight size={15}/>:<ArrowUpRight size={15}/>} {pct(i.change)}</div></div>)}</div>
   <div className="panel"><div className="panelhead"><div><span className="section-kicker">MODEL OUTPUT</span><h2>Top Opportunities</h2></div><Sparkles size={19}/></div>{top.map((f,i)=><div className="op" key={f.code}><div className="rank">{String(i+1).padStart(2,'0')}</div><div className="opmain"><strong>{f.name}</strong><small>{f.category} • {f.reason}</small><div className="mini-track"><i style={{width:`${Math.min(100,f.opportunityScore)}%`}}/></div></div><div className="score"><b>{num(f.opportunityScore)}</b><span className={`badge ${signalClass(f.signal)}`}>{f.signal}</span></div></div>)}</div>
  </section>

  <section className="analysis-grid">
   <div className="panel"><div className="panelhead"><div><span className="section-kicker">SECTOR HEATMAP</span><h2>Correction Map</h2></div><TrendingDown size={19}/></div><div className="heatmap">{sectors.map(s=><div key={s.name} className={`heat ${s.change!=null&&s.change<0?'down':'up'}`}><span>{s.name.replace('NIFTY ','')}</span><b>{pct(s.change)}</b></div>)}</div></div>
   <div className="panel"><div className="panelhead"><div><span className="section-kicker">DECISION DESK</span><h2>Today's Action Plan</h2></div><Target size={19}/></div>{best&&['STRONG BUY','BUY','ACCUMULATE'].includes(best.signal)?<div className="decision-focus"><strong>{best.name}</strong><span>{best.signal} • opportunity {num(best.opportunityScore)} • risk {num(best.riskScore)} • confidence {num(best.confidenceScore)}%</span><p>{best.reason}</p><div className="decision-metrics"><b>Sector {pct(best.sectorMove)}</b><b>Fund {pct(best.change)}</b><b>Relative {pct(best.relativeCorrection)}</b><b>β {num(best.beta,2)}</b><b>Data {num(best.dataConfidence)}%</b></div></div>:<div className="empty"><ShieldCheck size={22}/><strong>No BUY / ACCUMULATE setup</strong><span>Wait for a stronger correction plus multi-index confirmation.</span></div>}<div className="rule">Opportunity = correction + relative weakness + mapped-index confirmation + historical cheapness + fund quality. Risk and data confidence reduce the final decision strength. This is a rule-based analytical estimate, not a guaranteed return.</div></div>
  </section>

  <section className="panel"><div className="panelhead"><div><span className="section-kicker">CAPITAL DEPLOYMENT</span><h2>Today's Purchase Plan</h2></div><Calculator size={19}/></div><div className="planner-controls"><label>Capital available ₹ <input type="number" min="0" step="500" value={capital} onChange={e=>setCapital(Math.max(0,Number(e.target.value)||0))}/></label><span className="planner-note">Allocation is weighted by opportunity, risk and confidence. It never guarantees returns.</span></div>{plan.length?<><div className="allocation-grid">{plan.map(f=><div className="allocation" key={f.code}><div><strong>{f.name}</strong><small>{f.signal} • opportunity {num(f.opportunityScore)} • risk {num(f.riskScore)}</small></div><b>₹{f.allocation.toLocaleString('en-IN')}</b></div>)}</div><div className="portfolio-summary"><span>Planned deployment <b>₹{allocated.toLocaleString('en-IN')}</b></span><span>Cash reserve <b>₹{reserve.toLocaleString('en-IN')}</b></span><span>Selected funds <b>{plan.length}</b></span></div></>:<div className="empty compact"><strong>No deployable setup</strong><span>Keep the capital in reserve until the engine confirms a stronger opportunity.</span></div>}</section>

  <section className="panel"><div className="panelhead"><div><span className="section-kicker">MY PORTFOLIO</span><h2>Holdings & Concentration</h2></div><WalletCards size={19}/></div><div className="holdings-grid">{funds.map(f=><label key={f.code}><span>{f.name}</span><input type="number" min="0" step="100" value={holdings[f.code]??''} placeholder="₹ value" onChange={e=>setHoldings(prev=>({...prev,[f.code]:Math.max(0,Number(e.target.value)||0)}))}/></label>)}</div><div className="portfolio-summary"><span>Total entered <b>₹{portfolioValue.toLocaleString('en-IN')}</b></span><span>Largest holding <b>{num(concentration)}%</b></span><span>Concentration status <b>{concentration>35?'HIGH':'CONTROLLED'}</b></span></div></section>

  <section className="panel"><div className="panelhead"><div><span className="section-kicker">VALIDATION ENGINE</span><h2>Historical Dip-Response Backtest</h2></div><ChartNoAxesCombined size={19}/></div><div className="backtest-controls"><label>1-day fall ≥ <select value={threshold} onChange={e=>setThreshold(Number(e.target.value))}><option value="0.5">0.50%</option><option value="1">1.00%</option><option value="1.5">1.50%</option><option value="2">2.00%</option></select></label><label>Forward horizon <select value={horizon} onChange={e=>setHorizon(Number(e.target.value))}><option value="5">5 days</option><option value="10">10 days</option><option value="20">20 days</option><option value="40">40 days</option></select></label><button className="refresh small" onClick={()=>void runBacktest()} disabled={btLoading}>{btLoading?'Running…':'Run Backtest'}</button></div>{backtests.length?<div className="backtest-grid">{backtests.slice(0,8).map(b=><div className="bt-card" key={b.code}><strong>{b.name}</strong><small>{b.sampleCount} historical events</small><div><span>Win rate</span><b>{b.winRate==null?'—':`${num(b.winRate)}%`}</b></div><div><span>Avg forward</span><b>{pct(b.averageForward)}</b></div><div><span>Median</span><b>{pct(b.medianForward)}</b></div><div><span>Best / Worst</span><b>{pct(b.bestForward)} / {pct(b.worstForward)}</b></div></div>)}</div>:<div className="empty compact"><BrainCircuit size={20}/><span>Run the backtest to measure how this dip-response rule behaved historically. Past performance is not predictive.</span></div>}</section>

  <section className="panel"><div className="panelhead"><div><span className="section-kicker">SIGNAL QUALITY</span><h2>Why a fund gets selected</h2></div><BrainCircuit size={19}/></div><div className="logic-grid"><div><b>35%</b><strong>Sector / market correction</strong><span>Measures weakness in the mapped index basket rather than a single noisy feed.</span></div><div><b>20%</b><strong>Relative weakness</strong><span>Checks whether the fund is correcting more than its mapped market proxy.</span></div><div><b>20%</b><strong>Confirmation</strong><span>More live mapped indexes increase confidence; missing feeds reduce it.</span></div><div><b>Historical</b><strong>Cheapness percentile</strong><span>Compares today's correction with the fund's own historical NAV moves.</span></div><div><b>β</b><strong>Fund sensitivity</strong><span>Uses estimated beta/sensitivity to avoid treating every fund as a 1× index tracker.</span></div><div><b>Risk</b><strong>Volatility & drawdown</strong><span>High volatility and deeper drawdowns lower deployment priority.</span></div></div><div className="alert-row"><div><Bell size={16}/><span>Browser alerts can notify you when a high-confidence BUY appears.</span></div><button className="refresh small" onClick={()=>void requestAlerts()}>{alerts?'Alerts enabled':'Enable alerts'}</button></div></section>

  <section className="panel tablepanel"><div className="panelhead"><div><span className="section-kicker">PORTFOLIO UNIVERSE</span><h2>All 19 Funds</h2></div><small>Ranked by opportunity score</small></div><div className="tablewrap"><table><thead><tr><th>Fund</th><th>Theme</th><th>NAV</th><th>3 PM EST.</th><th>3 PM Δ</th><th>Cheapness</th><th>Beta</th><th>Risk</th><th>Confidence</th><th>Data</th><th>Action</th></tr></thead><tbody>{funds.map(f=>{const e=estimate3pm(f,snapshot);return <tr key={f.code}><td><strong>{f.name}</strong><small>{f.code} • NAV date {f.date||'—'}</small></td><td>{f.category}</td><td>{money(f.nav)}</td><td><strong>{money(e.estimateNav)}</strong><small>{e.marketMove!=null?`Model basis ${pct(e.marketMove)}`:'3 PM snapshot not captured'}</small></td><td className={cls(e.estimateChange)}>{pct(e.estimateChange)}</td><td>{f.historicalCheapness==null?'—':`${num(f.historicalCheapness)}%`}</td><td>{num(f.beta,2)}</td><td>{num(f.riskScore)}</td><td>{num(f.confidenceScore)}%</td><td>{num(f.dataConfidence)}%</td><td><span className={`badge ${signalClass(f.signal)}`}>{f.signal}</span></td></tr>})}</tbody></table></div></section>

  <footer><b>AKASH MUTUAL FUNDS</b> • AMFI NAV + MFAPI history + NSE/NIFTY index feeds + Yahoo fallback • 3 PM server snapshot • historical backtest • local portfolio planner • official NAV remains end-of-day.</footer>
 </main>;
}
