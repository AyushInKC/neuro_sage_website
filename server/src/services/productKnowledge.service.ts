import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config/index.js';

export interface ProductKnowledgeChunk {
  id: string;
  source: string;
  title: string;
  section: string;
  text: string;
  embedding: number[];
}

export interface ProductKnowledgeIndex {
  version: 1;
  embeddingModel: string;
  generatedAt: string;
  chunks: ProductKnowledgeChunk[];
}

export interface ProductKnowledgeMatch {
  chunk: ProductKnowledgeChunk;
  similarity: number;
}

const EMBEDDING_TIMEOUT_MS = 30_000;
const MAX_CHUNK_LENGTH = 1800;
let cachedIndex: ProductKnowledgeIndex | null | undefined;

export async function discoverMarkdownFiles(rootPath: string): Promise<string[]> {
  const entries = await fs.readdir(rootPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const entryPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await discoverMarkdownFiles(entryPath)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(entryPath);
    }
  }

  return files;
}

function splitLongBlock(block: string): string[] {
  if (block.length <= MAX_CHUNK_LENGTH) return [block];
  const sentences = block.split(/(?<=[.!?])\s+/);
  const parts: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (current && current.length + sentence.length + 1 > MAX_CHUNK_LENGTH) {
      parts.push(current);
      current = '';
    }
    current = current ? `${current} ${sentence}` : sentence;
  }
  if (current) parts.push(current);
  return parts;
}

export function chunkMarkdown(markdown: string, source: string): Omit<ProductKnowledgeChunk, 'embedding'>[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const title = lines.find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, '').trim() || source;
  let section = title;
  let blockLines: string[] = [];
  let chunkNumber = 0;
  const chunks: Omit<ProductKnowledgeChunk, 'embedding'>[] = [];

  const flush = () => {
    const block = blockLines.join('\n').trim();
    blockLines = [];
    if (!block) return;

    for (const part of splitLongBlock(block)) {
      chunks.push({
        id: `${source}:${chunkNumber++}`,
        source,
        title,
        section,
        text: part,
      });
    }
  };

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flush();
      section = heading[2].trim();
      continue;
    }
    if (!line.trim()) {
      flush();
    } else {
      blockLines.push(line);
    }
  }
  flush();
  return chunks;
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length || left.length === 0) return 0;
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  if (leftMagnitude === 0 || rightMagnitude === 0) return 0;
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EMBEDDING_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${config.ollamaBaseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: config.ollamaEmbeddingModel, prompt: text }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) throw new Error(`Ollama embeddings returned HTTP ${response.status}`);
  const data = (await response.json()) as { embedding?: number[]; error?: string };
  if (data.error) throw new Error(`Ollama embeddings error: ${data.error}`);
  if (!Array.isArray(data.embedding) || data.embedding.length === 0) {
    throw new Error('Ollama returned an empty embedding');
  }
  return data.embedding;
}

export async function indexProductKnowledge(): Promise<{ documents: number; chunks: number }> {
  const files = await discoverMarkdownFiles(config.productKnowledgePath);
  const chunks: ProductKnowledgeChunk[] = [];

  for (const file of files) {
    const source = path.relative(config.productKnowledgePath, file);
    const markdown = await fs.readFile(file, 'utf8');
    const sourceChunks = chunkMarkdown(markdown, source);
    for (const chunk of sourceChunks) {
      chunks.push({ ...chunk, embedding: await generateEmbedding(chunk.text) });
    }
  }

  await fs.mkdir(path.dirname(config.productKnowledgeIndexPath), { recursive: true });
  const index: ProductKnowledgeIndex = {
    version: 1,
    embeddingModel: config.ollamaEmbeddingModel,
    generatedAt: new Date().toISOString(),
    chunks,
  };
  await fs.writeFile(config.productKnowledgeIndexPath, `${JSON.stringify(index)}\n`, 'utf8');
  cachedIndex = index;
  return { documents: files.length, chunks: chunks.length };
}

async function loadIndex(): Promise<ProductKnowledgeIndex | null> {
  if (cachedIndex !== undefined) return cachedIndex;
  try {
    const raw = await fs.readFile(config.productKnowledgeIndexPath, 'utf8');
    cachedIndex = JSON.parse(raw) as ProductKnowledgeIndex;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`[ProductKnowledge] Index not found at ${config.productKnowledgeIndexPath}. Run npm run index:product-knowledge.`);
      cachedIndex = null;
    } else {
      throw error;
    }
  }
  return cachedIndex;
}

export function clearProductKnowledgeCache(): void {
  cachedIndex = undefined;
}

export async function retrieveProductKnowledge(query: string): Promise<ProductKnowledgeMatch[]> {
  const index = await loadIndex();
  if (!index || index.chunks.length === 0) return [];

  const queryEmbedding = await generateEmbedding(query);
  return index.chunks
    .map((chunk) => ({ chunk, similarity: cosineSimilarity(queryEmbedding, chunk.embedding) }))
    .filter(({ similarity }) => similarity >= config.productKnowledgeMinSimilarity)
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, config.productKnowledgeTopK);
}

export async function buildProductKnowledgeContext(query: string): Promise<string> {
  const matches = await retrieveProductKnowledge(query);
  if (matches.length === 0) return '';
  const passages = matches
    .map(({ chunk }) => `Source: ${chunk.source}\nSection: ${chunk.section}\n${chunk.text}`)
    .join('\n\n');
  return `<product_knowledge>\n${passages}\n</product_knowledge>`;
}
