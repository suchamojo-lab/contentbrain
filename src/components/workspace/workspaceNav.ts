import type {WorkspacePath} from "../../routing/routes";
export interface WorkspaceNavItem{path:WorkspacePath;label:string;mark:string;section?:"BRAIN"|"LIBRARY"|"TRAIN YOUR BRAIN"|"MORE";later?:boolean}
export const workspaceNav:WorkspaceNavItem[]=[
 {path:"/app",label:"Home",mark:"⌂",section:"BRAIN"},{path:"/app/chat",label:"Content Brain",mark:"✦"},{path:"/app/universe",label:"Content Universe",mark:"✣"},
 {path:"/app/library",label:"Library",mark:"▤",later:true},{path:"/app/discover",label:"Discover",mark:"⌁",later:true},
 {path:"/app/create",label:"Create",mark:"＋",later:true},
 {path:"/app/train",label:"Train your brain",mark:"◎",section:"MORE"},{path:"/app/calendar",label:"Calendar",mark:"□",later:true},{path:"/app/settings",label:"Settings",mark:"⚙"},
];
