import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { ContentUniverse } from "../../lib/recommendation";
import type { WorkspacePath } from "../../routing/routes";
import { navigateTo } from "../../routing/routes";
import {
  BrainTrainingPage,
  ChatPage,
  InboxPage,
  SettingsPage,
  UniverseWorkspacePage,
} from "../../features/workspace/WorkspacePages";
import {
  useWorkspaceData,
  type WorkspaceData,
} from "../../features/workspace/useWorkspaceData";
import { CommandMenu } from "./CommandMenu";
import { MobileNav } from "./MobileNav";
import {
  WorkspaceHome,
  type BrainGeneration,
  type BrainTool,
} from "./WorkspaceHome";
import { WorkspaceSidebar } from "./WorkspaceSidebar";

const pageCopy: Record<WorkspacePath, [string, string]> = {
  "/app": ["Home", "What should move forward today?"],
  "/app/universe": [
    "Universe",
    "The connected map of what only you can create.",
  ],
  "/app/inbox": ["Inbox", "Capture first. Organise only when you are ready."],
  "/app/library": [
    "Library",
    "Every story, note, question and source in one place.",
  ],
  "/app/discover": ["Discover", "Research worth returning to."],
  "/app/create": [
    "Create",
    "Turn your knowledge into a useful piece of content.",
  ],
  "/app/train": [
    "Train your brain",
    "Add the context that makes your brain more specific.",
  ],
  "/app/calendar": ["Calendar", "Give each developing idea a place in time."],
  "/app/chat": ["AI Partner", "Ask questions across your own material."],
  "/app/analytics": [
    "Analytics",
    "Learning from performance arrives in a later release.",
  ],
  "/app/settings": [
    "Settings",
    "Control your voice, privacy, exports and account.",
  ],
};

