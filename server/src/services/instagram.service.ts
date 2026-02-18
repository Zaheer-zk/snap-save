import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface DownloadLink {
  quality: string;
  url: string;
}

export interface Metadata {
  id?: string;
  title?: string;
  thumbnail: string;
  duration?: string;
  author?: string;
  downloads: DownloadLink[];
}

// ─── Custom Errors ────────────────────────────────────────────────────────────

export class InstagramExtractionError extends Error {
  public code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'InstagramExtractionError';
    this.code = code;
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
];

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;
const REQUEST_TIMEOUT_MS = 15000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Normalises an Instagram URL by stripping query params and ensuring a trailing slash.
 * Handles reel/p/tv URL types.
 */
function normalizeInstagramUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove all query params (like ?igsh=xxx)
    parsed.search = '';
    // Ensure trailing slash
    let pathname = parsed.pathname;
    if (!pathname.endsWith('/')) pathname += '/';
    parsed.pathname = pathname;
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Extracts the shortcode from an Instagram URL.
 * Supports /p/, /reel/, /tv/ formats.
 */
function extractShortcode(url: string): string | null {
  const match = url.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[2] : null;
}

// ─── Extraction Strategies ────────────────────────────────────────────────────

/**
 * Strategy 1: Fetch the Instagram page HTML and extract video URL from
 *             Open Graph <meta> tags and embedded JSON data.
 *             Works for public posts/reels.
 */
async function extractFromHTML(url: string): Promise<Metadata | null> {
  const normalizedUrl = normalizeInstagramUrl(url);
  const shortcode = extractShortcode(normalizedUrl);

  const headers: Record<string, string> = {
    'User-Agent': getRandomUserAgent(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };

  const response = await axios.get(normalizedUrl, {
    headers,
    timeout: REQUEST_TIMEOUT_MS,
    maxRedirects: 5,
  });

  const html = response.data as string;
  const $ = cheerio.load(html);

  // --- Extract from Open Graph meta tags ---
  const ogVideo = $('meta[property="og:video"]').attr('content')
    || $('meta[property="og:video:url"]').attr('content')
    || $('meta[property="og:video:secure_url"]').attr('content');

  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');

  // --- Try to extract from embedded JSON (script tags with type="application/ld+json") ---
  let jsonLdVideoUrl: string | null = null;
  let jsonLdThumbnail: string | null = null;
  let jsonLdAuthor: string | null = null;

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const jsonData = JSON.parse($(el).html() || '');
      if (jsonData.video && Array.isArray(jsonData.video)) {
        jsonLdVideoUrl = jsonData.video[0]?.contentUrl || jsonData.video[0]?.url || null;
        jsonLdThumbnail = jsonData.video[0]?.thumbnailUrl || null;
      }
      if (jsonData.contentUrl) {
        jsonLdVideoUrl = jsonData.contentUrl;
      }
      if (jsonData.thumbnailUrl) {
        jsonLdThumbnail = jsonData.thumbnailUrl;
      }
      if (jsonData.author?.name) {
        jsonLdAuthor = jsonData.author.name;
      }
    } catch {
      // ignore parse errors
    }
  });

  // --- Try to extract from embedded script data (window.__additionalData or similar) ---
  let embeddedVideoUrl: string | null = null;
  let embeddedThumbnail: string | null = null;

  $('script').each((_, el) => {
    const scriptContent = $(el).html() || '';

    // Look for video_url in any inline script
    const videoUrlMatch = scriptContent.match(/"video_url"\s*:\s*"([^"]+)"/);
    if (videoUrlMatch) {
      embeddedVideoUrl = videoUrlMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
    }

    // Look for display_url for thumbnail
    const displayUrlMatch = scriptContent.match(/"display_url"\s*:\s*"([^"]+)"/);
    if (displayUrlMatch && !embeddedThumbnail) {
      embeddedThumbnail = displayUrlMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
    }

    // Look for thumbnail_src
    const thumbSrcMatch = scriptContent.match(/"thumbnail_src"\s*:\s*"([^"]+)"/);
    if (thumbSrcMatch && !embeddedThumbnail) {
      embeddedThumbnail = thumbSrcMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
    }
  });

  // --- Determine the best video URL ---
  const videoUrl = ogVideo || jsonLdVideoUrl || embeddedVideoUrl;

  if (!videoUrl) {
    return null; // This strategy failed
  }

  const downloads: DownloadLink[] = [{ quality: 'Original', url: videoUrl }];

  // If we found an embedded URL too and it's different, add it as an alternative
  if (embeddedVideoUrl && embeddedVideoUrl !== videoUrl) {
    downloads.push({ quality: 'Alternative', url: embeddedVideoUrl });
  }

  const thumbnail = ogImage || jsonLdThumbnail || embeddedThumbnail || 'https://placehold.co/600x400?text=Instagram+Video';

  // Try to extract author from og:title (format: "Author on Instagram: ...")
  let author: string | undefined = jsonLdAuthor || undefined;
  if (!author && ogTitle) {
    const authorMatch = ogTitle.match(/^(.+?)\s+on\s+Instagram/i);
    if (authorMatch) author = authorMatch[1].trim();
  }

  // Try to extract a title from description
  let title = 'Instagram Video';
  if (ogDescription) {
    // Truncate long captions
    title = ogDescription.length > 100
      ? ogDescription.substring(0, 100) + '...'
      : ogDescription;
  }

  return {
    id: shortcode || undefined,
    title,
    thumbnail,
    author,
    downloads,
  };
}

