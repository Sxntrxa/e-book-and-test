const fs = require('fs');
const pdfjsLib = require('pdfjs-dist');

async function checkPdf() {
  const data = new Uint8Array(fs.readFileSync('public/บทที่ 1 ความรู้เบื้องต้นเกี่ยวกับจิตวิทยา.pdf'));
  const doc = await pdfjsLib.getDocument(data).promise;
  console.log('Total pages:', doc.numPages);
  for (let i = 1; i <= Math.min(3, doc.numPages); i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    console.log(`Page ${i}: width = ${viewport.width}, height = ${viewport.height}, rotation = ${page.rotate}`);
  }
}
checkPdf().catch(console.error);
