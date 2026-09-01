/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ResendOTPPasswordReset from "../ResendOTPPasswordReset.js";
import type * as ai_fallback from "../ai/fallback.js";
import type * as ai_gemini from "../ai/gemini.js";
import type * as ai_types from "../ai/types.js";
import type * as auth from "../auth.js";
import type * as content from "../content.js";
import type * as contentBrain from "../contentBrain.js";
import type * as contentBrainData from "../contentBrainData.js";
import type * as contentBrainToolData from "../contentBrainToolData.js";
import type * as contentBrainTools from "../contentBrainTools.js";
import type * as creatorType from "../creatorType.js";
import type * as creatorTypeData from "../creatorTypeData.js";
import type * as http from "../http.js";
import type * as lifecycleEmailSender from "../lifecycleEmailSender.js";
import type * as lifecycleEmails from "../lifecycleEmails.js";
import type * as onboarding from "../onboarding.js";
import type * as universeCompleteEmailContent from "../universeCompleteEmailContent.js";
import type * as universeShares from "../universeShares.js";
import type * as workspace from "../workspace.js";
import type * as yapIdeaData from "../yapIdeaData.js";
import type * as yapIdeas from "../yapIdeas.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ResendOTPPasswordReset: typeof ResendOTPPasswordReset;
  "ai/fallback": typeof ai_fallback;
  "ai/gemini": typeof ai_gemini;
  "ai/types": typeof ai_types;
  auth: typeof auth;
  content: typeof content;
  contentBrain: typeof contentBrain;
  contentBrainData: typeof contentBrainData;
  contentBrainToolData: typeof contentBrainToolData;
  contentBrainTools: typeof contentBrainTools;
  creatorType: typeof creatorType;
  creatorTypeData: typeof creatorTypeData;
  http: typeof http;
  lifecycleEmailSender: typeof lifecycleEmailSender;
  lifecycleEmails: typeof lifecycleEmails;
  onboarding: typeof onboarding;
  universeCompleteEmailContent: typeof universeCompleteEmailContent;
  universeShares: typeof universeShares;
  workspace: typeof workspace;
  yapIdeaData: typeof yapIdeaData;
  yapIdeas: typeof yapIdeas;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
