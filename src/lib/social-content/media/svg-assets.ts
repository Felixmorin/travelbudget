import type { ContentScene, GeneratedContent } from "@/lib/social-content/domain/types";

const width = 1080;
const height = 1920;
const palette = ["#0B1D34", "#14B8A6", "#F97316", "#2563EB", "#111827"];

export function createCoverSvg(content: GeneratedContent) {
  return createBaseSvg({
    title: content.topic?.title ?? content.hook ?? "GoByBudget",
    subtitle: "Estimated travel budget",
    footer: "GoByBudget",
    color: "#0B1D34",
  });
}

export function createSceneSvg(scene: ContentScene, index: number, content: GeneratedContent) {
  return createBaseSvg({
    title: scene.scriptLine,
    subtitle: content.topic?.title ?? "GoByBudget estimate",
    footer: `Scene ${index + 1}`,
    color: palette[index % palette.length],
  });
}

function createBaseSvg({
  title,
  subtitle,
  footer,
  color,
}: {
  title: string;
  subtitle: string;
  footer: string;
  color: string;
}) {
  const titleLines = wrapText(title, 24).slice(0, 6);
  const subtitleLines = wrapText(subtitle, 32).slice(0, 2);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#F7F9FB"/>
  <rect x="0" y="0" width="${width}" height="760" fill="${escapeXml(color)}"/>
  <rect x="72" y="112" width="936" height="1520" rx="42" fill="#FFFFFF"/>
  <text x="120" y="210" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700" fill="#14B8A6">GoByBudget</text>
  <text x="120" y="365" font-family="Arial, Helvetica, sans-serif" font-size="78" font-weight="800" fill="#0B1D34">
${titleLines.map((line, index) => `    <tspan x="120" dy="${index === 0 ? 0 : 94}">${escapeXml(line)}</tspan>`).join("\n")}
  </text>
  <text x="120" y="1110" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="600" fill="#475569">
${subtitleLines.map((line, index) => `    <tspan x="120" dy="${index === 0 ? 0 : 52}">${escapeXml(line)}</tspan>`).join("\n")}
  </text>
  <rect x="120" y="1420" width="840" height="4" fill="#E2E8F0"/>
  <text x="120" y="1510" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#0B1D34">${escapeXml(footer)}</text>
</svg>
`;
}

function wrapText(text: string, maxCharacters: number) {
  const words = text.split(/\s+/).filter(Boolean);
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

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
