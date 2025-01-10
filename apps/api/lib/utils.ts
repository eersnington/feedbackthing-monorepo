export function isSlugValid(slug: string) {
  // check if slug contains invalid characters
  // biome-ignore lint/performance/useTopLevelRegex: <explanation>
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(slug.toLowerCase())) {
    return false;
  }

  return true;
}

export function formatRootUrl(subdomain?: string, path?: string) {
  const protocol =
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'https' : 'http';

  return `${protocol}://${subdomain ? `${subdomain}.` : ''}${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${
    path ? path : ''
  }`;
}

/* eslint-disable */
/*biome-linter-disable*/
export const formatHtmlToMd = (htmlString: string): string => {
  const transformations = [
    // Bold text
    (str: string) => str.replace(/<strong>(.*?)<\/strong>/g, '**$1**'),

    // Italic text
    (str: string) => str.replace(/<em>(.*?)<\/em>/g, '*$1*'),

    // Links
    (str: string) => str.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)'),

    // Unordered lists
    (str: string) =>
      str.replace(/<ul>(.*?)<\/ul>/gs, (_, p1) =>
        p1.trim().replace(/<li>(.*?)<\/li>/g, '- $1')
      ),

    // Ordered lists
    (str: string) =>
      str.replace(/<ol>(.*?)<\/ol>/gs, (_, p1) =>
        p1
          .trim()
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          .replace(/<li>(.*?)<\/li>/g, (_: any, item: any) => `1. ${item}`)
      ),

    // Paragraphs
    (str: string) => str.replace(/<p>(.*?)<\/p>/gs, '$1  \n'),

    // Inline code
    (str: string) => str.replace(/<code>(.*?)<\/code>/g, '`$1`'),

    // Code blocks
    (str: string) =>
      str.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '```\n$1\n```'),

    // Line breaks
    (str: string) => str.replace(/<br\s*\/?>/g, '  \n'),
  ];

  return transformations.reduce(
    (text, transform) => transform(text),
    htmlString
  );
};
/* eslint-enable */

// Create api key token
export function generateApiToken(prefix: string, length: number): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    token += charset.charAt(randomIndex);
  }

  return `${prefix}_${token}`;
}

interface SWRError extends Error {
  status: number;
}

// Fetcher function for SWR
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const error = await res.text();
    const err = new Error(error) as SWRError;
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// Is valid email
export function isValidEmail(email: string): boolean {
  // biome-ignore lint/performance/useTopLevelRegex: <explanation>
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Hex to hsl
export function hexToHSL(H: string | null | undefined) {
  if (!H) {
    return;
  }

  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length === 4) {
    r = Number.parseInt(H[1] + H[1], 16);
    g = Number.parseInt(H[2] + H[2], 16);
    b = Number.parseInt(H[3] + H[3], 16);
  } else if (H.length === 7) {
    r = Number.parseInt(H[1] + H[2], 16);
    g = Number.parseInt(H[3] + H[4], 16);
    b = Number.parseInt(H[5] + H[6], 16);
  }

  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin;
  let h = 0,
    s = 0,
    l = 0;

  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  if (h < 0) {
    h += 360;
  }

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `${h} ${s}% ${l}%`;
}

// hsl to hex
export function hslToHex(hsl: string | null) {
  if (!hsl) {
    return;
  }

  const [hStr, sStr, lStr] = hsl.replaceAll('%', '').split(' ');

  const h: number = Number.parseFloat(hStr) / 360;
  const s: number = Number.parseFloat(sStr) / 100;
  const l: number = Number.parseFloat(lStr) / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = l;
    g = l;
    b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      const t1: number = t < 0 ? t + 1 : t;
      const t2: number = t1 > 1 ? t1 - 1 : t1;
      if (t2 < 1 / 6) {
        return p + (q - p) * 6 * t2;
      }
      if (t2 < 1 / 2) {
        return q;
      }
      if (t2 < 2 / 3) {
        return p + (q - p) * (2 / 3 - t2) * 6;
      }
      return p;
    };

    const q: number = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p: number = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number): string => {
    const hex: string = Math.round(x * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// is valid url
export function isValidUrl(url: string): boolean {
  if (
    // biome-ignore lint/performance/useTopLevelRegex: <explanation>
    !/https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b(?:[-a-zA-Z0-9()!@:%_+.~#?&//=]*)/i.test(
      url.toLowerCase()
    )
  ) {
    return false;
  }
  return true;
}
