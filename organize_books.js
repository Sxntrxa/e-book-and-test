const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const psychDir = path.join(publicDir, 'psychology-intro');

// 1. Create the category folder if it doesn't exist
if (!fs.existsSync(psychDir)) {
  fs.mkdirSync(psychDir, { recursive: true });
}

// 2. Move all PDFs from public/ to public/psychology-intro/
const files = fs.readdirSync(publicDir);
for (const file of files) {
  if (file.endsWith('.pdf')) {
    const oldPath = path.join(publicDir, file);
    const newPath = path.join(psychDir, file);
    fs.renameSync(oldPath, newPath);
  }
}

// 3. Scan all folders in public/ to generate src/data/books.ts
const generateBooksData = () => {
  const dirs = fs.readdirSync(publicDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('exam-'))
    .map(dirent => dirent.name);

  const categoryTitles = {
    'psychology-intro': 'PSY1002 จิตวิทยาเบื้องต้น',
    'RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม': 'RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม'
  };

  const categoryQuizUrls = {
    'psychology-intro': '/exam-psychology/index.html'
  };

  const categories = dirs.map(dirName => {
    const dirPath = path.join(publicDir, dirName);
    const pdfFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.pdf') && !f.includes('เอกสารประกอบการสอน'));

    // Natural sort the files (e.g. 1, 2, 10, 11)
    pdfFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

    const books = pdfFiles.map((file, idx) => {
      const title = file.replace(/\.pdf$/i, '');
      const coverColors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 'bg-orange-600', 'bg-teal-600', 'bg-indigo-600'];
      const color = coverColors[idx % coverColors.length];

      return {
        id: `${dirName}-ch${idx + 1}`,
        title: title,
        pdfUrl: `/${dirName}/${file}`,
        coverColor: color,
        categoryId: dirName
      };
    });

    return {
      id: dirName,
      title: categoryTitles[dirName] || dirName,
      quizUrl: categoryQuizUrls[dirName] || undefined,
      books: books
    };
  });

  const tsContent = `export interface Book {
  id: string;
  title: string;
  pdfUrl: string;
  coverColor: string;
  categoryId: string;
}

export interface Category {
  id: string;
  title: string;
  quizUrl?: string;
  books: Book[];
}

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export function getBookById(id: string): Book | undefined {
  for (const cat of categories) {
    const book = cat.books.find(b => b.id === id);
    if (book) return book;
  }
  return undefined;
}
`;

  fs.writeFileSync(path.join(__dirname, 'src/data/books.ts'), tsContent, 'utf8');
  console.log('Successfully generated books.ts');
};

generateBooksData();
