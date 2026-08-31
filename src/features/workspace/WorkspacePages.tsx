import { useMemo, useState } from "react";
import type { ContentUniverse } from "../../lib/recommendation";
import { navigateTo } from "../../routing/routes";
import { ContentBrainCardRail } from "../../components/workspace/ContentBrainCardRail";
import type { CaptureType, Draft, WorkspaceData } from "./useWorkspaceData";

export function InboxPage({
  data,
  onCapture,
  onProcess,
}: {
  data: WorkspaceData;
  onCapture: (type: CaptureType, text: string) => void;
  onProcess: (id: string) => void;
}) {
  const [type, setType] = useState<CaptureType>("Note");
  const [text, setText] = useState("");
  const pending = data.captures.filter((item) => item.status === "unprocessed");
  return (
    <Page
      title="Inbox"
      eyebrow="CAPTURE WITHOUT ORGANISING"
      copy="Save the original thought first. You decide what it becomes."
    >
      <form
        className="inbox-capture"
        onSubmit={(event) => {
          event.preventDefault();
          if (!text.trim()) return;
          onCapture(type, text);
          setText("");
        }}
      >
        <select
          value={type}
          onChange={(event) => setType(event.target.value as CaptureType)}
          aria-label="Capture type"
        >
          {[
            "Note",
            "Story",
            "Question",
            "Link",
            "Observation",
            "Customer insight",
          ].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What do you want to remember?"
          aria-label="Capture text"
        />
        <footer>
          <small>SAVED EXACTLY AS WRITTEN</small>
          <button>SAVE TO INBOX ↵</button>
        </footer>
      </form>
      <section className="workspace-list">
        <header>
          <span>UNPROCESSED · {pending.length}</span>
        </header>
        {pending.length ? (
          pending.map((capture) => (
            <article key={capture.id}>
              <i>{capture.type}</i>
              <div>
                <strong>{capture.text}</strong>
                <small>
                  {new Date(capture.createdAt).toLocaleDateString()}
                </small>
              </div>
              <button onClick={() => onProcess(capture.id)}>
                REVIEW & ADD TO LIBRARY →
              </button>
            </article>
          ))
        ) : (
          <Empty
            title="Your inbox is clear."
            copy="Capture a thought, customer question or useful link when it appears."
          />
        )}
      </section>
    </Page>
  );
}

export function LibraryPage({
  data,
  onFavourite,
  onArchive,
}: {
  data: WorkspaceData;
  onFavourite: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [view, setView] = useState<"cards" | "list">("cards");
  const filters = [
    "All",
    "Note",
    "Story",
    "Question",
    "Link",
    "Observation",
    "Customer insight",
  ];
  const items = useMemo(
    () =>
      data.library.filter(
        (item) =>
          !item.archived &&
          (type === "All" || item.type === type) &&
          `${item.title} ${item.body} ${item.tags.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [data.library, query, type],
  );
  return (
    <Page
      title="Everything your brain knows"
      eyebrow="LIBRARY"
      copy="Everything in this workspace, searchable in one place."
    >
      <div className="library-search">
        <span>⌕</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search ideas, scripts, notes, links and references"
          aria-label="Search library"
        />
        <button onClick={() => setView(view === "cards" ? "list" : "cards")}>
          {view === "cards" ? "LIST" : "CARDS"}
        </button>
      </div>
      <div className="library-chips" aria-label="Filter library type">
        {filters.map((filter) => (
          <button
            aria-pressed={type === filter}
            className={type === filter ? "is-active" : ""}
            onClick={() => setType(filter)}
            key={filter}
          >
            {filter === "Customer insight"
              ? "Insights"
              : `${filter}${filter === "All" || filter.endsWith("s") ? "" : "s"}`}
          </button>
        ))}
      </div>
      {items.length ? (
        <section className={`library-grid is-${view}`}>
          {items.map((item, index) => (
            <article
              className={`is-${item.type.toLowerCase().replace(" ", "-")} is-variant-${index % 4}`}
              key={item.id}
            >
              <header>
                <span>{item.type.toUpperCase()}</span>
                <button
                  onClick={() => onFavourite(item.id)}
                  aria-label={`${item.favourite ? "Remove" : "Add"} favourite`}
                >
                  {item.favourite ? "★" : "☆"}
                </button>
              </header>
              {item.type === "Link" ? (
                <div className="library-link-mark">↗</div>
              ) : null}
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              <div>
                {item.tags.map((tag) => (
                  <small key={tag}>#{tag}</small>
                ))}
              </div>
              <footer>
                <button
                  onClick={() => navigateTo(`/app/create?source=${item.id}`)}
                >
                  CREATE FROM THIS →
                </button>
                <button onClick={() => onArchive(item.id)}>ARCHIVE</button>
              </footer>
            </article>
          ))}
        </section>
      ) : (
        <Empty
          title="Nothing matches that search."
          copy="Try a different word or process something from your Inbox."
        />
      )}
    </Page>
  );
}

export function CreatePage({
  data,
  draftId,
  onSave,
}: {
  data: WorkspaceData;
  draftId?: string;
  onSave: (draft: Partial<Draft> & { id?: string }) => string;
}) {
  const existing = data.drafts.find((draft) => draft.id === draftId);
  const sourceFromUrl = new URLSearchParams(location.search).get("source");
  const [id, setId] = useState(existing?.id);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [format, setFormat] = useState(existing?.format ?? "LinkedIn post");
  const [sourceIds, setSourceIds] = useState(
    existing?.sourceIds ?? (sourceFromUrl ? [sourceFromUrl] : []),
  );
  const [saved, setSaved] = useState("NOT SAVED");
  const save = () => {
    const next = onSave({
      id,
      title,
      body,
      format,
      platform: format.includes("X ") ? "X" : "LinkedIn",
      status: body ? "drafting" : "idea",
      sourceIds,
    });
    setId(next);
    setSaved("SAVED ✓");
    history.replaceState({}, "", `/app/create/${next}`);
  };
  const copy = async () => {
    await navigator.clipboard.writeText(body);
    setSaved("COPIED ✓");
  };
  return (
    <Page
      title="Create"
      eyebrow="SOURCE → ANGLE → DRAFT"
      copy="Build with your own material beside you."
    >
      <section className="creation-studio">
        <aside>
          <span>SOURCES</span>
          {data.library
            .filter((item) => !item.archived)
            .map((item) => (
              <label key={item.id}>
                <input
                  type="checkbox"
                  checked={sourceIds.includes(item.id)}
                  onChange={() =>
                    setSourceIds((current) =>
                      current.includes(item.id)
                        ? current.filter((id) => id !== item.id)
                        : [...current, item.id],
                    )
                  }
                />
                <b>{item.title}</b>
                <small>{item.type}</small>
              </label>
            ))}
          {!data.library.length ? (
            <p>Process an Inbox item to give this draft a source.</p>
          ) : null}
        </aside>
        <main>
          <header>
            <select
              value={format}
              onChange={(event) => setFormat(event.target.value)}
              aria-label="Content format"
            >
              {[
                "LinkedIn post",
                "X thread",
                "Newsletter",
                "Blog article",
                "YouTube script",
                "Short-video script",
                "Carousel outline",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <span>{saved}</span>
          </header>
          <input
            className="draft-title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setSaved("UNSAVED");
            }}
            placeholder="Name the central idea…"
            aria-label="Draft title"
          />
          <textarea
            className="draft-body"
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setSaved("UNSAVED");
            }}
            placeholder="Start with the moment, argument or useful lesson…"
            aria-label="Draft body"
          />
          <footer>
            <button onClick={copy} disabled={!body}>
              COPY
            </button>
            <button
              onClick={() => {
                const blob = new Blob([body], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${title || "draft"}.md`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              disabled={!body}
            >
              EXPORT .MD
            </button>
            <button onClick={save}>SAVE DRAFT ↵</button>
          </footer>
        </main>
        <aside className="draft-sources">
          <span>USED IN THIS DRAFT</span>
          {sourceIds.map((sourceId) => {
            const source = data.library.find((item) => item.id === sourceId);
            return source ? (
              <article key={sourceId}>
                <b>{source.type}</b>
                <p>{source.title}</p>
              </article>
            ) : null;
          })}
          <small>
            The system must cite these sources if it helps write this draft.
          </small>
        </aside>
      </section>
    </Page>
  );
}

export function CalendarPage({
  data,
  onSchedule,
}: {
  data: WorkspaceData;
  onSchedule: (id: string, date: string) => void;
}) {
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
  return (
    <Page
      title="Calendar"
      eyebrow="TWO-WEEK VIEW"
      copy="Give a draft a date. Direct publishing comes later."
    >
      <section className="calendar-board">
        {days.map((date) => (
          <article key={date}>
            <header>
              <span>
                {new Date(`${date}T12:00`).toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </span>
              <strong>{new Date(`${date}T12:00`).getDate()}</strong>
            </header>
            {data.drafts
              .filter((draft) => draft.scheduledFor === date)
              .map((draft) => (
                <button
                  key={draft.id}
                  onClick={() => navigateTo(`/app/create/${draft.id}`)}
                >
                  {draft.title}
                  <small>{draft.status}</small>
                </button>
              ))}
            <select
              value=""
              onChange={(event) =>
                event.target.value && onSchedule(event.target.value, date)
              }
              aria-label={`Schedule draft on ${date}`}
            >
              <option value="">+ Add</option>
              {data.drafts
                .filter((draft) => !draft.scheduledFor)
                .map((draft) => (
                  <option key={draft.id} value={draft.id}>
                    {draft.title}
                  </option>
                ))}
            </select>
          </article>
        ))}
      </section>
    </Page>
  );
}

export function ChatPage({
  data,
  onAsk,
}: {
  data: WorkspaceData;
  onAsk: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const starters = [
    "What should I create today?",
    "Find my underused subjects.",
    "Turn a note into five angles.",
  ];
  return (
    <Page
      title="AI Partner"
      eyebrow="GROUNDED IN YOUR MATERIAL"
      copy="It answers from what you saved and shows what it used."
    >
      <section className="brain-chat">
        <div className="chat-starters">
          {starters.map((starter) => (
            <button key={starter} onClick={() => onAsk(starter)}>
              {starter}
            </button>
          ))}
        </div>
        <main>
          {data.messages.length ? (
            data.messages.map((message) => (
              <article className={`is-${message.role}`} key={message.id}>
                <span>{message.role === "user" ? "YOU" : "AI PARTNER"}</span>
                <p>{message.content}</p>
                {message.sourceIds.length ? (
                  <footer>
                    USED:{" "}
                    {message.sourceIds.map((id) => (
                      <button key={id}>
                        {data.library.find((item) => item.id === id)?.title ??
                          "Saved source"}
                      </button>
                    ))}
                  </footer>
                ) : null}
              </article>
            ))
          ) : (
            <Empty
              title="Ask with context."
              copy="Your AI Partner will not invent experiences or proof."
            />
          )}
        </main>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!text.trim()) return;
            onAsk(text);
            setText("");
          }}
        >
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Ask your Content Brain…"
            aria-label="Message AI Partner"
          />
          <button>ASK ↵</button>
        </form>
      </section>
    </Page>
  );
}

export function UniverseWorkspacePage({
  universe,
  universeId,
}: {
  universe?: ContentUniverse;
  universeId?: string;
}) {
  const [confirmed, setConfirmed] = useState(false);
  if (!universe)
    return (
      <Page
        title="Your Content Universe"
        eyebrow="CONTENT UNIVERSE"
        copy="The patterns, stories, expertise and interests your Content Brain currently understands about you."
      >
        <Empty
          title="Your Universe is not connected yet."
          copy="Answer four questions to give your brain its first useful map."
        />
      </Page>
    );
  return (
    <Page
      title="Your Content Universe"
      eyebrow="CONTENT UNIVERSE"
      copy="The patterns, stories, expertise and interests your Content Brain currently understands about you."
    >
      {universeId ? (
        <ContentBrainCardRail
          universe={universe}
          universeId={universeId}
          compact
          onCreate={(seed) => {
            sessionStorage.setItem("suchamojo:content-brain-prefill", seed);
            navigateTo("/app");
          }}
        />
      ) : null}
      <section className="dark-universe">
        <div className="universe-pair">
          <article>
            <span>CORE CHARACTER</span>
            <h2>{universe.character.summary}</h2>
            <div className="universe-chips">
              {universe.character.identitySignals.map((item) => (
                <i key={item}>{item}</i>
              ))}
            </div>
            <small>BASED ON YOUR CHARACTER ANSWERS</small>
          </article>
          <article>
            <span>OWN GIFTS</span>
            <h3>What people naturally come to you for</h3>
            <ul>
              {universe.gifts.naturalStrengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <footer>
              <small>YOUR SUPERPOWER</small>
              <strong>{universe.gifts.superpower}</strong>
            </footer>
          </article>
        </div>
        <div className="universe-pair">
          <article>
            <span>RADIANCE</span>
            <h3>Things that give you energy</h3>
            <div className="universe-chips">
              {universe.radiance.topics.map((item) => (
                <i key={item}>{item}</i>
              ))}
            </div>
            {universe.radiance.interestingIntersections
              .slice(0, 2)
              .map((item) => (
                <blockquote key={item.title}>
                  <strong>{item.title}</strong>
                  {item.insight}
                </blockquote>
              ))}
          </article>
          <article>
            <span>EXPRESSION</span>
            <h3>How you naturally communicate</h3>
            <div className="universe-chips">
              {universe.expression.bestFormats.map((item) => (
                <i key={item}>{item}</i>
              ))}
            </div>
            <p>{universe.expression.profile}</p>
          </article>
        </div>
        <article className="workspace-positioning">
          <span>YOUR CONTENT TERRITORY</span>
          <h3>You could become known for...</h3>
          <blockquote>{universe.territory.positioning}</blockquote>
          <i>{universe.territory.archetype}</i>
          <button
            className={confirmed ? "is-confirmed" : ""}
            onClick={() => setConfirmed(true)}
          >
            {confirmed ? "THAT'S ME ✓" : "THAT'S ME"}
          </button>
        </article>
        <section className="workspace-pillars">
          <header>
            <span>CONTENT PILLARS</span>
            <h2>The themes strong enough to build on</h2>
          </header>
          <div>
            {universe.contentPillars.map((pillar, index) => (
              <article key={pillar.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.why}</p>
                <div className="universe-chips">
                  {pillar.topics.map((topic) => (
                    <i key={topic}>{topic}</i>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="workspace-story-bank">
          <header>
            <span>STORY BANK</span>
            <h2>Stories your brain found</h2>
          </header>
          {universe.storyBank.map((story, index) => (
            <article key={`${story.title}-${index}`}>
              <span>STORY {String(index + 1).padStart(2, "0")}</span>
              <h3>{story.title}</h3>
              <small>YOUR SOURCE</small>
              <p>“{story.source}”</p>
              <strong>{story.lesson}</strong>
              <button onClick={() => navigateTo("/app/create")}>
                CREATE FROM THIS →
              </button>
            </article>
          ))}
        </section>
        <section className="workspace-idea-universe">
          <header>
            <span>IDEA UNIVERSE</span>
            <h2>Directions you can take from here</h2>
          </header>
          {universe.ideaUniverse.map((group) => (
            <article key={group.pillar}>
              <h3>{group.pillar}</h3>
              {group.ideas.map((idea) => (
                <button key={idea} onClick={() => navigateTo("/app/create")}>
                  <span>{idea}</span>
                  <b>→</b>
                </button>
              ))}
            </article>
          ))}
        </section>
      </section>
    </Page>
  );
}

export function BrainTrainingPage({
  universe,
  data,
}: {
  universe?: ContentUniverse;
  data: WorkspaceData;
}) {
  const cards = [
    {
      title: "My Story",
      copy: "Give your brain the moments that shaped you.",
      status: universe ? "Strong" : "Learning",
      path: "/universe/story",
    },
    {
      title: "My Expertise",
      copy: "Show what you know unusually well.",
      status: universe ? "Learning" : "Needs context",
      path: "/universe/expertise",
    },
    {
      title: "My Point of View",
      copy: "Teach your brain what you believe.",
      status: "Needs context",
      path: "/universe/point-of-view",
    },
    {
      title: "My Audience",
      copy: "Name the people you want to matter to.",
      status: "Needs context",
      path: "/universe/audience",
    },
    {
      title: "My Proof",
      copy: "Separate what you have done from what you are exploring.",
      status: "Learning",
      path: "/universe/proof",
    },
    {
      title: "My Business",
      copy: "Tell your brain what content needs to support.",
      status: "Needs context",
      path: "/universe/future-self",
    },
    {
      title: "My References",
      copy: "Teach your brain what good looks like.",
      status: data.library.some((item) => item.type === "Link")
        ? "Learning"
        : "Empty",
      path: "/app/discover",
    },
    {
      title: "Previous Content",
      copy: "Add posts, scripts or transcripts in your own words.",
      status: data.library.length ? "Learning" : "Empty",
      path: "/app/inbox",
    },
  ];
  return (
    <Page
      title="Train your brain"
      eyebrow="TRAIN YOUR BRAIN"
      copy="The more useful context you add, the more specific your Content Brain becomes."
    >
      <section className="training-card-grid">
        {cards.map((card, index) => (
          <button onClick={() => navigateTo(card.path)} key={card.title}>
            <i>{String(index + 1).padStart(2, "0")}</i>
            <span>{card.status}</span>
            <h2>{card.title}</h2>
            <p>{card.copy}</p>
            <b>OPEN →</b>
          </button>
        ))}
      </section>
    </Page>
  );
}

export function DiscoverPage({
  data,
  onCapture,
}: {
  data: WorkspaceData;
  onCapture: () => void;
}) {
  const links = data.library.filter(
    (item) => !item.archived && item.type === "Link",
  );
  return (
    <Page
      title="Reading"
      eyebrow="DISCOVER"
      copy="Save something worth returning to. No feed, no noise—only references you chose."
    >
      <section className="reading-queue">
        <header>
          <span>YOUR READING QUEUE</span>
          <h2>Research your brain can return to.</h2>
          <button onClick={onCapture}>SAVE SOMETHING →</button>
        </header>
        {links.length ? (
          <div>
            {links.map((item) => (
              <article key={item.id}>
                <span>REFERENCE</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <button
                  onClick={() => navigateTo(`/app/create?source=${item.id}`)}
                >
                  CREATE FROM THIS →
                </button>
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="Your reading queue is empty."
            copy="Save a useful link with one sentence about why it matters."
          />
        )}
      </section>
    </Page>
  );
}

export function SettingsPage({
  data,
  onDemo,
  onClear,
  onSignOut,
}: {
  data: WorkspaceData;
  onDemo: () => void;
  onClear: () => void;
  onSignOut?: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const exportData = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          { version: 1, exportedAt: new Date().toISOString(), ...data },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "suchamojo-workspace-export.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Page
      title="Settings"
      eyebrow="PRIVACY AND CONTROL"
      copy="Export your workspace or remove local product data."
    >
      <section className="settings-sections">
        <article>
          <span>YOUR DATA</span>
          <h2>Export everything</h2>
          <p>
            Download captures, library items, drafts and conversations as JSON.
          </p>
          <button onClick={exportData}>EXPORT MY DATA ↓</button>
        </article>
        <article>
          <span>OPTIONAL DEMO</span>
          <h2>Explore with sample material</h2>
          <p>Demo content appears only when you choose it.</p>
          <button onClick={onDemo}>LOAD DEMO WORKSPACE</button>
        </article>
        <article className="is-danger">
          <span>LOCAL DATA</span>
          <h2>Clear this workspace</h2>
          <p>
            This removes workspace data saved in this browser. Account deletion
            isn’t available in the app yet.
          </p>
          {confirm ? (
            <div>
              <button onClick={() => setConfirm(false)}>CANCEL</button>
              <button
                onClick={() => {
                  onClear();
                  setConfirm(false);
                }}
              >
                YES, CLEAR LOCAL DATA
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirm(true)}>CLEAR LOCAL DATA…</button>
          )}
        </article>
        {onSignOut ? (
          <article>
            <span>ACCOUNT</span>
            <h2>Sign out</h2>
            <button onClick={onSignOut}>SIGN OUT</button>
          </article>
        ) : null}
      </section>
    </Page>
  );
}

function Page({
  title,
  eyebrow,
  copy,
  children,
}: {
  title: string;
  eyebrow: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <div className="workspace-product-page">
      <header>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
      </header>
      {children}
    </div>
  );
}
function Empty({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="workspace-empty">
      <i>○</i>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}
