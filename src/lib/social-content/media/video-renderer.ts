import { spawn } from "node:child_process";
import { access } from "node:fs/promises";

import type { ContentScene } from "@/lib/social-content/domain/types";

export type VideoRenderResult = {
  ok: boolean;
  videoPath?: string;
  renderer: "ffmpeg" | "dry-run";
  warning?: string;
};

export async function renderVerticalVideo({
  sceneImagePaths,
  scenes,
  outputPath,
  ffmpegPath = process.env.FFMPEG_PATH ?? "ffmpeg",
}: {
  sceneImagePaths: string[];
  scenes: ContentScene[];
  outputPath: string;
  ffmpegPath?: string;
}): Promise<VideoRenderResult> {
  if (sceneImagePaths.length === 0 || scenes.length === 0) {
    return {
      ok: false,
      renderer: "dry-run",
      warning: "No scene images are available for video rendering.",
    };
  }

  const ffmpegAvailable = await isFfmpegAvailable(ffmpegPath);

  if (!ffmpegAvailable) {
    return {
      ok: false,
      renderer: "dry-run",
      warning: "FFmpeg is not available, so MP4 rendering was skipped.",
    };
  }

  const args = buildFfmpegArgs(sceneImagePaths, scenes, outputPath);
  const result = await runFfmpeg(ffmpegPath, args);

  if (result.ok) {
    return {
      ok: true,
      renderer: "ffmpeg",
      videoPath: outputPath,
    };
  }

  const fallbackResult = await runFfmpeg(ffmpegPath, buildFallbackFfmpegArgs(scenes, outputPath));

  if (fallbackResult.ok) {
    return {
      ok: true,
      renderer: "ffmpeg",
      videoPath: outputPath,
      warning: `FFmpeg could not decode scene SVG files, so a native scene MP4 was rendered instead: ${result.error}`,
    };
  }

  return {
    ok: false,
    renderer: "dry-run",
    warning: `FFmpeg rendering failed: ${fallbackResult.error ?? result.error}`,
  };
}

function buildFfmpegArgs(sceneImagePaths: string[], scenes: ContentScene[], outputPath: string) {
  const args = ["-y"];

  sceneImagePaths.forEach((scenePath) => {
    args.push("-i", scenePath);
  });

  const scaledInputs = sceneImagePaths.map((_, index) => buildPhotoSceneFilter(scenes[index], index, scenes.length));
  const concatInputs = sceneImagePaths.map((_, index) => `[v${index}]`).join("");
  const filterComplex = `${scaledInputs.join(";")};${concatInputs}concat=n=${sceneImagePaths.length}:v=1:a=0,format=yuv420p[v]`;

  args.push(
    "-filter_complex",
    filterComplex,
    "-map",
    "[v]",
    "-r",
    "30",
    "-movflags",
    "+faststart",
    outputPath
  );

  return args;
}