export function WorkspaceShell({
  current,
  ownerKey = "guest",
  name,
  universe,
  universeId,
  onSignOut,
}: {
  current: WorkspacePath;
  ownerKey?: string;
  name?: string | null;
  universe?: ContentUniverse;
  universeId?: string;
  onSignOut?: () => void;
}) {
  const fallback = useWorkspaceData(ownerKey);
  const remote = useQuery(
    api.workspace.snapshot,
    ownerKey === "guest-preview" ? "skip" : {},
  );
  const captureRemote = useMutation(api.workspace.capture);
  const processRemote = useMutation(api.workspace.processCapture);
  const favouriteRemote = useMutation(api.workspace.toggleFavourite);
  const archiveRemote = useMutation(api.workspace.archiveLibraryItem);
  const saveDraftRemote = useMutation(api.workspace.saveDraft);
  const scheduleRemote = useMutation(api.workspace.scheduleDraft);
  const runBrainTool = useAction(api.contentBrainTools.run);
  const recentBrain = useQuery(
    api.contentBrainToolData.recent,
    ownerKey === "guest-preview" ? "skip" : {},
  );
  const remoteData: WorkspaceData | undefined = remote
    ? {
        captures: remote.captures
          .filter((item) => item.status !== "archived")
          .map((item) => ({
            ...item,
            id: String(item.id),
            status: item.status as "unprocessed" | "processed",
          })),
        library: remote.library.map((item) => ({
          ...item,
          id: String(item.id),
        })),
        drafts: remote.drafts.map((item) => ({
          ...item,
          id: String(item.id),
          sourceIds: item.sourceIds.map(String),
          scheduledFor: item.scheduledFor ?? undefined,
        })),
        messages: fallback.data.messages,
      }
    : undefined;
  const data = remoteData ?? fallback.data;
  const store = {
    data,
    addCapture: (
      type: Parameters<typeof fallback.addCapture>[0],
      text: string,
    ) => {
      if (remote) {
        void captureRemote({ type, text });
        return "pending";
      }
      return fallback.addCapture(type, text);
    },
    processCapture: (id: string) => {
      if (remote) void processRemote({ captureId: id as Id<"captures"> });
      else fallback.processCapture(id);
    },
    toggleFavourite: (id: string) => {
      if (remote) void favouriteRemote({ itemId: id as Id<"libraryItems"> });
      else fallback.toggleFavourite(id);
    },
    archiveItem: (id: string) => {
      if (remote) void archiveRemote({ itemId: id as Id<"libraryItems"> });
      else fallback.archiveItem(id);
    },
    saveDraft: (draft: Parameters<typeof fallback.saveDraft>[0]) => {
      if (!remote) return fallback.saveDraft(draft);
      const draftId = draft.id ?? `pending-${Date.now()}`;
      void saveDraftRemote({
        draftId: draft.id as Id<"drafts"> | undefined,
        title: draft.title ?? "Untitled draft",
        body: draft.body ?? "",
        format: draft.format ?? "LinkedIn post",
        platform: draft.platform ?? "LinkedIn",
        status: draft.status ?? "idea",
        sourceIds: (draft.sourceIds ?? []).map(
          (id) => id as Id<"libraryItems">,
        ),
      });
      return draftId;
    },
    scheduleDraft: (id: string, date: string) => {
      if (remote) void scheduleRemote({ draftId: id as Id<"drafts">, date });
      else fallback.scheduleDraft(id, date);
    },
    addChat: fallback.addChat,
    clear: fallback.clear,
    importDemo: fallback.importDemo,
  };
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [commands, setCommands] = useState(false);
  const [capture, setCapture] = useState(false);
  const [captureText, setCaptureText] = useState("");
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommands(true);
      }
      if (event.key === "Escape") {
        setCommands(false);
        setCapture(false);
        setMobileNav(false);
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);
  const openCapture = () => setCapture(true);
  const [title, copy] = pageCopy[current];
  const recent: BrainGeneration[] = (recentBrain ?? []).map((item) => ({
    ...item,
    id: String(item.id),
  }));
  const useBrain = async (
    tool: BrainTool,
    input: string,
  ): Promise<BrainGeneration> => {
    if (!universe)
      throw new Error(
        "Build your Content Universe first so your brain has context.",
      );
    const savedStories = data.library
      .filter((item) => item.type === "Story")
      .slice(0, 20)
      .map((item) => ({ title: item.title, story: item.body }));
    const generated = await runBrainTool({
      tool,
      input,
      universeJson: JSON.stringify({ universe, savedStories }),
    });
    return {
      ...generated,
      id: String(generated.id),
      tool,
      input,
      createdAt: Date.now(),
    };
  };
  let content: React.ReactNode;
  if (current === "/app")
    content = (
      <WorkspaceHome
        data={data}
        universe={universe}
        universeId={universeId}
        runTool={useBrain}
        recent={recent}
      />
    );
  else if (current === "/app/universe")
    content = (
      <UniverseWorkspacePage universe={universe} universeId={universeId} />
    );
  else if (current === "/app/train")
    content = <BrainTrainingPage universe={universe} data={data} />;
  else if (current === "/app/discover")
    content = (
      <section className="workspace-coming-soon">
        <span>COMING SOON</span>
        <h1>Discover</h1>
        <p>
          A focused place to save useful research and turn references into
          content is being built.
        </p>
        <button onClick={() => navigateTo("/app")}>BACK TO HOME →</button>
      </section>
    );
  else if (current === "/app/inbox")
    content = (
      <InboxPage
        data={data}
        onCapture={store.addCapture}
        onProcess={store.processCapture}
      />
    );
  else if (current === "/app/library")
    content = (
      <section className="workspace-coming-soon">
        <span>COMING SOON</span>
        <h1>Library</h1>
        <p>
          One searchable place for your saved ideas, stories, scripts, notes,
          and references is being prepared.
        </p>
        <button onClick={() => navigateTo("/app")}>BACK TO HOME →</button>
      </section>
    );
  else if (current === "/app/create")
    content = (
      <section className="workspace-coming-soon">
        <span>COMING SOON</span>
        <h1>Create</h1>
        <p>
          A focused writing space for turning saved context into finished
          content is being built.
        </p>
        <button onClick={() => navigateTo("/app")}>BACK TO HOME →</button>
      </section>
    );
  else if (current === "/app/calendar")
    content = (
      <section className="workspace-coming-soon">
        <span>COMING SOON</span>
        <h1>Calendar</h1>
        <p>
          Plan and schedule content when it is ready. This workspace is still
          being built.
        </p>
        <button onClick={() => navigateTo("/app")}>BACK TO HOME →</button>
      </section>
    );
  else if (current === "/app/chat")
    content = <ChatPage data={data} onAsk={store.addChat} />;
  else if (current === "/app/settings")
    content = (
      <SettingsPage
        data={data}
        onDemo={store.importDemo}
        onClear={store.clear}
        onSignOut={onSignOut}
      />
    );
  else
    content = (
      <section className="workspace-placeholder is-later">
        <span>LATER PHASE</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </section>
    );
  return (
    <main className="workspace">
      <WorkspaceSidebar
        current={current}
        collapsed={collapsed}
        mobileOpen={mobileNav}
        onMobileClose={() => setMobileNav(false)}
        onToggle={() => setCollapsed(!collapsed)}
      />
      {mobileNav ? (
        <button
          className="workspace-drawer-backdrop"
          onClick={() => setMobileNav(false)}
          aria-label="Close navigation"
        />
      ) : null}
      <section className="workspace-canvas">
        <header className="workspace-topbar">
          <button
            className="mobile-brand"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
          >
            <span>CONTENT BRAIN</span>
          </button>
          <label>
            <span>⌕</span>
            <input
              placeholder="Search your brain…"
              aria-label="Search workspace"
              onFocus={() => navigateTo("/app/library")}
            />
            <kbd>⌘ K</kbd>
          </label>
          <details className="workspace-user-menu">
            <summary className="profile-button" aria-label="Account menu">
              {name?.slice(0, 1).toUpperCase() || "S"}
            </summary>
            <nav aria-label="Account">
              <button onClick={() => navigateTo("/app/universe")}>
                Your Content Universe
              </button>
              <button onClick={() => navigateTo("/app/settings")}>
                Settings
              </button>
              <button onClick={() => navigateTo("/")}>Public website</button>
              {onSignOut ? <button onClick={onSignOut}>Sign out</button> : null}
            </nav>
          </details>
        </header>
        {content}
      </section>
      <MobileNav current={current} />
      <CommandMenu
        open={commands}
        onClose={() => setCommands(false)}
        onCapture={openCapture}
      />
      {capture ? (
        <div
          className="capture-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCapture(false);
          }}
        >
          <section
            className="quick-capture"
            role="dialog"
            aria-modal="true"
            aria-labelledby="capture-title"
          >
            <header>
              <span>QUICK CAPTURE</span>
              <button
                onClick={() => setCapture(false)}
                aria-label="Close capture"
              >
                ×
              </button>
            </header>
            <h2 id="capture-title">What do you want to remember?</h2>
            <textarea
              autoFocus
              value={captureText}
              onChange={(event) => setCaptureText(event.target.value)}
              placeholder="A thought, story, question, observation or link…"
            />
            <footer>
              <small>THE ORIGINAL IS SAVED EXACTLY AS YOU WROTE IT.</small>
              <button
                onClick={() => {
                  if (!captureText.trim()) return;
                  store.addCapture("Note", captureText);
                  setCaptureText("");
                  setCapture(false);
                  navigateTo("/app/inbox");
                }}
              >
                SAVE TO INBOX ↵
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </main>
  );
}