/**
 * Strategy 2: Use Instagram's GraphQL endpoint with POST to fetch media data. 
 *             This mimics what the Instagram web app does internally.
 *             Note: doc_id changes periodically — this is a known limitation.
 */
async function extractFromGraphQL(url: string): Promise<Metadata | null> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return null;

  // These doc_ids change regularly. We try multiple known ones.
  const docIds = [
    '10015901848480474',  // PolarisPostActionLoadPostQueryQuery
    '17875800862117404',  // Older but sometimes still works
    '8845758582119845',   // Another known variant
  ];

  for (const docId of docIds) {
    try {
      const variables = JSON.stringify({
        shortcode,
        fetch_tagged_user_count: null,
        hoisted_comment_id: null,
        hoisted_reply_id: null,
      });

      const response = await axios.post(
        'https://www.instagram.com/graphql/query/',
        `variables=${encodeURIComponent(variables)}&doc_id=${docId}`,
        {
          headers: {
            'User-Agent': getRandomUserAgent(),
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-IG-App-ID': '936619743392459',
            'X-Requested-With': 'XMLHttpRequest',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Referer': `https://www.instagram.com/reel/${shortcode}/`,
            'Origin': 'https://www.instagram.com',
          },
          timeout: REQUEST_TIMEOUT_MS,
        }
      );

      const data = response.data;
      const media =
        data?.data?.xdt_shortcode_media ||
        data?.data?.shortcode_media ||
        null;

      if (!media) continue;

      const videoUrl = media.video_url;
      if (!videoUrl) continue;

      const downloads: DownloadLink[] = [{ quality: 'Original', url: videoUrl }];

      // Check for video_versions (multiple qualities)
      if (media.video_versions && Array.isArray(media.video_versions)) {
        media.video_versions.forEach((v: any, i: number) => {
          if (v.url && v.url !== videoUrl) {
            downloads.push({
              quality: `${v.width || '?'}x${v.height || '?'}`,
              url: v.url,
            });
          }
        });
      }

      return {
        id: shortcode,
        title: media.edge_media_to_caption?.edges?.[0]?.node?.text
          ? (media.edge_media_to_caption.edges[0].node.text.length > 100
            ? media.edge_media_to_caption.edges[0].node.text.substring(0, 100) + '...'
            : media.edge_media_to_caption.edges[0].node.text)
          : 'Instagram Video',
        thumbnail: media.display_url || media.thumbnail_src || 'https://placehold.co/600x400?text=Instagram+Video',
        author: media.owner?.username || undefined,
        downloads,
      };
    } catch {
      // This doc_id didn't work, try the next one
      continue;
    }
  }

  return null;
}

/**
 * Strategy 3: Use the Instagram embed endpoint.
 *             Instagram provides an embed page at /p/{shortcode}/embed/
 *             which sometimes contains the video URL.
 */
