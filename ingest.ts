import * as fs from 'node:fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import getCollection from './chroma-collection.js';

async function extractText(filePath: string): Promise<string> {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const pages = await Promise.all(
    Array.from({ length: doc.numPages }, (_, i) =>
      doc.getPage(i + 1).then(p => p.getTextContent()).then(tc =>
        tc.items.map((item: any) => ('str' in item ? item.str : '')).join(' ')
      )
    )
  );
  return pages.join('\n\n');
}

async function ingest(filePath: string) {
  const text = await extractText(filePath);

  const chunks = text
    .split(/\n{2,}/)
    .map(c => c.trim())
    .filter(c => c.length > 50);

  const collection = await getCollection('ragdocs');

  const BATCH_SIZE = 10;
  const START_FROM = 60; // resume from where it failed
  for (let i = START_FROM; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    await collection.add({
      ids: batch.map((_, j) => `chunk-${i + j}`),
      documents: batch,
    });
    console.log(`Ingested chunks ${i} - ${i + batch.length}`);
    await new Promise(r => setTimeout(r, 10000));
  }

  console.log(`Ingested ${chunks.length} chunks`);
}

ingest('./ragdocs/Gynaecology Bassaw & Fletcher.pdf');
