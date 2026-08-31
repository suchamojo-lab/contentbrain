import { useEffect, useMemo, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { ContentUniverse } from "../../lib/recommendation";
import { toShareableUniverse } from "../../lib/shareableUniverse";
import { track } from "../../lib/analytics";
import type { CreatorTypeResult } from "../../features/creatorType/creatorTypes";
import { StoryShareStudio } from "../share/StoryShareStudio";
import type { ShareTemplate } from "../share/storyCardData";
import { CreatorTypeExperience } from "../creatorType/CreatorTypeExperience";

type CreateInput = ReturnType<typeof toShareableUniverse> & {
  includeName: boolean;
  creatorType?: CreatorTypeResult;
};
type BrainAction = (input: string, tool?: "idea" | "ask") => void;

export function ContentBrainCardRail({
  universe,
  universeId,
  onCreate,
  compact = false,
}: {
  universe: ContentUniverse;
  universeId: string;
  onCreate: BrainAction;
  compact?: boolean;
}) {
  const id = universeId as Id<"contentUniverses">;
  const profile = useQuery(api.creatorTypeData.mine, { universeId: id });
  const yaps = useQuery(api.yapIdeaData.latest, { limit: 10 });
  const classify = useAction(api.creatorType.classify);
  const feedback = useMutation(api.creatorTypeData.feedback);
  const createShare = useMutation(api.universeShares.createOrUpdate);
  const [creator, setCreator] = useState<CreatorTypeResult | null>(null);
  const [finding, setFinding] = useState(false);
  const [share, setShare] = useState<ShareTemplate | "creator" | null>(null);
  const pack = useMemo(() => toShareableUniverse(universe), [universe]);
  useEffect(() => {
    if (profile?.creatorType)
      setCreator(profile.creatorType as CreatorTypeResult);
  }, [profile?.creatorType]);
  const topics = (yaps ?? []).map((item) => item.topic);
  const fallbackTopics = universe.ideaUniverse
    .flatMap((group) => group.ideas)
    .slice(0, 10);
  const yapTopics = topics.length ? topics : fallbackTopics;
  const insight = pack.insight;
  const findType = async () => {
    if (finding) return;
    setFinding(true);
    try {
      const result = await classify({ universeId: id });
      setCreator(result as CreatorTypeResult);
      track("creator_type_generated", {
        source: "workspace",
        creator_type: result.creatorType,
      });
    } finally {
      setFinding(false);
    }
  };
  const ensureCreator = () => {
    if (creator) {
      setShare("creator");
      track("workspace_creator_type_viewed", {
        creator_type: creator.creatorType,
      });
      return;
    }
    void findType();
  };
  const openShare = (template: ShareTemplate | "creator") => {
    setShare(template);
    if (template === "creator") track("workspace_creator_type_shared");
    if (template === "yaps") track("workspace_yap_shared");
  };
  const shareInput = async (input: CreateInput) =>
    await createShare({ universeId: id, ...input });
  const saveFeedback = async (
    kind: "brain_view" | "brain_insight",
    value: string,
  ) => {
    await feedback({ universeId: id, kind, value });
    if (kind === "brain_insight")
      track("workspace_brain_insight_feedback", { value });
  };
  const territory = pack.territory.slice(0, 3);
  const brainView = [
    universe.expression.profile,
    ...universe.radiance.topics.slice(0, 3),
    universe.territory.positioning,
  ];
  const cards = [
    {
      key: "creator",
      label: "CREATOR TYPE",
      title:
        creator?.creatorType ??
        "Your Brain hasn't worked out your creator type yet.",
      body:
        creator?.whyYouShouldCreate ??
        "Use your complete Content Universe to find the closest fixed creator type.",
      detail: creator
        ? `YOUR UNFAIR ADVANTAGE\n${creator.signatureStrength}`
        : "",
      primary: creator ? "USE THIS" : "FIND MY TYPE",
      action: creator
        ? () =>
            onCreate(
              `Give me five ideas that fit me as ${creator.creatorType}. Use this strength: ${creator.signatureStrength}.`,
              "idea",
            )
        : () => void findType(),
      share: creator ? () => openShare("creator") : undefined,
    },
    {
      key: "superpower",
      label: "SUPERPOWER",
      title: universe.gifts.superpower,
      body: "USE IT FOR",
      list: universe.gifts.naturalStrengths.slice(0, 3),
      primary: "FIND IDEAS FROM THIS",
      action: () => {
        track("workspace_superpower_opened");
        onCreate(
          `Find ideas that use my content superpower: ${universe.gifts.superpower}`,
          "idea",
        );
      },
      share: () => openShare("superpower"),
    },
    {
      key: "territory",
      label: "CONTENT TERRITORY",
      title: territory.join(" × "),
      body: "This is where your strongest ideas live.",
      primary: "FIND IDEAS HERE",
      action: () => {
        track("workspace_territory_opened");
        onCreate(
          `Find five ideas specifically inside this content territory: ${territory.join(" × ")}`,
          "idea",
        );
      },
      share: () => openShare("territory"),
    },
    {
      key: "yaps",
      label: "THINGS TO YAP ABOUT",
      title: yapTopics.length
        ? "Things you can talk about naturally."
        : "Your Brain needs something to yap about.",
      list: yapTopics.slice(0, 3),
      primary: yapTopics.length ? "SHOW ME 10" : "FIND MY TOPICS",
      action: () => {
        track("workspace_yap_opened");
        onCreate(
          "What should I yap about? Give me ten specific topics grounded in my Content Universe.",
          "ask",
        );
      },
      share: yapTopics.length ? () => openShare("yaps") : undefined,
    },
    {
      key: "insight",
      label: "BRAIN INSIGHT",
      title: "Your brain noticed…",
      body: insight,
      primary: "EXPLORE",
      action: () => {
        track("workspace_brain_insight_opened");
        onCreate(
          `Explore this pattern and turn it into content ideas: ${insight}`,
          "idea",
        );
      },
      share: () => openShare("insight"),
      feedback: (
        <div className="brain-card-feedback">
          <button onClick={() => void saveFeedback("brain_insight", "true")}>
            THAT'S TRUE
          </button>
          <button
            onClick={() => void saveFeedback("brain_insight", "not_really")}
          >
            NOT REALLY
          </button>
        </div>
      ),
    },
    {
      key: "view",
      label: "HOW YOUR BRAIN SEES YOU",
      title: universe.character.summary,
      body: `You naturally communicate through ${universe.expression.bestFormats.slice(0, 2).join(" + ")}.`,
      list: brainView.slice(1, 4),
      primary:
        profile?.brainViewFeedback === "confirmed"
          ? "THAT'S ME ✓"
          : "THAT'S ME",
      action: () => {
        track("workspace_brain_view_opened");
        void saveFeedback("brain_view", "confirmed");
      },
      share: () => openShare("identity"),
      feedback: (
        <button
          className="brain-card-edit"
          onClick={() => {
            void saveFeedback("brain_view", "needs_edit");
            onCreate("Help me correct how my Content Brain sees me.", "ask");
          }}
        >
          EDIT
        </button>
      ),
    },
  ];
  return (
    <section
      className={`content-brain-rail-section ${compact ? "is-compact" : ""}`}
    >
      <header>
        <div>
          <span>{compact ? "YOUR SHAREABLE BRAIN" : "YOUR CONTENT BRAIN"}</span>
          <h2>
            {compact
              ? "Create or share from what your brain knows."
              : "The parts of your Content Universe you can create and share from."}
          </h2>
        </div>
        {compact ? (
          <button
            onClick={() =>
              document
                .querySelector(".content-brain-card-rail")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            VIEW ALL CARDS →
          </button>
        ) : null}
      </header>
      <div
        className="content-brain-card-rail"
        role="region"
        aria-label="Your personalized Content Brain cards"
      >
        {cards.map((card, index) => (
          <article
            className={`content-brain-mini-card is-${card.key}`}
            key={card.key}
          >
            <header>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{card.label}</b>
            </header>
            <main>
              <h3>{card.title}</h3>
              {card.body ? <p>{card.body}</p> : null}
              {card.list?.length ? (
                <ol>
                  {card.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              ) : null}
              {card.detail ? <small>{card.detail}</small> : null}
            </main>
            {card.feedback}
            <footer>
              <button
                className="is-primary"
                disabled={finding && card.key === "creator"}
                onClick={card.action}
              >
                {finding && card.key === "creator" ? "FINDING…" : card.primary}{" "}
                →
              </button>
              {card.share ? <button onClick={card.share}>SHARE</button> : null}
            </footer>
          </article>
        ))}
      </div>
      {share ? (
        <div
          className="brain-share-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Share your Content Brain card"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShare(null);
          }}
        >
          <div>
            <header>
              <span>SHARE FROM YOUR CONTENT BRAIN</span>
              <button
                onClick={() => setShare(null)}
                aria-label="Close share preview"
              >
                ×
              </button>
            </header>
            {share === "creator" ? (
              <CreatorTypeExperience
                universe={universe}
                classify={async () =>
                  creator ??
                  ((await classify({ universeId: id })) as CreatorTypeResult)
                }
                onCreateShare={shareInput}
              />
            ) : (
              <StoryShareStudio
                universe={universe}
                yapTopics={yapTopics}
                initialTemplate={share}
                onCreateShare={shareInput}
                onYap={(topic) => {
                  setShare(null);
                  onCreate(topic, "ask");
                }}
              />
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
