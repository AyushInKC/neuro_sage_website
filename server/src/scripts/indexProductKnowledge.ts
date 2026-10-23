import { config } from '../config/index.js';
import { indexProductKnowledge } from '../services/productKnowledge.service.js';

console.log('NeuroSage Product Knowledge Indexer');
console.log(`Source: ${config.productKnowledgePath}`);
console.log(`Embedding model: ${config.ollamaEmbeddingModel}`);
console.log(`Ollama: ${config.ollamaBaseUrl}`);
console.log('');

indexProductKnowledge()
  .then(({ documents, chunks }) => {
    console.log(`Documents found: ${documents}`);
    console.log(`Chunks created: ${chunks}`);
    console.log(`Successfully indexed ${chunks} chunks.`);
  })
  .catch((error: unknown) => {
    console.error(
      'Product knowledge indexing failed. Make sure Ollama is running and embeddinggemma is installed.',
      error instanceof Error ? error.message : error
    );
    process.exitCode = 1;
  });
