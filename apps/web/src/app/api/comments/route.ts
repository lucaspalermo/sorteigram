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

function looksLikeUsername(s: string): boolean {
  // Instagram usernames: 1-30 chars, letters, numbers, periods, underscores
  // Must contain at least one period, underscore, or number to distinguish from regular words
  // OR start with @ which is always a username
  if (s.startsWith("@")) return true;
  if (s.length > 30 || s.length < 2) return false;
  if (!/^[a-zA-Z0-9._]+$/.test(s)) return false;
  // Must have a special char (period, underscore, digit) to be a username
  // Pure alphabetic words like "Adorei" are not usernames
  return /[._\d]/.test(s);
}

function parseComments(text: string): Comment[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Detect format: Instagram copy-paste with "AgoraXX curtidasResponder" pattern
  const hasInstagramMeta = lines.some((l) =>
    /curtidas?Responder$/i.test(l) || /likes?Reply$/i.test(l)
  );

  if (hasInstagramMeta) {
    return parseInstagramCopyFormat(lines);
  }

  // Fallback: username + comment format
  return parseUsernameCommentFormat(lines);
}

function isMetaLine(line: string): boolean {
  return (
    // "Agora584 curtidasResponder" or "1h24 curtidasResponder" or "2 sem12 curtidasResponder"
    /\d+\s*curtidas?Responder$/i.test(line) ||
    /\d+\s*likes?Reply$/i.test(line) ||
    // Profile header info
    /^\d[\d.,]*\s*posts?$/i.test(line) ||
    /^\d[\d.,]*\s*(mi\s+)?seguidores$/i.test(line) ||
    /^\d[\d.,]*\s*seguindo$/i.test(line) ||
    // UI elements
    /^(Responder|Reply|Ver tradução|See translation|Curtir|Like)$/i.test(line) ||
    /^Editado/i.test(line) ||
    /^Adicione um comentário/i.test(line) ||
    /^Foto do perfil de/i.test(line) ||
    /^Seguido\(a\) por/i.test(line) ||
    /^Áudio original$/i.test(line) ||
    /^© \d{4}/i.test(line) ||
    /^Português \(Brasil\)$/i.test(line) ||
    /^(Meta|Sobre|Blog|Carreiras|Ajuda|API|Privacidade|Termos|Localizações|Instagram Lite|Meta AI|Threads|Meta Verified)$/i.test(line) ||
    /^Upload de contatos/i.test(line) ||
    /^(Site de entretenimento|Embaixador:)/i.test(line) ||
    /^\d+\+?$/i.test(line) ||
    /^(SAIBA MAIS|Leia a matéria)/i.test(line) ||
    /^\(Vídeo:/i.test(line) ||
    // Timestamps alone
    /^(Agora|Ontem|Hoje)$/i.test(line) ||
    /^\d+\s*(sem|h|min|d|s|w|m)$/i.test(line)
  );
}

function parseInstagramCopyFormat(lines: string[]): Comment[] {
  const comments: Comment[] = [];
  let id = 0;
  let currentLines: string[] = [];
  let foundFirstComment = false;

  // Find where comments start: the first "curtidasResponder" line marks end of first comment
  const firstMetaIdx = lines.findIndex((l) =>
    /\d+\s*curtidas?Responder$/i.test(l) || /\d+\s*likes?Reply$/i.test(l)
  );

  if (firstMetaIdx < 0) return [];

  // The post caption is the big block of text before the first comment.
  // We need to figure out where the caption ends and the first comment starts.
  // Strategy: the caption is usually a long multi-line text.
  // Comments are typically 1-3 lines before each "curtidasResponder" line.
  // We'll walk through and split by meta lines.

  // First, skip everything that looks like profile header (before the caption)
  let startIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isMetaLine(line)) continue;
    // Check if this could be profile name or username
    if (i < 10 && (looksLikeUsername(line) || /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(line))) continue;
    startIdx = i;
    break;
  }

  // Now find the caption: it's the text between header and first meta line
  // We'll skip the caption by starting from the first comment
  // The first comment is the text block right before the first "curtidasResponder"
  // But the caption text is ALSO before it.
  //
  // Better strategy: split ALL text by "curtidasResponder" markers.
  // First chunk = caption (skip it), rest = comments.

  let chunkCount = 0;
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    const isMeta = /\d+\s*curtidas?Responder$/i.test(line) || /\d+\s*likes?Reply$/i.test(line);

    if (isMeta) {
      chunkCount++;
      if (chunkCount === 1) {
        // First chunk is the caption - skip it
        currentLines = [];
        continue;
      }
      // This ends a comment
      if (currentLines.length > 0) {
        const texto = currentLines.join(" ").trim();
        if (texto.length > 0) {
          comments.push({
            id: String(++id),
            username: `participante_${id}`,
            texto,
          });
        }
        currentLines = [];
      }
      continue;
    }

    if (isMetaLine(line)) continue;

    // Skip lines that look like they are the post author username (appears right after caption)
    if (chunkCount < 1) continue;

    currentLines.push(line);
  }

  // Last comment if any
  if (currentLines.length > 0) {
    const texto = currentLines.join(" ").trim();
    if (texto.length > 1 && !/^Adicione um comentário/i.test(texto)) {
      comments.push({
        id: String(++id),
        username: `participante_${id}`,
        texto,
      });
    }
  }

  return comments;
}

function parseUsernameCommentFormat(lines: string[]): Comment[] {
  const comments: Comment[] = [];
  const seen = new Set<string>();
  let currentUsername = "";
  let currentText = "";
  let id = 0;

  for (const line of lines) {
    const isTimestamp =
      /^\d+\s*(sem|h|min|d|s|w|m)\b/i.test(line) ||
      /^\d+\s*(semana|hora|minuto|dia|segundo)/i.test(line) ||
      /^(Responder|Reply|Ver tradução|See translation|Curtir|Like)/i.test(line) ||
      /^\d+ (curtida|like|resposta|repl)/i.test(line) ||
      /^(Ver|See) \d+ (resposta|repl)/i.test(line) ||
      /^Editado/i.test(line);

    if (isTimestamp) continue;

    const atPrefixed = line.match(/^@([a-zA-Z0-9._]{2,30})\s+(.*)/);
    if (atPrefixed) {
      if (currentUsername && currentText) {
        const key = currentUsername.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          comments.push({ id: String(++id), username: currentUsername, texto: currentText });
        }
      }
      currentUsername = atPrefixed[1];
      currentText = atPrefixed[2] || "";
      continue;
    }

    const cleanLine = line.replace(/^@/, "");
    if ((looksLikeUsername(line) && line === cleanLine) || line.startsWith("@")) {
      const uname = cleanLine.match(/^([a-zA-Z0-9._]{2,30})$/);
      if (uname) {
        if (currentUsername && currentText) {
          const key = currentUsername.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            comments.push({ id: String(++id), username: currentUsername, texto: currentText });
          }
        }
        currentUsername = uname[1];
        currentText = "";
        continue;
      }
    }

    if (currentUsername && !currentText) {
      currentText = line;
    } else if (currentUsername && currentText) {
      currentText += " " + line;
    }
  }

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
