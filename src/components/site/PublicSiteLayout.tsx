import type {ReactNode} from "react";
import {SiteFooter} from "./SiteFooter";
import {SiteHeader,type SiteHeaderMode,type SiteSession} from "./SiteHeader";

export function PublicSiteLayout({children,session,headerMode="full",theme="light",showFooter=true,className=""}:{children:ReactNode;session:SiteSession;headerMode?:SiteHeaderMode;theme?:"light"|"dark";showFooter?:boolean;className?:string}){return <div className={`public-site-layout ${className}`}><SiteHeader session={session} mode={headerMode} theme={theme}/><div className="public-site-main">{children}</div>{showFooter?<SiteFooter/>:null}</div>}
