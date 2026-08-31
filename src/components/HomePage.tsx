import { LandingExperience } from "./homepage/LandingExperience";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import type { ModuleSlug } from "../data/universeModules";

export function HomePage({onStart,authenticated,name,hasUniverse}:{onStart:(slug?:ModuleSlug)=>void;authenticated:boolean;name?:string;hasUniverse:boolean}) {
  useSmoothScroll();
  return <LandingExperience onStart={onStart} authenticated={authenticated} name={name} hasUniverse={hasUniverse}/>;
}