function buildPhotoSceneFilter(scene: ContentScene, index: number, sceneCount: number) {
  const fontFile = "C\\:/Windows/Fonts/arial.ttf";
  const palette = getScenePalette(index);
  const frameCount = Math.max(1, Math.round(scene.durationSeconds * 30));
  const motion = getSceneMotion(index);
  const titleLines = wrapTextForVideo(scene.scriptLine, index === 0 ? 18 : 23).slice(0, index === 0 ? 5 : 4);
  const textFilters = titleLines.map((line, lineIndex) => {
    const y = (index === 0 ? 1060 : 1135) + lineIndex * (index === 0 ? 86 : 76);

    return [
      `drawtext=fontfile='${fontFile}'`,
      `text='${escapeDrawtext(line)}'`,
      "fontcolor=white",
      `fontsize=${index === 0 ? 76 : 58}`,
      "line_spacing=10",
      "x=76",
      `y=${y}`,
    ].join(":");
  });
  const label = getSceneLabel(scene, index, sceneCount);
  const labelFilter = label
    ? [`drawtext=fontfile='${fontFile}':text='${escapeDrawtext(label)}':fontcolor=0xFFFFFF@0.78:fontsize=28:x=76:y=1010`]
    : [];

  return [
    `[${index}:v]scale=1350:2400:force_original_aspect_ratio=increase`,
    "crop=1350:2400",
    `zoompan=z='min(zoom+0.0014,1.13)':x='${motion.x}':y='${motion.y}':d=${frameCount}:s=1080x1920:fps=30`,
    "setsar=1",
    "format=rgba",
    "eq=contrast=1.07:saturation=1.12:brightness=-0.015",
    `fade=t=in:st=0:d=0.18:alpha=1`,
    `fade=t=out:st=${Math.max(0.4, scene.durationSeconds - 0.22)}:d=0.22:alpha=1`,
    "drawbox=x=0:y=0:w=1080:h=300:color=0x000000@0.28:t=fill",
    "drawbox=x=0:y=930:w=1080:h=990:color=0x000000@0.50:t=fill",
    `drawbox=x=0:y=930:w=1080:h=8:color=${palette.accent}@0.95:t=fill`,
    "drawbox=x=60:y=72:w=330:h=74:color=0x000000@0.44:t=fill",
    `drawtext=fontfile='${fontFile}':text='GoByBudget':fontcolor=white:fontsize=36:x=82:y=92`,
    ...labelFilter,
    ...textFilters,
    `drawtext=fontfile='${fontFile}':text='${escapeDrawtext(getBottomCaption(index, sceneCount))}':fontcolor=0xFFFFFF@0.72:fontsize=26:x=76:y=1605`,
    `drawbox=x=76:y=1682:w=${getProgressWidth(index, sceneCount)}:h=7:color=${palette.accent}@1:t=fill`,
    "drawbox=x=76:y=1689:w=928:h=2:color=0xFFFFFF@0.30:t=fill",
    `format=yuv420p[v${index}]`,
  ].join(",");
}

function getSceneLabel(scene: ContentScene, index: number, sceneCount: number) {
  if (index === 0) return "";
  if (index === sceneCount - 1) return "Teste ton budget";
  if (/\$\d|environ|budget/i.test(scene.scriptLine)) return "Budget estime";

  return "Option voyage";
}

function getBottomCaption(index: number, sceneCount: number) {
  if (index === sceneCount - 1) {
    return "GoByBudget.com - compare ton budget";
  }

  return "Estimations a verifier avant publication";
}

function getSceneMotion(index: number) {
  const motions = [
    { x: "iw/2-(iw/zoom/2)", y: "ih/2-(ih/zoom/2)" },
    { x: "(iw-iw/zoom)*on/(duration-1)", y: "ih/2-(ih/zoom/2)" },
    { x: "(iw-iw/zoom)*(1-on/(duration-1))", y: "ih/2-(ih/zoom/2)" },
    { x: "iw/2-(iw/zoom/2)", y: "(ih-ih/zoom)*on/(duration-1)" },
    { x: "iw/2-(iw/zoom/2)", y: "(ih-ih/zoom)*(1-on/(duration-1))" },
  ];

  return motions[index % motions.length];
}

function buildFallbackFfmpegArgs(scenes: ContentScene[], outputPath: string) {
  const args = ["-y"];

  scenes.forEach((scene) => {
    args.push(
      "-f",
      "lavfi",
      "-t",
      String(Math.max(1, scene.durationSeconds)),
      "-i",
      `color=c=0xF8FAFC:s=1080x1920:r=30`
    );
  });

  const renderedScenes = scenes.map((scene, index) => buildNativeSceneFilter(scene, index, scenes.length));
  const concatInputs = scenes.map((_, index) => `[scene${index}]`).join("");
  const filterComplex = `${renderedScenes.join(";")};${concatInputs}concat=n=${scenes.length}:v=1:a=0,format=yuv420p[v]`;

  args.push(
    "-filter_complex",
    filterComplex,
    "-map",
    "[v]",
    "-r",
    "30",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    outputPath
  );

  return args;
}

