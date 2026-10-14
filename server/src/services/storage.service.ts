import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config/index.js';

export interface ValidatedFileResult {
  storedFilename: string;
  originalName: string;
  mimeType: string;
  size: number;
  filePath: string;
}

export class StorageService {
  private static ensureUploadDir(): void {
    if (!fs.existsSync(config.uploadDir)) {
      fs.mkdirSync(config.uploadDir, { recursive: true });
    }
  }

  /**
   * Validates the file buffer magic numbers against known safe signatures.
   * Prevents disguised executable or malicious uploads.
   */
  public static validateFileSignature(buffer: Buffer): { isValid: boolean; detectedMime?: string } {
    if (buffer.length < 4) {
      return { isValid: false };
    }

    // PDF magic bytes: %PDF (0x25, 0x50, 0x44, 0x46)
    if (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    ) {
      return { isValid: true, detectedMime: 'application/pdf' };
    }

    // PNG magic bytes: 0x89, 0x50, 0x4E, 0x47
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return { isValid: true, detectedMime: 'image/png' };
    }

    // JPEG magic bytes: 0xFF, 0xD8, 0xFF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return { isValid: true, detectedMime: 'image/jpeg' };
    }

    return { isValid: false };
  }

  /**
   * Securely saves the uploaded file with a cryptographically randomized name.
   */
  public static async savePaymentSlip(
    fileBuffer: Buffer,
    originalName: string
  ): Promise<ValidatedFileResult> {
    this.ensureUploadDir();

    const signatureCheck = this.validateFileSignature(fileBuffer);
    if (!signatureCheck.isValid || !signatureCheck.detectedMime) {
      throw new Error(
        'Invalid file type. Only authentic PDF, JPG, and PNG files are allowed.'
      );
    }

    const extMap: Record<string, string> = {
      'application/pdf': '.pdf',
      'image/png': '.png',
      'image/jpeg': '.jpg',
    };

    const ext = extMap[signatureCheck.detectedMime] || '.bin';
    const randomKey = crypto.randomUUID();
    const storedFilename = `slip_${Date.now()}_${randomKey}${ext}`;
    const targetPath = path.join(config.uploadDir, storedFilename);

    await fs.promises.writeFile(targetPath, fileBuffer);

    return {
      storedFilename,
      originalName: path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, '_'),
      mimeType: signatureCheck.detectedMime,
      size: fileBuffer.length,
      filePath: targetPath,
    };
  }

  /**
   * Retrieves file path for authorized access.
   */
  public static getFilePath(storedFilename: string): string {
    const safeFilename = path.basename(storedFilename);
    const resolvedPath = path.join(config.uploadDir, safeFilename);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error('Requested file not found');
    }

    return resolvedPath;
  }
}
