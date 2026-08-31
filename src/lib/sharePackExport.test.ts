import {describe,expect,it} from "vitest";import {formatDimensions} from "./sharePackExport";
describe("share pack export",()=>{it("uses exact platform dimensions",()=>{expect(formatDimensions("story")).toEqual({width:1080,height:1920});expect(formatDimensions("post")).toEqual({width:1080,height:1350});expect(formatDimensions("landscape")).toEqual({width:1600,height:900})})});
