import { useEffect, useRef, useState } from "react";

const ENABLED_KEY = "everything-content:sound-enabled";
const VOLUME_KEY = "everything-content:sound-volume";

export function useAmbientSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(() => localStorage.getItem(ENABLED_KEY) === "true");
  const [volume, setVolumeState] = useState(() => Number(localStorage.getItem(VOLUME_KEY) ?? 25));
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const audio = new Audio("/audio/ambient.mp3");
    audio.loop = true;
    audio.volume = volume / 100;
    audio.addEventListener("error", () => setAvailable(false));
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const toggle = async () => {
    if (!available || !audioRef.current) return;
    if (enabled) audioRef.current.pause();
    else {
      try { await audioRef.current.play(); } catch { setAvailable(false); return; }
    }
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(ENABLED_KEY, String(next));
  };
  const setVolume = (next: number) => {
    setVolumeState(next);
    if (audioRef.current) audioRef.current.volume = next / 100;
    localStorage.setItem(VOLUME_KEY, String(next));
  };
  const playEffect = (_name: "brain-open" | "answer-added" | "brain-ready") => { /* reserved for supplied effects */ };
  return { enabled, volume, available, toggle, setVolume, playEffect };
}
