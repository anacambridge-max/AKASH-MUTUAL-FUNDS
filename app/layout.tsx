import './globals.css';
import './terminal.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {title:'AKASH MUTUAL FUNDS',description:'Live mutual fund opportunity dashboard for Akash'};

const timeLabelScript=`(()=>{const r=()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const a=[];let n;while(n=w.nextNode())a.push(n);for(const x of a){if(x.nodeValue){x.nodeValue=x.nodeValue.replaceAll('3 PM','2:30 PM').replaceAll('03:00 PM','02:30 PM').replaceAll('3pm','2:30pm').replaceAll('3PM','2:30PM');}}};r();new MutationObserver(r).observe(document.body,{subtree:true,childList:true,characterData:true});})();`;

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<script dangerouslySetInnerHTML={{__html:timeLabelScript}}/></body></html>}
