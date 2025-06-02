export function chunkText(content: string, chunkSize = 700, overlap = 120): string[] {
  const normalized = content.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];
  let cursor = 0;
  while (cursor < normalized.length) {
    const end = Math.min(normalized.length, cursor + chunkSize);
    chunks.push(normalized.slice(cursor, end));
    cursor = end - overlap;
    if (cursor < 0) cursor = 0;
    if (end === normalized.length) break;
  }
  return chunks;
}
export function makeSubjectFromMessage(message: string) {
  return message.slice(0, 72).trim() || "New support ticket";
}
