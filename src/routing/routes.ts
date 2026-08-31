export const workspacePaths=["/app","/app/universe","/app/inbox","/app/library","/app/discover","/app/create","/app/train","/app/calendar","/app/chat","/app/analytics","/app/settings"] as const;
export type WorkspacePath=typeof workspacePaths[number];

export function isWorkspacePath(pathname:string){return pathname==="/app"||pathname.startsWith("/app/")}
export function isAuthPath(pathname:string){return pathname==="/login"||pathname==="/signup"}
export function workspacePath(pathname:string):WorkspacePath{
 if(pathname.startsWith("/app/create/"))return "/app/create";
 return workspacePaths.includes(pathname as WorkspacePath)?pathname as WorkspacePath:"/app";
}
export function navigateTo(path:string,replace=false){history[replace?"replaceState":"pushState"]({},"",path);dispatchEvent(new PopStateEvent("popstate"));window.scrollTo({top:0,behavior:"smooth"})}