function buildNativeSceneFilter(scene: ContentScene, index: number, sceneCount: number) {
  const fontFile = "C\\:/Windows/Fonts/arial.ttf";
  const palette = getScenePalette(index);
  const titleLines = wrapTextForVideo(scene.scriptLine, 24).slice(0, 4);
  const textFilters = titleLines.map((line, lineIndex) => {
    const y = 555 + lineIndex * 84;

    return [
      `drawtext=fontfile='${fontFile}'`,
      `text='${escapeDrawtext(line)}'`,
      "fontcolor=0x0F172A",
      "fontsize=64",
      "line_spacing=12",
      "x=106",
      `y=${y}`,
    ].join(":");
  });
  const footer = `Scene ${index + 1}/${sceneCount}`;

  return [
    `[${index}:v]format=rgba`,
    "drawbox=x=0:y=0:w=1080:h=1920:color=0xF8FAFC@1:t=fill",
    `drawbox=x=0:y=0:w=1080:h=340:color=${palette.header}@1:t=fill`,
    `drawbox=x=0:y=340:w=1080:h=18:color=${palette.accent}@1:t=fill`,
    `drawbox=x=64:y=420:w=952:h=760:color=0xFFFFFF@1:t=fill`,
    "drawbox=x=64:y=1180:w=952:h=10:color=0xE2E8F0@1:t=fill",
    `drawbox=x=86:y=452:w=8:h=676:color=${palette.accent}@1:t=fill`,
    `drawbox=x=64:y=1250:w=952:h=260:color=0x0F172A@1:t=fill`,
    `drawbox=x=64:y=1510:w=952:h=8:color=${palette.accent}@1:t=fill`,
    `drawtext=fontfile='${fontFile}':text='GoByBudget':fontcolor=white:fontsize=46:x=80:y=118`,
    `drawtext=fontfile='${fontFile}':text='Budget voyage estime':fontcolor=0xFFFFFF@0.78:fontsize=34:x=80:y=196`,
    `drawtext=fontfile='${fontFile}':text='${escapeDrawtext(scene.id.toUpperCase())}':fontcolor=0x64748B:fontsize=28:x=106:y=478`,
    `drawtext=fontfile='${fontFile}':text='A verifier avant publication':fontcolor=0xFFFFFF@0.78:fontsize=34:x=106:y=1335`,
    `drawtext=fontfile='${fontFile}':text='Estimations GoByBudget, pas des garanties de prix.':fontcolor=0xFFFFFF@0.62:fontsize=28:x=106:y=1400`,
    ...textFilters,
    `drawtext=fontfile='${fontFile}':text='${escapeDrawtext(footer)}':fontcolor=0x64748B:fontsize=28:x=80:y=1640`,
    `drawbox=x=80:y=1694:w=${getProgressWidth(index, sceneCount)}:h=8:color=${palette.accent}@1:t=fill`,
    "drawbox=x=80:y=1702:w=920:h=2:color=0xCBD5E1@1:t=fill",
    `scale=1080:1920,setsar=1[scene${index}]`,
  ].join(",");
}

function getScenePalette(index: number) {
  const palettes = [
    { header: "0x0F172A", accent: "0x14B8A6" },
    { header: "0x172554", accent: "0xF97316" },
    { header: "0x111827", accent: "0x2563EB" },
    { header: "0x164E63", accent: "0xF59E0B" },
  ];

  return palettes[index % palettes.length];
}

function getProgressWidth(index: number, sceneCount: number) {
  return Math.max(80, Math.round(((index + 1) / sceneCount) * 920));
}

function wrapTextForVideo(text: string, maxCharacters: number) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const words = normalized.split(" ").filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxCharacters && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [text];
}

function escapeDrawtext(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/:/g, "\\:")
    .replace(/'/g, " ")
    .replace(/,/g, "\\,")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]");
}

async function isFfmpegAvailable(ffmpegPath: string) {
  if (ffmpegPath !== "ffmpeg") {
    try {
      await access(ffmpegPath);
      return true;
    } catch {
      return false;
    }
  }

  const result = await runFfmpeg(ffmpegPath, ["-version"]);
  return result.ok;
}

function runFfmpeg(ffmpegPath: string, args: string[]) {
  return new Promise<{ ok: boolean; error?: string }>((resolve) => {
    const child = spawn(ffmpegPath, args, {
      windowsHide: true,
      shell: false,
    });
    let stderr = "";

    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      resolve({ ok: false, error: error.message });
    });
    child.on("close", (code) => {
      resolve({
        ok: code === 0,
        error: code === 0 ? undefined : stderr.trim().slice(-1000) || `Exited with code ${code}.`,
      });
    });
  });
}
