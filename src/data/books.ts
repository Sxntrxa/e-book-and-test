export interface Book {
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

export const categories: Category[] = [
  {
    "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม",
    "title": "RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม",
    "quizUrl": undefined,
    "books": [
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch1",
        "title": "RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม.pdf",
        "coverColor": "bg-blue-600",
        "totalPages": 267,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch2",
        "title": "บทที่ 1 ทฤษฎีการผลิต",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 1 ทฤษฎีการผลิต.pdf",
        "coverColor": "bg-green-600",
        "totalPages": 32,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch3",
        "title": "บทที่ 2 แนวทางการส่งเสริมากพัฒนานวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 2 แนวทางการส่งเสริมากพัฒนานวัตกรรม.pdf",
        "coverColor": "bg-purple-600",
        "totalPages": 24,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch4",
        "title": "บทที่ 3 ความรู้เบื้องค้นเกี่ยวกับความคิดสร้างสรรค์และนวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 3 ความรู้เบื้องค้นเกี่ยวกับความคิดสร้างสรรค์และนวัตกรรม.pdf",
        "coverColor": "bg-red-600",
        "totalPages": 29,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch5",
        "title": "บทที่ 4 ประเภทของนวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 4 ประเภทของนวัตกรรม.pdf",
        "coverColor": "bg-orange-600",
        "totalPages": 14,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch6",
        "title": "บทที่ 5 การเปลี่ยนแปลงทางเทคโนโลยี",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 5 การเปลี่ยนแปลงทางเทคโนโลยี.pdf",
        "coverColor": "bg-teal-600",
        "totalPages": 16,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch7",
        "title": "บทที่ 6 แหล่งที่มาของนวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 6 แหล่งที่มาของนวัตกรรม.pdf",
        "coverColor": "bg-indigo-600",
        "totalPages": 25,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch8",
        "title": "บทที่ 7 นวัตกรรมและการเป็นผู้ประกอบการ",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 7 นวัตกรรมและการเป็นผู้ประกอบการ.pdf",
        "coverColor": "bg-blue-600",
        "totalPages": 26,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch9",
        "title": "บทที่ 8 กระบวนการพัฒนาผลิตภัณฑ์นวัตกรรม",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 8 กระบวนการพัฒนาผลิตภัณฑ์นวัตกรรม.pdf",
        "coverColor": "bg-green-600",
        "totalPages": 9,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch10",
        "title": "บทที่ 9 วิวัฒนาการของเทคโนโลยี",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 9 วิวัฒนาการของเทคโนโลยี.pdf",
        "coverColor": "bg-purple-600",
        "totalPages": 13,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch11",
        "title": "บทที่ 10 เทคโนโลยีดิจิทัล",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 10 เทคโนโลยีดิจิทัล.pdf",
        "coverColor": "bg-red-600",
        "totalPages": 9,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch12",
        "title": "บทที่ 11 อุตสาหกรรมอัจฉริยะ",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 11 อุตสาหกรรมอัจฉริยะ.pdf",
        "coverColor": "bg-orange-600",
        "totalPages": 8,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch13",
        "title": "บทที่ 12 นวัตกรรมสีเขียว และ นวัตกรรมที่ยั่งยืน",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 12 นวัตกรรมสีเขียว และ นวัตกรรมที่ยั่งยืน.pdf",
        "coverColor": "bg-teal-600",
        "totalPages": 27,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      },
      {
        "id": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม-ch14",
        "title": "บทที่ 13 ความรู้เกี่ยวกับทรัพย์สินทางปัญญา",
        "pdfUrl": "/RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม/บทที่ 13 ความรู้เกี่ยวกับทรัพย์สินทางปัญญา.pdf",
        "coverColor": "bg-indigo-600",
        "totalPages": 32,
        "categoryId": "RAM1201 RAM1201 ความคิดสร้างสรรค์เพื่อพัฒนานวัตกรรม"
      }
    ]
  },
  {
    "id": "Ram1203",
    "title": "RAM1203 ชื่อวิชา",
    "quizUrl": undefined,
    "books": [
      {
        "id": "Ram1203-ch1",
        "title": "01",
        "pdfUrl": "/Ram1203/01.pdf",
        "coverColor": "bg-blue-600",
        "totalPages": 25,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch2",
        "title": "02",
        "pdfUrl": "/Ram1203/02.pdf",
        "coverColor": "bg-green-600",
        "totalPages": 18,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch3",
        "title": "03",
        "pdfUrl": "/Ram1203/03.pdf",
        "coverColor": "bg-purple-600",
        "totalPages": 16,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch4",
        "title": "04 161267",
        "pdfUrl": "/Ram1203/04 161267.pdf",
        "coverColor": "bg-red-600",
        "totalPages": 41,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch5",
        "title": "05 161267",
        "pdfUrl": "/Ram1203/05 161267.pdf",
        "coverColor": "bg-orange-600",
        "totalPages": 36,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch6",
        "title": "06 161267 ผศ สิริลักษณ์",
        "pdfUrl": "/Ram1203/06 161267 ผศ สิริลักษณ์.pdf",
        "coverColor": "bg-teal-600",
        "totalPages": 33,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch7",
        "title": "07 161267 กฤษดา",
        "pdfUrl": "/Ram1203/07 161267 กฤษดา.pdf",
        "coverColor": "bg-indigo-600",
        "totalPages": 27,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch8",
        "title": "08 161267 วรานนท์",
        "pdfUrl": "/Ram1203/08 161267 วรานนท์.pdf",
        "coverColor": "bg-blue-600",
        "totalPages": 50,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch9",
        "title": "09 161267 พนารัตน์",
        "pdfUrl": "/Ram1203/09 161267 พนารัตน์.pdf",
        "coverColor": "bg-green-600",
        "totalPages": 62,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch10",
        "title": "10 161267 พนารัตน์",
        "pdfUrl": "/Ram1203/10 161267 พนารัตน์.pdf",
        "coverColor": "bg-purple-600",
        "totalPages": 22,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch11",
        "title": "11 161267",
        "pdfUrl": "/Ram1203/11 161267.pdf",
        "coverColor": "bg-red-600",
        "totalPages": 14,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch12",
        "title": "12 161267",
        "pdfUrl": "/Ram1203/12 161267.pdf",
        "coverColor": "bg-orange-600",
        "totalPages": 30,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch13",
        "title": "13 The_Innovation_Blueprint",
        "pdfUrl": "/Ram1203/13 The_Innovation_Blueprint.pdf",
        "coverColor": "bg-teal-600",
        "totalPages": 26,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch14",
        "title": "สไลด์ใหม่ RAM1203 บทที่ 1",
        "pdfUrl": "/Ram1203/สไลด์ใหม่ RAM1203 บทที่ 1.pdf",
        "coverColor": "bg-indigo-600",
        "totalPages": 18,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch15",
        "title": "สไลด์ใหม่ RAM1203 บทที่ 2",
        "pdfUrl": "/Ram1203/สไลด์ใหม่ RAM1203 บทที่ 2.pdf",
        "coverColor": "bg-blue-600",
        "totalPages": 18,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch16",
        "title": "สไลด์ใหม่ RAM1203 บทที่ 3",
        "pdfUrl": "/Ram1203/สไลด์ใหม่ RAM1203 บทที่ 3.pdf",
        "coverColor": "bg-green-600",
        "totalPages": 23,
        "categoryId": "Ram1203"
      },
      {
        "id": "Ram1203-ch17",
        "title": "สไลด์ใหม่ RAM1203 บทที่ 4",
        "pdfUrl": "/Ram1203/สไลด์ใหม่ RAM1203 บทที่ 4.pdf",
        "coverColor": "bg-purple-600",
        "totalPages": 15,
        "categoryId": "Ram1203"
      }
    ]
  },
  {
    "id": "covers",
    "title": "covers",
    "quizUrl": undefined,
    "books": []
  },
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
        "totalPages": 32,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch2",
        "title": "บทที่ 2 ร่างกายและจิตใจ",
        "pdfUrl": "/psychology-intro/บทที่ 2 ร่างกายและจิตใจ.pdf",
        "coverColor": "bg-green-600",
        "totalPages": 39,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch3",
        "title": "บทที่ 3 พัฒนาการมนุษย์",
        "pdfUrl": "/psychology-intro/บทที่ 3 พัฒนาการมนุษย์.pdf",
        "coverColor": "bg-purple-600",
        "totalPages": 33,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch4",
        "title": "บทที่ 4 การรับสัมผัสและการรับรู้",
        "pdfUrl": "/psychology-intro/บทที่ 4 การรับสัมผัสและการรับรู้.pdf",
        "coverColor": "bg-red-600",
        "totalPages": 47,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch5",
        "title": "บทที่ 5 การเรียนรู้",
        "pdfUrl": "/psychology-intro/บทที่ 5 การเรียนรู้.pdf",
        "coverColor": "bg-orange-600",
        "totalPages": 40,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch6",
        "title": "บทที่ 6 การรู้คิดและสติปัญญา",
        "pdfUrl": "/psychology-intro/บทที่ 6 การรู้คิดและสติปัญญา.pdf",
        "coverColor": "bg-teal-600",
        "totalPages": 34,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch7",
        "title": "บทที่ 7 แรงจูงใจและอารมณ์",
        "pdfUrl": "/psychology-intro/บทที่ 7 แรงจูงใจและอารมณ์.pdf",
        "coverColor": "bg-indigo-600",
        "totalPages": 61,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch8",
        "title": "บทที่ 8 บุคลิกภาพและการวัด",
        "pdfUrl": "/psychology-intro/บทที่ 8 บุคลิกภาพและการวัด.pdf",
        "coverColor": "bg-blue-600",
        "totalPages": 35,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch9",
        "title": "บทที่ 9 ความเครียดและสุขภาพ",
        "pdfUrl": "/psychology-intro/บทที่ 9 ความเครียดและสุขภาพ.pdf",
        "coverColor": "bg-green-600",
        "totalPages": 21,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch10",
        "title": "บทที่ 10 ความผิดปกติทางจิตและการบำบัด",
        "pdfUrl": "/psychology-intro/บทที่ 10 ความผิดปกติทางจิตและการบำบัด.pdf",
        "coverColor": "bg-purple-600",
        "totalPages": 28,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch11",
        "title": "บทที่ 11 พฤติกรรมทางสังคม",
        "pdfUrl": "/psychology-intro/บทที่ 11 พฤติกรรมทางสังคม.pdf",
        "coverColor": "bg-red-600",
        "totalPages": 36,
        "categoryId": "psychology-intro"
      },
      {
        "id": "psychology-intro-ch12",
        "title": "บทที่ 12 จิตวิทยาประยุกต์",
        "pdfUrl": "/psychology-intro/บทที่ 12 จิตวิทยาประยุกต์.pdf",
        "coverColor": "bg-orange-600",
        "totalPages": 20,
        "categoryId": "psychology-intro"
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
