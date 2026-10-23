import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { config } from '../config/index.js';
import { AIService } from './ai.service.js';
import {
  buildProductKnowledgeContext,
  chunkMarkdown,
  clearProductKnowledgeCache,
  cosineSimilarity,
  discoverMarkdownFiles,
  generateEmbedding,
  retrieveProductKnowledge,
} from './productKnowledge.service.js';

describe('product knowledge RAG', () => {
  const originalIndexPath = config.productKnowledgeIndexPath;
  const originalTopK = config.productKnowledgeTopK;
  const originalMinSimilarity = config.productKnowledgeMinSimilarity;

  afterEach(() => {
    config.productKnowledgeIndexPath = originalIndexPath;
    config.productKnowledgeTopK = originalTopK;
    config.productKnowledgeMinSimilarity = originalMinSimilarity;
    clearProductKnowledgeCache();
    vi.unstubAllGlobals();
  });

  it('discovers markdown files recursively and chunks by headings and paragraphs', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'neurosage-rag-'));
    await fs.mkdir(path.join(root, 'nested'));
    await fs.writeFile(path.join(root, 'overview.md'), '# Overview\n\nIntro paragraph.');
    await fs.writeFile(path.join(root, 'nested', 'faq.md'), '# FAQ\n\n## Pricing\n\nThe fee is ₹49.');

    await expect(discoverMarkdownFiles(root)).resolves.toHaveLength(2);
    const chunks = chunkMarkdown('# Overview\n\nIntro paragraph.\n\n## Features\n\n- Focus\n- Reflection', 'overview.md');
    expect(chunks).toHaveLength(2);
    expect(chunks[1].section).toBe('Features');
    expect(chunks[1].text).toContain('Focus');
  });

  it('calculates cosine similarity and applies retrieval threshold and top-k', async () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBe(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);

    const indexPath = path.join(await fs.mkdtemp(path.join(os.tmpdir(), 'neurosage-rag-')), 'index.json');
    config.productKnowledgeIndexPath = indexPath;
    config.productKnowledgeTopK = 1;
    config.productKnowledgeMinSimilarity = 0.5;
    await fs.writeFile(indexPath, JSON.stringify({
      version: 1,
      embeddingModel: 'embeddinggemma',
      generatedAt: new Date().toISOString(),
      chunks: [
        { id: 'camp', source: 'faq.md', title: 'FAQ', section: 'Camp', text: 'Brainwell Camp costs ₹49.', embedding: [1, 0] },
        { id: 'other', source: 'faq.md', title: 'FAQ', section: 'Other', text: 'Unrelated content.', embedding: [0, 1] },
      ],
    }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ embedding: [1, 0] }), { status: 200 })
    ));

    const matches = await retrieveProductKnowledge('camp price');
    expect(matches).toHaveLength(1);
    expect(matches[0].chunk.id).toBe('camp');
  });

  it('generates embeddings through the local Ollama embeddings endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ embedding: [0.1, 0.2] }), { status: 200 })
    );
    vi.stubGlobal('fetch', fetchMock);
    await expect(generateEmbedding('NeuroSage')).resolves.toEqual([0.1, 0.2]);
    expect(fetchMock).toHaveBeenCalledWith(
      `${config.ollamaBaseUrl}/api/embeddings`,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('reports an unavailable Ollama embedding service', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('unavailable', { status: 503 })));
    await expect(generateEmbedding('NeuroSage')).rejects.toThrow('HTTP 503');
  });

  it('constructs source-attributed product context and handles an empty index', async () => {
    const indexPath = path.join(await fs.mkdtemp(path.join(os.tmpdir(), 'neurosage-rag-')), 'index.json');
    config.productKnowledgeIndexPath = indexPath;
    await fs.writeFile(indexPath, JSON.stringify({
      version: 1,
      embeddingModel: 'embeddinggemma',
      generatedAt: new Date().toISOString(),
      chunks: [],
    }));
    await expect(buildProductKnowledgeContext('What is NeuroSage?')).resolves.toBe('');
  });

  it('adds retrieved product context to the existing AI system prompt', async () => {
    const indexPath = path.join(await fs.mkdtemp(path.join(os.tmpdir(), 'neurosage-rag-')), 'index.json');
    config.productKnowledgeIndexPath = indexPath;
    config.productKnowledgeMinSimilarity = 0;
    await fs.writeFile(indexPath, JSON.stringify({
      version: 1,
      embeddingModel: 'embeddinggemma',
      generatedAt: new Date().toISOString(),
      chunks: [{ id: 'overview', source: '01-product-overview.md', title: 'Overview', section: 'Purpose', text: 'NeuroSage supports awareness and self-care.', embedding: [1, 0] }],
    }));
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ embedding: [1, 0] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: { content: 'Grounded answer.' } }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(AIService.generateResponse([], 'What is NeuroSage?')).resolves.toMatchObject({ reply: 'Grounded answer.' });
    const chatBody = JSON.parse(fetchMock.mock.calls[1][1].body as string);
    expect(chatBody.messages[0].content).toContain('<product_knowledge>');
    expect(chatBody.messages[0].content).toContain('01-product-overview.md');
  });
});
