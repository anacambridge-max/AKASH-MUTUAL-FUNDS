import {NextResponse} from 'next/server';
import {buildDashboard} from './engine';

export const dynamic='force-dynamic';
export const revalidate=0;
export const maxDuration=60;

export async function GET(req:Request){
  try{
    const url=new URL(req.url);
    const strategicWeight=Number(url.searchParams.get('strategicWeight')??60);
    const opportunityWeight=Number(url.searchParams.get('opportunityWeight')??40);
    const data=await buildDashboard(strategicWeight,opportunityWeight);
    return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}});
  }catch(error){
    console.error('dashboard error',error);
    return NextResponse.json({error:'Live market feed unavailable',detail:error instanceof Error?error.message:'Unknown error'},{status:500,headers:{'Cache-Control':'no-store'}});
  }
}

// Smart MF Daily Decision Terminal: 60/40 Strategic + Daily NAV Opportunity by default.
