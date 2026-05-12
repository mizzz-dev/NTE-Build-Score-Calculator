export type OcrRunResult = {
  lines: string[];
  engine: string;
};

export type OcrRunAdapter = {
  name: string;
  run: (file: File) => Promise<OcrRunResult>;
};

export type OcrProgressStatus = 'loading_engine' | 'processing';
export type OcrProgressCallback = (status: OcrProgressStatus) => void;

function parseLines(text: string): string[] {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

/**
 * 安全な初期stub。
 * 画像はブラウザ内でのみ読み込み、サーバー送信しない。
 * OCRエンジン未導入時は画像から直接抽出せず、エラーメッセージで手動入力へ誘導する。
 */
export const browserStubOcrAdapter: OcrRunAdapter = {
  name: 'browser-stub',
  async run(file) {
    // 画像をブラウザ内で読み込むのみ（永続化・送信なし）
    await file.arrayBuffer();
    throw new Error('OCRエンジンは未導入です。OCR生テキスト欄へ貼り付けて続行してください。');
  },
};

export function buildLinesFromManualRawText(rawText: string): string[] {
  return parseLines(rawText);
}

export function createBrowserTesseractAdapter(onProgress?: OcrProgressCallback): OcrRunAdapter {
  return {
    name: 'tesseract.js',
    async run(file) {
      onProgress?.('loading_engine');
      const { recognize } = await import('tesseract.js');
      onProgress?.('processing');
      const result = await recognize(file, 'eng+jpn');
      const lines = parseLines(result.data.text);
      if (lines.length === 0) {
        throw new Error('OCR結果が空でした。手動テキスト入力で補正してください。');
      }
      return { lines, engine: 'tesseract.js' };
    },
  };
}
