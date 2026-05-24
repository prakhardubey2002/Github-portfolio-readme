import { readFile } from "fs/promises";
import { join } from "path";

export const BASE_FONT = "Inter";
export const DISPLAY_FONT = "Sans Forgetica";

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  style: "normal";
  weight: 400;
};

const LOCAL_INTER = join(
  process.cwd(),
  "public/fonts/inter-latin-400-normal.woff",
);

const FONT_CDN_FALLBACKS = [
  "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.5/latin-400-normal.woff",
  "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff",
];

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return new Uint8Array(buf).buffer;
}

async function loadInterBuffer(): Promise<ArrayBuffer> {
  try {
    const file = await readFile(LOCAL_INTER);
    if (file.byteLength > 0) return toArrayBuffer(file);
  } catch {
    // try CDN
  }

  for (const url of FONT_CDN_FALLBACKS) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.arrayBuffer();
        if (data.byteLength > 0) return data;
      }
    } catch {
      continue;
    }
  }

  throw new Error("Failed to load base font");
}

export async function loadEmbedFonts(): Promise<{
  fonts: OgFont[];
  displayFont: string;
}> {
  const interData = await loadInterBuffer();

  const fonts: OgFont[] = [
    {
      name: BASE_FONT,
      data: interData,
      style: "normal",
      weight: 400,
    },
  ];

  let displayFont = BASE_FONT;

  const displayUrls = [
    "https://fonts.gstatic.com/s/sansforgetica/v7/o-0IIpQlxQQLW4JMnmtVkkmutbpWgqK7bRQ.ttf",
  ];

  for (const url of displayUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.arrayBuffer();
        if (data.byteLength > 0) {
          fonts.push({
            name: DISPLAY_FONT,
            data,
            style: "normal",
            weight: 400,
          });
          displayFont = DISPLAY_FONT;
          break;
        }
      }
    } catch {
      continue;
    }
  }

  return { fonts, displayFont };
}
