import posthog from "posthog-js";

export type AnalyticsEvent =
  | "landing_viewed"
  | "build_brain_clicked"
  | "signup_started"
  | "signup_completed"
  | "universe_started"
  | "universe_question_1_completed"
  | "universe_question_2_completed"
  | "universe_question_3_completed"
  | "universe_question_4_completed"
  | "universe_generated"
  | "universe_confirmed"
  | "universe_share_clicked"
  | "universe_share_link_created"
  | "universe_share_card_downloaded"
  | "public_universe_viewed"
  | "build_yours_from_shared_page_clicked"
  | "content_brain_used"
  | "first_content_generated"
  | "share_section_viewed"
  | "share_template_selected"
  | "share_format_selected"
  | "share_downloaded"
  | "share_native_opened"
  | "share_link_copied"
  | "share_caption_copied"
  | "yap_from_share_clicked"
  | "creator_type_generated"
  | "creator_type_shared"
  | "creator_type_downloaded"
  | "creator_type_public_viewed"
  | "creator_type_build_yours_clicked"
  | "workspace_creator_type_viewed"
  | "workspace_creator_type_shared"
  | "workspace_superpower_opened"
  | "workspace_territory_opened"
  | "workspace_yap_opened"
  | "workspace_yap_shared"
  | "workspace_brain_insight_opened"
  | "workspace_brain_insight_feedback"
  | "workspace_brain_view_opened";

type AnalyticsProperties = Record<string, string | number | boolean | null>;
let ready = false;

export function shouldEnableAnalytics(input: {
  production: boolean;
  key?: string;
  hostname: string;
}) {
  return (
    input.production &&
    Boolean(input.key) &&
    input.hostname !== "localhost" &&
    input.hostname !== "127.0.0.1"
  );
}

export function initAnalytics() {
  if (
    ready ||
    !shouldEnableAnalytics({
      production: import.meta.env.PROD,
      key: import.meta.env.VITE_POSTHOG_KEY,
      hostname: location.hostname,
    })
  )
    return;
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: false,
    person_profiles: "identified_only",
  });
  ready = true;
}

export function track(
  event: AnalyticsEvent,
  properties: AnalyticsProperties = {},
) {
  if (!ready) return;
  const referralShareId = sessionStorage.getItem("suchamojo:referral-share-id");
  const referral =
    referralShareId &&
    (event === "signup_completed" || event === "universe_generated")
      ? { referral_share_id: referralShareId, source: "public_universe" }
      : {};
  posthog.capture(event, { ...referral, ...properties });
}

export function identifyAnalyticsUser(
  id: string,
  properties: AnalyticsProperties,
) {
  if (ready) posthog.identify(id, properties);
}
