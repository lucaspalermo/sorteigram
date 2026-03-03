const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

export interface IGMedia {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export interface IGComment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  like_count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  paging?: {
    cursors?: { before?: string; after?: string };
    next?: string;
  };
}

export class InstagramClient {
  constructor(private accessToken: string) {}

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${GRAPH_API_BASE}${endpoint}`);
    url.searchParams.set("access_token", this.accessToken);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new InstagramAPIError(
        `Instagram API error: ${response.status}`,
        response.status,
        error
      );
    }
    return response.json() as Promise<T>;
  }

  /** Buscar posts do usuário */
  async getUserMedia(
    igUserId: string,
    cursor?: string,
    limit = 25
  ): Promise<PaginatedResponse<IGMedia>> {
    const params: Record<string, string> = {
      fields: "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count",
      limit: String(limit),
    };
    if (cursor) params.after = cursor;

    return this.request<PaginatedResponse<IGMedia>>(`/${igUserId}/media`, params);
  }

  /** Buscar comentários de um post */
  async getMediaComments(
    mediaId: string,
    cursor?: string,
    limit = 100
  ): Promise<PaginatedResponse<IGComment>> {
    const params: Record<string, string> = {
      fields: "id,text,username,timestamp,like_count",
      limit: String(limit),
    };
    if (cursor) params.after = cursor;

    return this.request<PaginatedResponse<IGComment>>(`/${mediaId}/comments`, params);
  }

  /** Buscar todas as páginas de comentários (cuidado com rate limit!) */
  async getAllComments(mediaId: string): Promise<IGComment[]> {
    const allComments: IGComment[] = [];
    let cursor: string | undefined;

    do {
      const result = await this.getMediaComments(mediaId, cursor);
      allComments.push(...result.data);
      cursor = result.paging?.cursors?.after;
    } while (cursor);

    return allComments;
  }

  /** Buscar info do perfil do usuário */
  async getUserProfile(igUserId: string) {
    return this.request<{
      id: string;
      username: string;
      name: string;
      profile_picture_url?: string;
      followers_count?: number;
      media_count?: number;
    }>(`/${igUserId}`, {
      fields: "id,username,name,profile_picture_url,followers_count,media_count",
    });
  }
}

export class InstagramAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public apiError: unknown
  ) {
    super(message);
    this.name = "InstagramAPIError";
  }
}
