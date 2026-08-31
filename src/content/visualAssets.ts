export interface EditorialVisualAsset {
  src: string;
  mobileSrc?: string;
  alt: string;
  position?: string;
  mobilePosition?: string;
  preload?: boolean;
}

export const visualAssets = {
  heroBrain: {
    src: "/images/editorial/brain-hero-positive-v2.jpg",
    alt: "An anonymous person standing with an open, curious posture beneath a bright archive of notes, stories and references connected to their mind by coloured threads.",
    position: "center",
    mobilePosition: "center",
    preload: true,
  },
  universeBrain: {
    src: "/images/editorial/brain-universe.jpg",
    alt: "Four groups of personal memories, abilities, interests and expression moving toward a human mind.",
    position: "center",
  },
  universeResult: {
    src: "/images/editorial/brain-universe-result.webp",
    alt: "A human portrait surrounded by connected story, expertise and idea fragments.",
    position: "center",
  },
  discoverBrain: {
    src: "/images/editorial/brain-discover.jpg",
    alt: "A person using an oversized floating brain to filter a field of internet ideas.",
    position: "center",
  },
  libraryBrain: {
    src: "/images/editorial/brain-library.jpg",
    alt: "Notes, books, screenshots and saved posts entering an opened human head like an archive.",
    position: "center",
  },
  researchBrain: {
    src: "/images/editorial/brain-research.jpg",
    alt: "Many pieces of information entering a large brain and emerging as three clear ideas.",
    position: "center",
  },
  studyBrain: {
    src: "/images/editorial/brain-study.jpg",
    alt: "A person studying a video, post, document and transcript as they flow into an open book and brain, then emerge as clear structural insights and an original idea.",
    position: "center",
  },
  createBrain: {
    src: "/images/editorial/brain-create.jpg",
    alt: "One small thought entering a surreal brain and emerging as a hook, story, script and video.",
    position: "center",
  },
  humanLayerVisual: {
    src: "/images/editorial/right-people-help-you-move.png",
    alt: "A calm anonymous person surrounded by four collaborators sharing notes, reviewing a script and preparing a camera in a warm creative studio.",
    position: "center",
    mobilePosition: "center",
  },
  earlyAccessBrainVisual: {
    src: "/images/early-access-brain.jpg",
    alt: "A tiny anonymous person feeding paper memories into an enormous floating brain made from archived notes and images.",
    position: "center",
    mobilePosition: "64% center",
  },
  finalBrain: {
    src: "/images/editorial/brain-final.jpg",
    alt: "A tiny human standing beneath an impossibly large floating brain.",
    position: "center",
    mobilePosition: "55% center",
  },
} as const satisfies Record<string, EditorialVisualAsset>;

export type VisualAssetName = keyof typeof visualAssets;
