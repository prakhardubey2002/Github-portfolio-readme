export const BASE_FONT = "Inter";
export const DISPLAY_FONT = "Inter";

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  style: "normal";
  weight: 400;
};

const FONT_URLS = [
  () => {
    const host = process.env.VERCEL_URL;
    if (host) return `https://${host}/fonts/inter-latin-400-normal.woff`;
    return null;
  },
  () =>
    process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/fonts/inter-latin-400-normal.woff`
      : null,
  () =>
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.2.5/latin-400-normal.woff",
  () =>
    "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff",
];

async function loadInterBuffer(): Promise<ArrayBuffer> {
  for (const getUrl of FONT_URLS) {
    const url = getUrl();
    if (!url) continue;
    try {
      const res = await fetch(url, { cache: "force-cache" });
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

  return {
    fonts: [
      {
        name: BASE_FONT,
        data: interData,
        style: "normal",
        weight: 400,
      },
    ],
    displayFont: BASE_FONT,
  };
}
