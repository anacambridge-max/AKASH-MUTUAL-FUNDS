import {NextResponse} from 'next/server';
import {buildDashboard} from './engine-v3';
export const dynamic='force-dynamic';
export const revalidate=0;
export const maxDuration=60;
export async function GET(req:Request){try{const u=new URL(req.url);const data=await buildDashboard(Number(u.searchParams.get('strategicWeight')??60),Number(u.searchParams.get('opportunityWeight')??40));return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}})}catch(error){console.error(error);return NextResponse.json({error:'Live market feed unavailable',detail:error instanceof Error?error.message:'Unknown error'},{status:500})}}
