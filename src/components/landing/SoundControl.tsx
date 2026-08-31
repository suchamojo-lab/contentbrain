import { useAmbientSound } from "../../hooks/useAmbientSound";

export function SoundControl() {
  const sound = useAmbientSound();
  return <div className="sound-control"><button type="button" onClick={sound.toggle} disabled={!sound.available} aria-pressed={sound.enabled}>{sound.available ? `SOUND ${sound.enabled ? "ON" : "OFF"}` : "NO AUDIO"}</button>{sound.available && sound.enabled ? <label><span className="sr-only">Ambient sound volume</span><input type="range" min="0" max="100" value={sound.volume} onChange={(event) => sound.setVolume(Number(event.target.value))} /><i>{sound.volume}%</i></label> : null}</div>;
}
