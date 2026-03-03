import { createHash, randomBytes } from "crypto";

export interface Participante {
  id: string;
  username: string;
}

export interface ResultadoSorteio {
  ganhadores: Participante[];
  seed: string;
  hashSeed: string;
  hashResultado: string;
  totalParticipantes: number;
  timestamp: string;
}

/**
 * Gera um seed aleatório e seu hash SHA-256.
 * O hash é publicado ANTES do sorteio para provar que não houve manipulação.
 * Após o sorteio, o seed é revelado para que qualquer pessoa possa verificar.
 */
export function gerarHashSeed(): { seed: string; hash: string } {
  const seed = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(seed).digest("hex");
  return { seed, hash };
}

/**
 * Gera um número pseudo-aleatório determinístico baseado no seed.
 * Usa HMAC-SHA256 com um contador para gerar sequência determinística.
 */
function seededRandom(seed: string, counter: number): number {
  const hash = createHash("sha256")
    .update(`${seed}:${counter}`)
    .digest("hex");
  // Pegar os primeiros 8 bytes do hash e converter para número entre 0-1
  const num = parseInt(hash.substring(0, 8), 16);
  return num / 0xffffffff;
}

/**
 * Fisher-Yates shuffle determinístico usando seed.
 * Qualquer pessoa com o mesmo seed + lista produzirá o mesmo resultado.
 */
function shuffleDeterministico<T>(array: T[], seed: string): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const random = seededRandom(seed, i);
    const j = Math.floor(random * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Realiza o sorteio de forma provably fair.
 *
 * Como funciona:
 * 1. ANTES do sorteio: gerar seed + publicar hash (gerarHashSeed)
 * 2. Coletar comentários e criar lista de participantes
 * 3. Chamar realizarSorteio com o seed original
 * 4. DEPOIS: revelar o seed para verificação pública
 *
 * Qualquer pessoa pode:
 * - Verificar que SHA-256(seed) = hash publicado antes
 * - Rodar o mesmo algoritmo com seed + lista para confirmar os ganhadores
 */
export function realizarSorteio(
  participantes: Participante[],
  qtdGanhadores: number,
  seed: string
): ResultadoSorteio {
  if (participantes.length === 0) {
    throw new Error("Lista de participantes vazia");
  }

  if (qtdGanhadores > participantes.length) {
    qtdGanhadores = participantes.length;
  }

  const timestamp = new Date().toISOString();
  const hashSeed = createHash("sha256").update(seed).digest("hex");

  // Ordenar participantes por ID para garantir ordem determinística
  const ordenados = [...participantes].sort((a, b) => a.id.localeCompare(b.id));

  // Shuffle determinístico
  const embaralhados = shuffleDeterministico(ordenados, seed);

  // Selecionar ganhadores
  const ganhadores = embaralhados.slice(0, qtdGanhadores);

  // Hash do resultado completo para auditoria
  const resultadoStr = JSON.stringify({
    seed,
    timestamp,
    participantesIds: ordenados.map((p) => p.id),
    ganhadoresIds: ganhadores.map((g) => g.id),
  });
  const hashResultado = createHash("sha256").update(resultadoStr).digest("hex");

  return {
    ganhadores,
    seed,
    hashSeed,
    hashResultado,
    totalParticipantes: participantes.length,
    timestamp,
  };
}

/**
 * Verifica se um resultado de sorteio é válido.
 * Usado na página pública de verificação.
 */
export function verificarSorteio(
  participantes: Participante[],
  seed: string,
  hashPublicado: string,
  ganhadoresEsperados: string[]
): {
  seedValido: boolean;
  resultadoValido: boolean;
  ganhadoresCalculados: Participante[];
} {
  // 1. Verificar se o hash do seed bate
  const hashCalculado = createHash("sha256").update(seed).digest("hex");
  const seedValido = hashCalculado === hashPublicado;

  // 2. Recalcular o sorteio
  const resultado = realizarSorteio(
    participantes,
    ganhadoresEsperados.length,
    seed
  );

  // 3. Verificar se os ganhadores são os mesmos
  const ganhadoresCalculadosIds = resultado.ganhadores
    .map((g) => g.username)
    .sort();
  const ganhadoresEsperadosOrdenados = [...ganhadoresEsperados].sort();
  const resultadoValido =
    JSON.stringify(ganhadoresCalculadosIds) ===
    JSON.stringify(ganhadoresEsperadosOrdenados);

  return {
    seedValido,
    resultadoValido,
    ganhadoresCalculados: resultado.ganhadores,
  };
}

/**
 * Filtros de elegibilidade para participantes.
 */
export function filtrarParticipantes(
  comentarios: Array<{
    id: string;
    username: string;
    texto: string;
    tagCount: number;
    hasHashtag: boolean;
    fraudeScore?: number | null;
  }>,
  regras: {
    marcarAmigos?: number;
    hashtag?: string;
    textoObrigatorio?: string;
    maxFraudeScore?: number;
    removerDuplicados?: boolean;
  }
): Array<{ id: string; username: string; elegivel: boolean; motivo?: string }> {
  const vistos = new Set<string>();

  return comentarios.map((c) => {
    // Duplicados (mesmo username)
    if (regras.removerDuplicados !== false) {
      if (vistos.has(c.username.toLowerCase())) {
        return { id: c.id, username: c.username, elegivel: false, motivo: "Duplicado" };
      }
      vistos.add(c.username.toLowerCase());
    }

    // Marcou amigos suficientes
    if (regras.marcarAmigos && c.tagCount < regras.marcarAmigos) {
      return {
        id: c.id,
        username: c.username,
        elegivel: false,
        motivo: `Marcou ${c.tagCount}/${regras.marcarAmigos} amigos`,
      };
    }

    // Hashtag obrigatória
    if (regras.hashtag) {
      const hashtagLower = regras.hashtag.toLowerCase();
      if (!c.texto.toLowerCase().includes(hashtagLower)) {
        return {
          id: c.id,
          username: c.username,
          elegivel: false,
          motivo: `Faltou hashtag ${regras.hashtag}`,
        };
      }
    }

    // Texto obrigatório
    if (regras.textoObrigatorio) {
      if (!c.texto.toLowerCase().includes(regras.textoObrigatorio.toLowerCase())) {
        return {
          id: c.id,
          username: c.username,
          elegivel: false,
          motivo: "Texto obrigatório ausente",
        };
      }
    }

    // Score de fraude
    if (regras.maxFraudeScore && c.fraudeScore && c.fraudeScore > regras.maxFraudeScore) {
      return {
        id: c.id,
        username: c.username,
        elegivel: false,
        motivo: "Suspeita de fraude",
      };
    }

    return { id: c.id, username: c.username, elegivel: true };
  });
}
