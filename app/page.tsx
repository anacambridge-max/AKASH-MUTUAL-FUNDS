'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import {RefreshCw, TrendingDown, TrendingUp, Activity} from 'lucide-react';

type Fund={code:string;name:string;category:string;nav:number|null;date:string|null;change:number|null;score:number;signal:string;status:string};
type Index={name:string;value:number|null;change:number|null;status:string};
export default function Home(){
 const [funds,setFunds]=useState<Fund[]>([]),[indices,setIndices]=useState<Index[]>([]),[updated,setUpdated]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const load=useCallback(async()=>{setLoading(true);setError('');try{const r=await fetch('/api/dashboard',{cache:'no-store'});const j=await r.json();setFunds(j.funds||[]);setIndices(j.indices||[]);setUpdated(j.updatedAt||'')}catch(e){setError('Live data could not be loaded. Try Refresh.')}finally{setLoading(false)}},[]);
 useEffect(()=>{load();const t=setInterval(load,15*60*1000);return()=>clearInterval(t)},[load]);
 const top=useMemo(()=>funds.slice(0,5),[funds]); const buy=funds.filter(x=>x.signal==='BUY').length; const negative=indices.filter(x=>(x.change??0)<0).length;
 return <main><header><div><div className="eyebrow">AKASH • LIVE INVESTMENT TERMINAL</div><h1>AKASH MUTUAL FUNDS</h1><p>19-fund opportunity dashboard • market-aware signals • live refresh</p></div><button onClick={load} disabled={loading} className="refresh"><RefreshCw size={17} className={loading?'spin':''}/>{loading?'Refreshing…':'Refresh Now'}</button></header>
 <section className="stats"><div><span>Tracked Funds</span><b>19</b></div><div><span>BUY Signals</span><b className="green">{buy}</b></div><div><span>Falling Indices</span><b className="red">{negative}</b></div><div><span>Data Status</span><b className="green">{loading?'SYNCING':'LIVE'}</b></div></section>
 {error&&<div className="error">{error}</div>}
 <section className="grid2"><div className="panel"><div className="panelhead"><h2>Market Pulse</h2><small>{updated?new Date(updated).toLocaleString('en-IN'):''}</small></div><div className="indices">{indices.map(x=><div className="index" key={x.name}><div><strong>{x.name}</strong><small>{x.value!=null?x.value.toLocaleString('en-IN',{maximumFractionDigits:2}):'—'}</small></div><span className={(x.change??0)<0?'red':'green'}>{x.change==null?'—':`${x.change>=0?'+':''}${x.change.toFixed(2)}%`}</span></div>)}</div></div>
 <div className="panel"><div className="panelhead"><h2>Top Opportunities</h2><Activity size={18}/></div>{top.map((f,i)=><div className="op" key={f.code}><div className="rank">{i+1}</div><div className="opmain"><strong>{f.name}</strong><small>{f.category} • {f.nav!=null?`NAV ₹${f.nav.toFixed(4)}`:'NAV unavailable'}</small></div><div className="score"><b>{f.score}</b><span>{f.signal}</span></div></div>)}</div></section>
 <section className="panel tablepanel"><div className="panelhead"><h2>All 19 Funds</h2><small>Sorted by opportunity score</small></div><div className="tablewrap"><table><thead><tr><th>Fund</th><th>Category</th><th>NAV</th><th>Latest NAV Δ</th><th>Score</th><th>Action</th></tr></thead><tbody>{funds.map(f=><tr key={f.code}><td><strong>{f.name}</strong><small>{f.code}</small></td><td>{f.category}</td><td>{f.nav!=null?`₹${f.nav.toFixed(4)}`:'—'}</td><td className={(f.change??0)<0?'red':'green'}>{f.change==null?'—':`${f.change>=0?'+':''}${f.change.toFixed(2)}%`}</td><td><div className="bar"><i style={{width:`${f.score}%`}}/></div><b>{f.score}</b></td><td><span className={`badge ${f.signal.toLowerCase()}`}>{f.signal}</span></td></tr>)}</tbody></table></div></section>
 <footer>Data: MFAPI for mutual-fund NAV and Yahoo Finance market snapshots. Signals are analytical estimates, not guaranteed returns or investment advice.</footer>
 </main>
}