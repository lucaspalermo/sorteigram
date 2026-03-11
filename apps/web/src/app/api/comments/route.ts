import { NextResponse } from "next/server";

interface Comment {
  id: string;
  username: string;
  texto: string;
}

function extractShortcode(url: string): string | null {
  const match = url.match(
    /instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/
  );
  return match ? match[1] : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Mode 1: Paste mode - user pasted comments text
    if (body.pastedText) {
      const comments = parseComments(body.pastedText);
      return NextResponse.json({
        success: true,
        comments,
        total: comments.length,
        source: "paste",
      });
    }

    // Mode 2: URL mode - try to scrape from Instagram
    const { url } = body;
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

    // Try to fetch comments from embed page
    try {
      const comments = await fetchFromEmbed(shortcode);
      if (comments.length > 0) {
        return NextResponse.json({
          success: true,
          comments,
          total: comments.length,
          source: "api",
        });
      }
    } catch (e) {
      console.log("[comments] Embed scraping failed:", (e as Error).message);
    }

    // If scraping fails, return special response asking for paste
    return NextResponse.json({
      success: false,
      needsPaste: true,
      shortcode,
      error:
        "Não foi possível carregar automaticamente. Use a opção de colar comentários.",
    });
  } catch (error: any) {
    console.error("[comments] Error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar comentários" },
      { status: 500 }
    );
  }
}

function parseComments(text: string): Comment[] {
  const comments: Comment[] = [];
  const seen = new Set<string>();

  // Split by newlines
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let currentUsername = "";
  let currentText = "";
  let id = 0;

  for (const line of lines) {
    // Pattern 1: "@username comment text" or "username comment text"
    const atMatch = line.match(/^@?([a-zA-Z0-9._]+)\s+(.*)/);

    // Pattern 2: Just a username (next line is comment)
    const usernameOnly = line.match(/^@?([a-zA-Z0-9._]{2,30})$/);

    // Pattern 3: "username\ncomment" pattern (Instagram copy-paste format)
    // Instagram format: username\ntimestamp\ncomment text
    const isTimestamp =
      /^\d+\s*(sem|h|min|d|s|w|m)\b/i.test(line) ||
      /^\d+\s*(semana|hora|minuto|dia|segundo)/i.test(line) ||
      /^(Responder|Reply|Ver tradução|See translation|Curtir|Like)/i.test(line) ||
      /^\d+ (curtida|like|resposta|repl)/i.test(line);

    if (isTimestamp) {
      continue; // Skip timestamps and action text
    }

    if (atMatch) {
      // Save previous comment if exists
      if (currentUsername && currentText) {
        const key = currentUsername.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          comments.push({
            id: String(++id),
            username: currentUsername,
            texto: currentText,
          });
        }
      }
      currentUsername = atMatch[1];
      currentText = atMatch[2] || "";
    } else if (usernameOnly) {
      // Save previous
      if (currentUsername && currentText) {
        const key = currentUsername.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          comments.push({
            id: String(++id),
            username: currentUsername,
            texto: currentText,
          });
        }
      }
      currentUsername = usernameOnly[1];
      currentText = "";
    } else if (currentUsername && !currentText) {
      // This is probably the comment text for the current username
      currentText = line;
    } else if (currentUsername && currentText) {
      // Continuation of comment
      currentText += " " + line;
    }
  }

  // Don't forget the last comment
  if (currentUsername && currentText) {
    const key = currentUsername.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      comments.push({
        id: String(++id),
        username: currentUsername,
        texto: currentText,
      });
    }
  }

  return comments;
}

async function fetchFromEmbed(shortcode: string): Promise<Comment[]> {
  // Try the embed/captioned endpoint which sometimes includes comment previews
  const res = await fetch(
    `https://www.instagram.com/p/${shortcode}/embed/captioned/`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    }
  );

  if (!res.ok) throw new Error(`Embed returned ${res.status}`);

  const html = await res.text();
  const comments: Comment[] = [];
  let id = 0;

  // Look for username+comment pairs in the embed HTML
  // Pattern: class="...Username..." followed by comment text
  const pairs = html.matchAll(
    /class="[^"]*[Uu]sername[^"]*"[^>]*>([^<]+)<\/a>\s*(?:<[^>]*>)*\s*([^<]+)/g
  );

  for (const match of pairs) {
    const username = match[1].replace("@", "").trim();
    const text = match[2].trim();
    if (username && text && text.length > 1) {
      comments.push({
        id: String(++id),
        username,
        texto: text,
      });
    }
  }

  return comments;
}
