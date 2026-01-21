export interface ChunkedDoc {
  id: string;
  title: string;
  chunkIndex: number;
  text: string;
  sourceUri: string;
}

export interface ChunkOptions {
  chunkSizeTokens: number; // ~500 tokens
  overlapTokens?: number; // ~50 tokens
}

function approxTokenCount(text: string): number {
  // xấp xỉ: 1 token ~ 4 ký tự (English), tiếng Việt có thể khác nhưng đủ dùng
  return Math.ceil(text.length / 4);
}

function sliceByApproxTokens(text: string, maxTokens: number): string[] {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return [text];

  const out: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + maxChars);
    out.push(text.slice(i, end));
    i = end;
  }
  return out;
}

export function chunkText(
  doc: { id: string; title: string; text: string; sourceUri: string },
  opts: ChunkOptions
): ChunkedDoc[] {
  const cleaned = doc.text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  // Simple recursive-ish split: ưu tiên tách theo đoạn/câu rồi fallback cắt theo ký tự.
  const paragraphs = cleaned
    .split(/\n{2,}/g)
    .map((p) => p.trim())
    .filter(Boolean);

  const pieces: string[] = [];
  for (const p of paragraphs.length ? paragraphs : [cleaned]) {
    if (approxTokenCount(p) <= opts.chunkSizeTokens) {
      pieces.push(p);
      continue;
    }
    const sentences = p.split(/(?<=[.!?])\s+/g).filter(Boolean);
    let buf = "";
    for (const s of sentences) {
      const candidate = buf ? `${buf} ${s}` : s;
      if (approxTokenCount(candidate) <= opts.chunkSizeTokens) {
        buf = candidate;
      } else {
        if (buf) pieces.push(buf);
        if (approxTokenCount(s) <= opts.chunkSizeTokens) {
          buf = s;
        } else {
          pieces.push(...sliceByApproxTokens(s, opts.chunkSizeTokens));
          buf = "";
        }
      }
    }
    if (buf) pieces.push(buf);
  }

  return pieces.map((text, idx) => ({
    id: `${doc.id}#${idx}`,
    title: doc.title,
    chunkIndex: idx,
    text,
    sourceUri: doc.sourceUri
  }));
}