async function extractFromEmbed(url: string): Promise<Metadata | null> {
  const shortcode = extractShortcode(url);
  if (!shortcode) return null;

  const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/`;

  const response = await axios.get(embedUrl, {
    headers: {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.instagram.com/',
    },
    timeout: REQUEST_TIMEOUT_MS,
  });

  const html = response.data as string;

  // The embed page sometimes has the video URL in a script or in a video tag
  const $ = cheerio.load(html);

  // Check for <video> tag
  const videoSrc = $('video source').attr('src') || $('video').attr('src');

  // Check for video URL in embedded scripts
  let scriptVideoUrl: string | null = null;
  $('script').each((_, el) => {
    const content = $(el).html() || '';
    const match = content.match(/"video_url"\s*:\s*"([^"]+)"/);
    if (match) {
      scriptVideoUrl = match[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
    }
  });

  const finalVideoUrl = videoSrc || scriptVideoUrl;
  if (!finalVideoUrl) return null;

  // Try to get thumbnail from embed
  const thumbnail = $('img.EmbeddedMediaImage').attr('src')
    || $('meta[property="og:image"]').attr('content')
    || 'https://placehold.co/600x400?text=Instagram+Video';

  return {
    id: shortcode,
    title: 'Instagram Video',
    thumbnail,
    downloads: [{ quality: 'Original', url: finalVideoUrl }],
  };
}

// ─── Main Service ─────────────────────────────────────────────────────────────

export class InstagramService {
  /**
   * Fetches video metadata using a multi-strategy approach with retries.
   * Strategies are tried in order: HTML scraping → GraphQL → Embed page.
   * Each strategy is retried up to MAX_RETRIES times.
   */
  async fetchMetadata(url: string): Promise<Metadata> {
    // Validate URL
    if (!url || !url.includes('instagram.com')) {
      throw new InstagramExtractionError(
        'Invalid Instagram URL. Please provide a valid instagram.com link.',
        'INVALID_URL'
      );
    }

    const strategies = [
      { name: 'HTML Scraping', fn: extractFromHTML },
      { name: 'GraphQL API', fn: extractFromGraphQL },
      { name: 'Embed Page', fn: extractFromEmbed },
    ];

    const errors: string[] = [];

    for (const strategy of strategies) {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`[Instagram] Trying ${strategy.name} (attempt ${attempt}/${MAX_RETRIES}) for: ${url}`);

          const result = await strategy.fn(url);

          if (result && result.downloads.length > 0) {
            console.log(`[Instagram] ✅ Success with ${strategy.name} — found ${result.downloads.length} download(s)`);
            return result;
          }

          // Strategy returned null — no data found, try next strategy
          console.log(`[Instagram] ${strategy.name} returned no data.`);
          break; // No point retrying the same strategy if it returned null (not an error)

        } catch (error: any) {
          const statusCode = (error as AxiosError)?.response?.status;
          const errorMsg = `${strategy.name} attempt ${attempt}: ${error.message} (HTTP ${statusCode || 'N/A'})`;
          console.error(`[Instagram] ❌ ${errorMsg}`);
          errors.push(errorMsg);

          // If we get a 404, the post likely doesn't exist or is private — don't retry
          if (statusCode === 404) {
            console.log(`[Instagram] Post not found or is private.`);
            throw new InstagramExtractionError(
              'Post not found. It may have been deleted or is from a private account.',
              'NOT_FOUND'
            );
          }

          // If rate limited (429), wait longer before retrying
          if (statusCode === 429) {
            console.log(`[Instagram] Rate limited, waiting before retry...`);
            await sleep(RETRY_DELAY_MS * attempt * 2);
            continue;
          }

          // For 401/403, wait and retry once, then move to next strategy
          if (statusCode === 401 || statusCode === 403) {
            if (attempt < MAX_RETRIES) {
              await sleep(RETRY_DELAY_MS * attempt);
              continue;
            }
            break; // Move to next strategy
          }

          // For other errors, do a standard retry with delay
          if (attempt < MAX_RETRIES) {
            await sleep(RETRY_DELAY_MS * attempt);
          }
        }
      }
    }

    // All strategies exhausted
    console.error(`[Instagram] All strategies failed for URL: ${url}`);
    console.error(`[Instagram] Errors: ${errors.join(' | ')}`);

    throw new InstagramExtractionError(
      'Unable to extract video. Instagram may be blocking requests or the post may be private/unavailable. Please try again later.',
      'EXTRACTION_FAILED'
    );
  }
}

export const instagramService = new InstagramService();
