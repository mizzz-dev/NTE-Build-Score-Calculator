import { buildLinesFromManualRawText, browserStubOcrAdapter, createBrowserTesseractAdapter } from './adapter';
import { describe, test, expect, vi } from 'vitest';

vi.mock('tesseract.js', () => ({
  recognize: vi.fn(async () => ({ data: { text: 'atk 10%\ncrit 2.5%' } })),
}));

describe('ocr adapter', () => {
  test('manual raw text to lines', () => {
    expect(buildLinesFromManualRawText(' atk 10%\n\ncrit 2.5% ')).toEqual(['atk 10%', 'crit 2.5%']);
  });

  test('stub adapter rejects without external api', async () => {
    const file = new File(['dummy'], 'dummy.png', { type: 'image/png' });
    await expect(browserStubOcrAdapter.run(file)).rejects.toThrow('OCRエンジンは未導入です');
  });

  test('tesseract adapter lazy-loads and parses lines', async () => {
    const statuses: string[] = [];
    const adapter = createBrowserTesseractAdapter((status) => statuses.push(status));
    const file = new File(['dummy'], 'dummy.png', { type: 'image/png' });
    await expect(adapter.run(file)).resolves.toEqual({ lines: ['atk 10%', 'crit 2.5%'], engine: 'tesseract.js' });
    expect(statuses).toEqual(['loading_engine', 'processing']);
  });
});
