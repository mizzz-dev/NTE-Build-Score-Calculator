import { buildLinesFromManualRawText, browserStubOcrAdapter } from './adapter';

describe('ocr adapter', () => {
  test('manual raw text to lines', () => {
    expect(buildLinesFromManualRawText(' atk 10%\n\ncrit 2.5% ')).toEqual(['atk 10%', 'crit 2.5%']);
  });

  test('stub adapter rejects without external api', async () => {
    const file = new File(['dummy'], 'dummy.png', { type: 'image/png' });
    await expect(browserStubOcrAdapter.run(file)).rejects.toThrow('OCRエンジンは未導入です');
  });
});
