import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { config } from '../config/index.js';

export const healthRouter = Router();

/**
 * GET /api/health
 *
 * Returns the live status of:
 *  - The backend process
 *  - MongoDB connection
 *  - Ollama service reachability
 *  - Configured Ollama model (verified via /api/tags, not a full inference)
 */
healthRouter.get('/api/health', async (_req: Request, res: Response) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  // Check Ollama availability — use a lightweight list-models call, not inference.
  let ollamaStatus: 'ready' | 'unavailable' | 'model_missing' = 'unavailable';
  let ollamaError: string | undefined;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4_000);

    let fetchRes: Awaited<ReturnType<typeof fetch>>;
    try {
      fetchRes = await fetch(`${config.ollamaBaseUrl}/api/tags`, {
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (fetchRes.ok) {
      const data = (await fetchRes.json()) as {
        models?: Array<{ name: string }>;
      };

      const modelNames: string[] = (data.models ?? []).map((m) => m.name);
      // Ollama model names can include a tag (e.g. "llama3.2:3b") or just the
      // base name ("llama3.2").  Accept either form.
      const configuredBase = config.ollamaModel.split(':')[0];
      const found = modelNames.some(
        (n) => n === config.ollamaModel || n.split(':')[0] === configuredBase
      );

      ollamaStatus = found ? 'ready' : 'model_missing';
      if (!found) {
        ollamaError = `Model "${config.ollamaModel}" not found. Run: ollama pull ${config.ollamaModel}`;
      }
    } else {
      ollamaError = `Ollama returned HTTP ${fetchRes.status}`;
    }
  } catch (err: any) {
    ollamaError = err?.name === 'AbortError' ? 'Ollama request timed out' : err?.message;
  }

  // Ollama is an optional companion provider; MongoDB is required for API readiness.
  const allOk = mongoStatus === 'connected';

  res.status(allOk ? 200 : 503).json({
    status: allOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    service: 'NeuroSage API',
    mongo: { status: mongoStatus },
    ollama: {
      status: ollamaStatus,
      baseUrl: config.ollamaBaseUrl,
      model: config.ollamaModel,
      ...(ollamaError ? { error: ollamaError } : {}),
    },
  });
});
