import {describe,expect,it} from "vitest";
import {shouldEnableAnalytics} from "./analytics";

describe("analytics environment guard",()=>{
  it("only enables configured production hosts",()=>{
    expect(shouldEnableAnalytics({production:true,key:"phc_real",hostname:"everythingcontent.example"})).toBe(true);
    expect(shouldEnableAnalytics({production:false,key:"phc_real",hostname:"everythingcontent.example"})).toBe(false);
    expect(shouldEnableAnalytics({production:true,key:"phc_real",hostname:"localhost"})).toBe(false);
    expect(shouldEnableAnalytics({production:true,hostname:"everythingcontent.example"})).toBe(false);
  });
});
