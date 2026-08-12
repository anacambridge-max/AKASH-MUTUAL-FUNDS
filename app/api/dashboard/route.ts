import {NextResponse} from 'next/server';
import {buildDashboard} from './engine-v3';

export const dynamic='force-dynamic';
export const revalidate=0;
export const maxDuration=60;

type CacheEntry={key:string;expiresAt:number;data:unknown};
let cache:CacheEntry|null=null;
let inFlight:Promise<unknown>|null=null;
const CACHE_MS=5*60*1000;

export async function GET(req:Request){
  try{
    const u=new URL(req.url);
    const strategicWeight=Number(u.searchParams.get('strategicWeight')??60);
    const opportunityWeight=Number(u.searchParams.get('opportunityWeight')??40);
    const key=`${strategicWeight}:${opportunityWeight}`;
    const now=Date.now();

    if(cache&&cache.key===key&&cache.expiresAt>now){
      return NextResponse.json(cache.data,{headers:{'Cache-Control':'public, s-maxage=300, stale-while-revalidate=600'}});
    }

    if(!inFlight){
      inFlight=buildDashboard(strategicWeight,opportunityWeight).finally(()=>{inFlight=null});
    }

    const data=await inFlight;
    cache={key,data,expiresAt:Date.now()+CACHE_MS};
    return NextResponse.json(data,{headers:{'Cache-Control':'public, s-maxage=300, stale-while-revalidate=600'}});
  }catch(error){
    console.error(error);
    if(cache?.data){
      return NextResponse.json(cache.data,{headers:{'Cache-Control':'public, s-maxage=60, stale-while-revalidate=600'}});
    }
    return NextResponse.json({error:'Live market feed unavailable',detail:error instanceof Error?error.message:'Unknown error'},{status:500});
  }
}
