import { useEffect, useMemo, useRef, useState } from "react";
import { useConvexAuth, useAuthActions } from "@convex-dev/auth/react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import App, { type ContentPersistence } from "./App";
import { AuthPage } from "./components/auth/AuthPage";
import { WorkspaceShell } from "./components/workspace/WorkspaceShell";
import {
  isAuthPath,
  isWorkspacePath,
  navigateTo,
  workspacePath,
} from "./routing/routes";
import { generateUniverse, mergeGeneratedUniverse } from "./lib/recommendation";
import {
  isPublicContentPath,
  PublicPage,
} from "./components/public/PublicPages";
import { identifyAnalyticsUser, track } from "./lib/analytics";
import { PublicUniversePage } from "./components/public/PublicUniversePage";
import { referralProperties } from "./lib/referral";

export function ConvexApp() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const previouslyAuthenticated = useRef(isAuthenticated);
  const { signOut } = useAuthActions();
  const [path, setPath] = useState(() => location.pathname);
  const [guestSessionId] = useState(() => {
    const key = "suchamojo:guest-session";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    localStorage.setItem(key, created);
    return created;
  });
  useEffect(() => {
    const update = () => setPath(location.pathname);
    addEventListener("popstate", update);
    return () => removeEventListener("popstate", update);
  }, []);
  useEffect(() => {
    if (path === "/") track("landing_viewed");
    if (path === "/signup") track("signup_started");
    if (path === "/universe/start") track("universe_started");
  }, [path]);
  useEffect(() => {
    if (!previouslyAuthenticated.current && isAuthenticated && path === "/signup") {
      track("signup_completed", referralProperties());
    }
    previouslyAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, path]);
  useEffect(() => {
    if (isLoading || isAuthenticated || !isWorkspacePath(path)) return;
    sessionStorage.setItem("suchamojo:return-to", `${path}${location.search}`);
    navigateTo("/login", true);
  }, [isLoading, isAuthenticated, path]);
  const profile = useQuery(
    api.content.currentUser,
    isAuthenticated ? {} : "skip",
  );
  const legacyUniverse = useQuery(
    api.content.latestUniverse,
    isAuthenticated ? {} : "skip",
  );
  const creatorProfile = useQuery(
    api.content.getCreatorProfile,
    isAuthenticated ? {} : "skip",
  );
  const saveCreatorProfile = useMutation(api.content.saveCreatorProfile);
  const onboardingRows = useQuery(api.onboarding.getAnswers, {
    guestSessionId,
  });
  const saveAnswer = useMutation(api.onboarding.saveAnswer);
  const buildContentUniverse = useAction(api.contentBrain.build);
  const classifyCreatorType = useAction(api.creatorType.classify);
  const createUniverseShare = useMutation(api.universeShares.createOrUpdate);
  const siteSession = {
    authenticated: isAuthenticated,
    name: profile?.name ?? profile?.email ?? undefined,
    hasUniverse: Boolean(legacyUniverse),
    onSignOut: isAuthenticated ? () => { void signOut().then(() => navigateTo("/")); } : undefined,
  };
  useEffect(() => {
    if (!profile?.id) return;
    identifyAnalyticsUser(String(profile.id), {
      has_universe: Boolean(legacyUniverse),
    });
  }, [legacyUniverse, profile?.id]);
  const savedAnswers = useMemo(
    () =>
      onboardingRows
        ? Object.fromEntries(
            onboardingRows
              .filter((row) => !row.skipped)
              .map((row) => [row.questionKey, row.answer]),
          )
        : undefined,
    [onboardingRows],
  );
  useEffect(() => {
    let robots = document.head.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.append(robots);
    }
    robots.content =
      path === "/" || isPublicContentPath(path) || path.startsWith("/u/")
        ? "index, follow"
        : "noindex, nofollow";
  }, [path]);
  useEffect(() => {
    if (
      !isAuthenticated ||
      !isAuthPath(path) ||
      profile === undefined ||
      legacyUniverse === undefined
    )
      return;
    const requested = sessionStorage.getItem("suchamojo:return-to");
    sessionStorage.removeItem("suchamojo:return-to");
    const next = legacyUniverse
      ? requested?.startsWith("/app")
        ? requested
        : "/app"
      : "/universe/start";
    navigateTo(next, true);
  }, [isAuthenticated, legacyUniverse, path, profile]);
  const publicShareId = path.match(/^\/u\/([a-zA-Z0-9]+)$/)?.[1];
  if (publicShareId) return <PublicUniversePage shareId={publicShareId} session={siteSession} />;
  if (isPublicContentPath(path)) return <PublicPage path={path} session={siteSession} />;
  if (isLoading)
    return <main className="auth-loading">Opening your Content Universe…</main>;
  if (!isAuthenticated && isWorkspacePath(path))
    return <main className="auth-loading">Taking you to sign in…</main>;
  if (isAuthenticated && profile === undefined)
    return <main className="auth-loading">Loading your Content Universe…</main>;
  const workspaceUniverse = (() => {
    if (legacyUniverse)
      return legacyUniverse.activationUniverse
        ? mergeGeneratedUniverse(legacyUniverse.activationUniverse, legacyUniverse.answers)
        : generateUniverse(legacyUniverse.answers);
    try {
      return JSON.parse(
        localStorage.getItem("suchamojo:content-universe:v1") ?? "{}",
      ).universe as ReturnType<typeof generateUniverse> | undefined;
    } catch {
      return undefined;
    }
  })();
  if (isAuthenticated && isWorkspacePath(path))
    return (
      <WorkspaceShell
        current={workspacePath(path)}
        ownerKey={String(profile?.id ?? "user")}
        name={profile?.name ?? undefined}
        universe={workspaceUniverse}
        universeId={legacyUniverse?.id ? String(legacyUniverse.id) : undefined}
        onSignOut={() => {
          void signOut().then(() => navigateTo("/"));
        }}
      />
    );
  if (isAuthPath(path)) {
    if (isAuthenticated)
      return <main className="auth-loading">Opening the right place…</main>;
    return <AuthPage mode={path === "/signup" ? "signUp" : "signIn"} />;
  }
  const persistence: ContentPersistence = {
    yapEnabled: isAuthenticated,
    buildUniverse: async ({ answers }) => {
      const built = await buildContentUniverse({
        guestSessionId,
        answers: {
          character: answers.character ?? "",
          naturalAuthority: answers.gifts ?? "",
          obsessions: answers.obsessions ?? "",
          expressionFormats: (answers.expressionFormats ?? "")
            .split(" | ")
            .filter(Boolean),
          expressionNotes: answers.expressionNotes ?? "",
        },
      });
      return {
        id: String(built.id),
        universe: mergeGeneratedUniverse(built.activationUniverse, answers),
        cached: built.cached,
      };
    },
    classifyCreatorType: async (universeId) => await classifyCreatorType({universeId:universeId as Id<"contentUniverses">}),
    ...(isAuthenticated
      ? {
          saveCreatorProfile: async (input) =>
            String(await saveCreatorProfile(input)),
        }
      : {}),
    saveAnswer: async (input) =>
      String(await saveAnswer({ ...input, guestSessionId })),
    ...(isAuthenticated
      ? {
          createUniverseShare: async (input) =>
            await createUniverseShare({
              ...input,
              universeId: input.universeId as Id<"contentUniverses">,
            }),
        }
      : {}),
  };
  const savedUniverse = legacyUniverse
    ? {
        id: String(legacyUniverse.id),
        answers: legacyUniverse.answers,
        universe: legacyUniverse.activationUniverse
          ? mergeGeneratedUniverse(legacyUniverse.activationUniverse, legacyUniverse.answers)
          : generateUniverse(legacyUniverse.answers),
      }
    : undefined;
  return (
    <App
      persistence={persistence}
      authenticated={isAuthenticated}
      onRequestAuth={() => navigateTo("/signup")}
      onSignOut={isAuthenticated ? () => signOut() : undefined}
      profile={profile ?? undefined}
      savedUniverse={savedUniverse}
      savedCreatorProfile={creatorProfile ?? undefined}
      savedAnswers={savedAnswers}
    />
  );
}
