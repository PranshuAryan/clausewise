import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set worker path to load correctly with Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function parseFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  
  try {
    if (extension === 'txt') {
      return await file.text();
    } else if (extension === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      return fullText;
    } else if (extension === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT.');
    }
  } catch (err) {
    console.error("Parse Error:", err);
    throw new Error('Failed to parse file: ' + err.message);
  }
}
