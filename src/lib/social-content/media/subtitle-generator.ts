import type { ContentScene } from "@/lib/social-content/domain/types";

export function createSrt(scenes: ContentScene[]) {
  return `${scenes
    .map((scene, index) => [
      String(index + 1),
      `${formatSrtTime(scene.startSeconds ?? 0)} --> ${formatSrtTime(scene.endSeconds ?? scene.durationSeconds)}`,
      scene.scriptLine,
    ].join("\n"))
    .join("\n\n")}\n`;
}

export function createVtt(scenes: ContentScene[]) {
  return `WEBVTT\n\n${scenes
    .map((scene) => [
      `${formatVttTime(scene.startSeconds ?? 0)} --> ${formatVttTime(scene.endSeconds ?? scene.durationSeconds)}`,
      scene.scriptLine,
    ].join("\n"))
    .join("\n\n")}\n`;
}

function formatSrtTime(seconds: number) {
  return formatTime(seconds, ",");
}

function formatVttTime(seconds: number) {
  return formatTime(seconds, ".");
}

function formatTime(seconds: number, millisecondSeparator: string) {
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const milliseconds = Math.round((seconds - wholeSeconds) * 1000);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const remainingSeconds = wholeSeconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}${millisecondSeparator}${String(milliseconds).padStart(3, "0")}`;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}
