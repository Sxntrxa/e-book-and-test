export interface Book {
  id: string;
  title: string;
  pdfUrl: string;
  coverColor: string;
  coverImageUrl?: string;
  categoryId: string;
}

export interface Category {
  id: string;
  title: string;
  quizUrl?: string;
  books: Book[];
}

export const categories: Category[] = [
  {
    "id": "psychology-intro",
    "title": "PSY1002 จิตวิทยาเบื้องต้น",
    "quizUrl": "/exam-psychology/index.html",
    "books": [
      {
        "id": "psychology-intro-ch1",
        "title": "บทที่ 1 ความรู้เบื้องต้นเกี่ยวกับจิตวิทยา",
        "pdfUrl": "/psychology-intro/บทที่ 1 ความรู้เบื้องต้นเกี่ยวกับจิตวิทยา.pdf",
        "coverColor": "bg-blue-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch2",
        "title": "บทที่ 2 ร่างกายและจิตใจ",
        "pdfUrl": "/psychology-intro/บทที่ 2 ร่างกายและจิตใจ.pdf",
        "coverColor": "bg-green-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch3",
        "title": "บทที่ 3 พัฒนาการมนุษย์",
        "pdfUrl": "/psychology-intro/บทที่ 3 พัฒนาการมนุษย์.pdf",
        "coverColor": "bg-purple-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch4",
        "title": "บทที่ 4 การรับสัมผัสและการรับรู้",
        "pdfUrl": "/psychology-intro/บทที่ 4 การรับสัมผัสและการรับรู้.pdf",
        "coverColor": "bg-red-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch5",
        "title": "บทที่ 5 การเรียนรู้",
        "pdfUrl": "/psychology-intro/บทที่ 5 การเรียนรู้.pdf",
        "coverColor": "bg-orange-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch6",
        "title": "บทที่ 6 การรู้คิดและสติปัญญา",
        "pdfUrl": "/psychology-intro/บทที่ 6 การรู้คิดและสติปัญญา.pdf",
        "coverColor": "bg-teal-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch7",
        "title": "บทที่ 7 แรงจูงใจและอารมณ์",
        "pdfUrl": "/psychology-intro/บทที่ 7 แรงจูงใจและอารมณ์.pdf",
        "coverColor": "bg-indigo-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch8",
        "title": "บทที่ 8 บุคลิกภาพและการวัด",
        "pdfUrl": "/psychology-intro/บทที่ 8 บุคลิกภาพและการวัด.pdf",
        "coverColor": "bg-blue-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch9",
        "title": "บทที่ 9 ความเครียดและสุขภาพ",
        "pdfUrl": "/psychology-intro/บทที่ 9 ความเครียดและสุขภาพ.pdf",
        "coverColor": "bg-green-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch10",
        "title": "บทที่ 10 ความผิดปกติทางจิตและการบำบัด",
        "pdfUrl": "/psychology-intro/บทที่ 10 ความผิดปกติทางจิตและการบำบัด.pdf",
        "coverColor": "bg-purple-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch11",
        "title": "บทที่ 11 พฤติกรรมทางสังคม",
        "pdfUrl": "/psychology-intro/บทที่ 11 พฤติกรรมทางสังคม.pdf",
        "coverColor": "bg-red-600",
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch12",
        "title": "บทที่ 12 จิตวิทยาประยุกต์",
        "pdfUrl": "/psychology-intro/บทที่ 12 จิตวิทยาประยุกต์.pdf",
        "coverColor": "bg-orange-600",
        "categoryId": "psychology-intro"
      }
    ]
  },
  {
    "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม",
    "title": "RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม",
    "books": [
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch1",
        "title": "บทที่ 1 ทฤษฎีการผลิต",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 1 ทฤษฎีการผลิต.pdf",
        "coverColor": "bg-blue-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch2",
        "title": "บทที่ 2 แนวทางการส่งเสริมากพัฒนานวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 2 แนวทางการส่งเสริมากพัฒนานวัตกรรม.pdf",
        "coverColor": "bg-green-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch3",
        "title": "บทที่ 3 ความรู้เบื้องค้นเกี่ยวกับความคิดสร้างสรรค์และนวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 3 ความรู้เบื้องค้นเกี่ยวกับความคิดสร้างสรรค์และนวัตกรรม.pdf",
        "coverColor": "bg-purple-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch4",
        "title": "บทที่ 4 ประเภทของนวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 4 ประเภทของนวัตกรรม.pdf",
        "coverColor": "bg-red-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch5",
        "title": "บทที่ 5 การเปลี่ยนแปลงทางเทคโนโลยี",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 5 การเปลี่ยนแปลงทางเทคโนโลยี.pdf",
        "coverColor": "bg-orange-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch6",
        "title": "บทที่ 6 แหล่งที่มาของนวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 6 แหล่งที่มาของนวัตกรรม.pdf",
        "coverColor": "bg-teal-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch7",
        "title": "บทที่ 7 นวัตกรรมและการเป็นผู้ประกอบการ",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 7 นวัตกรรมและการเป็นผู้ประกอบการ.pdf",
        "coverColor": "bg-indigo-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch8",
        "title": "บทที่ 8 กระบวนการพัฒนาผลิตภัณฑ์นวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 8 กระบวนการพัฒนาผลิตภัณฑ์นวัตกรรม.pdf",
        "coverColor": "bg-blue-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch9",
        "title": "บทที่ 9 วิวัฒนาการของเทคโนโลยี",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 9 วิวัฒนาการของเทคโนโลยี.pdf",
        "coverColor": "bg-green-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch10",
        "title": "บทที่ 10 เทคโนโลยีดิจิทัล",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 10 เทคโนโลยีดิจิทัล.pdf",
        "coverColor": "bg-purple-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch11",
        "title": "บทที่ 11 อุตสาหกรรมอัจฉริยะ",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 11 อุตสาหกรรมอัจฉริยะ.pdf",
        "coverColor": "bg-red-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch12",
        "title": "บทที่ 12 นวัตกรรมสีเขียว และ นวัตกรรมที่ยั่งยืน",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 12 นวัตกรรมสีเขียว และ นวัตกรรมที่ยั่งยืน.pdf",
        "coverColor": "bg-orange-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch13",
        "title": "บทที่ 13 ความรู้เกี่ยวกับทรัพย์สินทางปัญญา",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 13 ความรู้เกี่ยวกับทรัพย์สินทางปัญญา.pdf",
        "coverColor": "bg-teal-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch14",
        "title": "RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม.pdf",
        "coverColor": "bg-indigo-600",
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      }
    ]
  }
];

export function getBookById(id: string): Book | undefined {
  for (const cat of categories) {
    const book = cat.books.find(b => b.id === id);
    if (book) return book;
  }
  return undefined;
}
