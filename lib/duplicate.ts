const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'of', 'to',
  'and', 'or', 'near', 'since', 'this', 'that', 'with', 'for', 'has', 'have',
])

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  )
}

/**
 * Jaccard similarity over word tokens, standing in for the SimHash /
 * MinHash near-duplicate text detection described in the full design.
 */
export function textSimilarity(a: string, b: string): number {
  const setA = tokenize(a)
  const setB = tokenize(b)
  if (setA.size === 0 || setB.size === 0) return 0
  let intersection = 0
  for (const w of setA) if (setB.has(w)) intersection++
  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}

export const DUPLICATE_SIMILARITY_THRESHOLD = 0.55
