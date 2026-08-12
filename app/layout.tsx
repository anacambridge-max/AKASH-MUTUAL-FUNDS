import './globals.css';
import './terminal.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {title:'AKASH MUTUAL FUNDS',description:'Live mutual fund opportunity dashboard for Akash'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
