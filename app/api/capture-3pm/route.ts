import {NextResponse} from 'next/server';
import {GET as dashboardGET} from '../dashboard/route';
export const dynamic='force-dynamic';
export const maxDuration=60;
export async function GET(){
 const now=new Date();
 const response=await dashboardGET();
 const data=await response.json();
 const summary=data?.summary||{};
 console.log(JSON.stringify({event:'3pm-nav-capture',capturedAt:now.toISOString(),trackedFunds:summary.trackedFunds,liveFunds:summary.liveFunds,liveIndices:summary.liveIndices,fallingIndices:summary.fallingIndices,topFunds:(data.funds||[]).slice(0,5).map((f:any)=>({code:f.code,name:f.name,score:f.score,signal:f.signal,nav:f.nav,change:f.change,leadSector:f.leadSector,leadMove:f.leadMove}))}));
 return NextResponse.json({ok:true,capturedAt:now.toISOString(),summary:summary,topFunds:(data.funds||[]).slice(0,5)});
}
