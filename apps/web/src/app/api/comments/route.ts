import { NextResponse } from "next/server";

interface Comment {
  id: string;
  username: string;
  texto: string;
  timestamp: string;
}

function extractShortcode(url: string): string | null {
  // Matches: /p/SHORTCODE/, /reel/SHORTCODE/, /tv/SHORTCODE/
  const match = url.match(
    /instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/
  );
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
    }

    const shortcode = extractShortcode(url);
    if (!shortcode) {
      return NextResponse.json(
        { error: "URL inválida. Use um link de post do Instagram (instagram.com/p/...)" },
        { status: 400 }
      );
    }

    const comments = await fetchComments(shortcode);

    return NextResponse.json({
      success: true,
      shortcode,
      comments,
      total: comments.length,
    });
  } catch (error: any) {
    console.error("[comments] Error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar comentários" },
      { status: 500 }
    );
  }
}

async function fetchComments(shortcode: string): Promise<Comment[]> {
  const allComments: Comment[] = [];

  // Approach 1: Instagram GraphQL (public, no auth needed)
  try {
    const comments = await fetchViaGraphQL(shortcode);
    if (comments.length > 0) return comments;
  } catch (e) {
    console.log("[comments] GraphQL approach failed:", (e as Error).message);
  }

  // Approach 2: Instagram embed page scraping
  try {
    const comments = await fetchViaEmbed(shortcode);
    if (comments.length > 0) return comments;
  } catch (e) {
    console.log("[comments] Embed approach failed:", (e as Error).message);
  }

  // Approach 3: Instagram __a=1 endpoint
  try {
    const comments = await fetchViaDirectAPI(shortcode);
    if (comments.length > 0) return comments;
  } catch (e) {
    console.log("[comments] Direct API approach failed:", (e as Error).message);
  }

  if (allComments.length === 0) {
    throw new Error(
      "Não foi possível carregar os comentários. O post pode ser privado ou o Instagram bloqueou a requisição. Tente novamente em alguns minutos."
    );
  }

  return allComments;
}

async function fetchViaGraphQL(shortcode: string): Promise<Comment[]> {
  // First, get the media ID from the shortcode
  const infoRes = await fetch(
    `https://www.instagram.com/api/v1/oembed/?url=https://www.instagram.com/p/${shortcode}/`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    }
  );

  if (!infoRes.ok) {
    throw new Error("oEmbed request failed");
  }

  const info = await infoRes.json();
  const mediaId = info.media_id;

  if (!mediaId) {
    throw new Error("Could not extract media_id from oEmbed");
  }

  // Use the GraphQL query hash for comments
  const queryHash = "bc3296d44b68399f14cab3b1d1a9326f";
  const variables = JSON.stringify({
    shortcode,
    first: 50,
  });

  const gqlRes = await fetch(
    `https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=${encodeURIComponent(variables)}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "*/*",
        "X-Requested-With": "XMLHttpRequest",
        Referer: `https://www.instagram.com/p/${shortcode}/`,
      },
    }
  );

  if (!gqlRes.ok) throw new Error("GraphQL request failed");

  const gqlData = await gqlRes.json();
  const edges =
    gqlData?.data?.shortcode_media?.edge_media_to_parent_comment?.edges || [];

  return edges.map((edge: any, i: number) => ({
    id: edge.node.id || String(i),
    username: edge.node.owner?.username || "unknown",
    texto: edge.node.text || "",
    timestamp: edge.node.created_at
      ? new Date(edge.node.created_at * 1000).toISOString()
      : new Date().toISOString(),
  }));
}

async function fetchViaEmbed(shortcode: string): Promise<Comment[]> {
  const res = await fetch(
    `https://www.instagram.com/p/${shortcode}/embed/captioned/`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    }
  );

  if (!res.ok) throw new Error("Embed request failed");

  const html = await res.text();

  // Extract comments from embed HTML
  const comments: Comment[] = [];

  // Pattern: data-testid="comment" with username and text
  const commentPattern =
    /<a[^>]*class="[^"]*CaptionUsername[^"]*"[^>]*>([^<]+)<\/a>\s*<span[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/span>/gi;

  let match;
  let id = 0;
  while ((match = commentPattern.exec(html)) !== null) {
    comments.push({
      id: String(++id),
      username: match[1].replace("@", "").trim(),
      texto: match[2].replace(/<[^>]+>/g, "").trim(),
      timestamp: new Date().toISOString(),
    });
  }

  // Also try extracting from JSON embedded in the page
  const jsonMatch = html.match(
    /window\.__additionalDataLoaded\('extra',\s*({.+?})\);/
  );
  if (jsonMatch) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      const edges =
        data?.shortcode_media?.edge_media_to_parent_comment?.edges || [];
      for (const edge of edges) {
        comments.push({
          id: edge.node.id || String(++id),
          username: edge.node.owner?.username || "unknown",
          texto: edge.node.text || "",
          timestamp: edge.node.created_at
            ? new Date(edge.node.created_at * 1000).toISOString()
            : new Date().toISOString(),
        });
      }
    } catch {}
  }

  return comments;
}

async function fetchViaDirectAPI(shortcode: string): Promise<Comment[]> {
  const res = await fetch(
    `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
        "X-IG-App-ID": "936619743392459",
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  );

  if (!res.ok) throw new Error("Direct API request failed");

  const data = await res.json();
  const edges =
    data?.graphql?.shortcode_media?.edge_media_to_parent_comment?.edges ||
    data?.items?.[0]?.comment_count
      ? []
      : [];

  // Try different data structures
  if (data?.items?.[0]?.comments) {
    return data.items[0].comments.map((c: any, i: number) => ({
      id: c.pk || String(i),
      username: c.user?.username || "unknown",
      texto: c.text || "",
      timestamp: c.created_at
        ? new Date(c.created_at * 1000).toISOString()
        : new Date().toISOString(),
    }));
  }

  return edges.map((edge: any, i: number) => ({
    id: edge.node?.id || String(i),
    username: edge.node?.owner?.username || "unknown",
    texto: edge.node?.text || "",
    timestamp: edge.node?.created_at
      ? new Date(edge.node.created_at * 1000).toISOString()
      : new Date().toISOString(),
  }));
}
