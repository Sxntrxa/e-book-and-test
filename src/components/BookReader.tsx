"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import HTMLFlipBook from 'react-pageflip';
import { ZoomIn, ZoomOut, Sun, Moon, Eye, ArrowLeft, Wand2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

interface PageProps {
  pageNumber: number;
  pdfDocument: any;
  filterClass: string;
}

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ pageNumber, pdfDocument, filterClass }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      let renderTask: any;
      
      const renderPage = async () => {
        if (!pdfDocument || !canvasRef.current) return;
        try {
          const page = await pdfDocument.getPage(pageNumber);
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const pixelRatio = window.devicePixelRatio || 1;
          const highResScale = Math.min(pixelRatio, 2) * 1.5;
          const viewport = page.getViewport({ scale: highResScale });

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.display = 'block';

          const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };

          renderTask = page.render(renderContext);
          await renderTask.promise;
        } catch (error: any) {
          if (error.name !== 'RenderingCancelledException') {
            console.error('Error rendering page:', error);
          }
        }
      };

      renderPage();

      return () => {
        if (renderTask) {
          renderTask.cancel();
        }
      };
    }, [pageNumber, pdfDocument]);

    return (
      <div ref={ref} className={`bg-white overflow-hidden ${filterClass}`}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
    );
  }
);

Page.displayName = 'Page';

export default function BookReader({ pdfUrl, onBack }: { pdfUrl: string, onBack?: () => void }) {
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [filterMode, setFilterMode] = useState<string>('normal');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, isPortrait: false });
  
  // ซ่อนแถบ Toolbar เมื่อผู้ใช้อ่านหนังสือ และให้แตะกลางจอเพื่อเรียกขึ้นมาได้
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      // ใช้ความสูงของหน้าต่างลบด้วย padding นิดหน่อย (ไม่หักความสูง Toolbar แล้ว เพราะซ่อน)
      const availableHeight = window.innerHeight - 40;
      const availableWidth = window.innerWidth - 40;
      const portraitMode = window.innerWidth < window.innerHeight;
      
      let h = availableHeight;
      let w = h * (400 / 566);
      
      const requiredWidth = portraitMode ? w : w * 2;
      
      if (requiredWidth > availableWidth) {
         w = portraitMode ? availableWidth : availableWidth / 2;
         h = w * (566 / 400);
      }
      
      setDimensions({ width: w, height: h, isPortrait: portraitMode });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
        const pdf = await loadingTask.promise;
        setPdfDocument(pdf);
        setNumPages(pdf.numPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setLoadError(error);
      } finally {
        setLoading(false);
      }
    };
    loadPdf();
  }, [pdfUrl]);

  const getFilterClass = () => {
    switch (filterMode) {
      case 'enhance': return 'contrast-150 saturate-0 brightness-105';
      case 'dark': return 'invert hue-rotate-180 brightness-90 contrast-125';
      case 'sepia': return 'sepia-[.7] brightness-95 contrast-90';
      default: return '';
    }
  };

  const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));
  const handleResetZoom = () => setScale(1.0);

  if (loading) return <div className="flex h-screen w-full items-center justify-center text-xl text-white">กำลังโหลดหนังสือ...</div>;
  if (loadError) return <div className="flex h-screen w-full flex-col items-center justify-center text-xl text-red-500">ไม่สามารถโหลดไฟล์ PDF ได้<br/><span className="text-sm text-gray-400 mt-2">{String(loadError)}</span></div>;
  if (!pdfDocument) return <div className="flex h-screen w-full items-center justify-center text-xl text-red-500">ไม่สามารถโหลดไฟล์ PDF ได้</div>;

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 relative overflow-hidden">
      
      {/* แถบเมนูด้านบน (โผล่มาเมื่อ showToolbar เป็น true) */}
      <div 
        className={`absolute top-0 left-0 w-full bg-gray-800 text-white p-2 md:p-3 flex gap-2 md:gap-4 justify-center z-[70] shadow-lg items-center h-16 transition-transform duration-300 ease-in-out ${showToolbar ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute left-4 flex items-center gap-2 hover:text-blue-400 transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline text-sm">กลับ</span>
          </button>
        )}

        <span className="hidden lg:inline font-bold mr-2 ml-10">MEB-like Reader</span>
        
        <button onClick={handleZoomOut} className="p-2 hover:bg-gray-700 rounded-full transition" title="ลดขนาด">
          <ZoomOut size={20} />
        </button>
        <button onClick={handleResetZoom} className="flex items-center text-xs md:text-sm w-12 justify-center hover:text-blue-400" title="รีเซ็ตขนาด">
          {Math.round(scale * 100)}%
        </button>
        <button onClick={handleZoomIn} className="p-2 hover:bg-gray-700 rounded-full transition" title="เพิ่มขนาด">
          <ZoomIn size={20} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1 md:mx-2"></div>

        <button onClick={() => setFilterMode('enhance')} className={`p-2 rounded-full transition ${filterMode === 'enhance' ? 'bg-purple-600' : 'hover:bg-gray-700'}`} title="โหมดเพิ่มความชัด (สำหรับไฟล์เบลอ)">
          <Wand2 size={20} />
        </button>
        <button onClick={() => setFilterMode('normal')} className={`p-2 rounded-full transition ${filterMode === 'normal' ? 'bg-blue-600' : 'hover:bg-gray-700'}`} title="โหมดปกติ">
          <Sun size={20} />
        </button>
        <button onClick={() => setFilterMode('sepia')} className={`p-2 rounded-full transition ${filterMode === 'sepia' ? 'bg-orange-600' : 'hover:bg-gray-700'}`} title="โหมดถนอมสายตา">
          <Eye size={20} />
        </button>
        <button onClick={() => setFilterMode('dark')} className={`p-2 rounded-full transition ${filterMode === 'dark' ? 'bg-gray-600' : 'hover:bg-gray-700'}`} title="โหมดกลางคืน">
          <Moon size={20} />
        </button>
      </div>

      {/* พื้นที่ตรวจจับการคลิกกลางจอเพื่อแสดง/ซ่อน Toolbar */}
      <div 
        className="absolute inset-0 z-50 flex justify-center items-center pointer-events-none"
      >
        <div 
          className="w-1/3 h-full pointer-events-auto cursor-pointer"
          onClick={() => setShowToolbar(!showToolbar)}
          title="แตะกลางจอเพื่อเปิด/ปิดเมนู"
        ></div>
      </div>

      <div className={`w-full h-full p-4 flex justify-center ${scale > 1.05 ? 'overflow-auto items-start' : 'overflow-hidden items-center'}`}>
        <div className="transition-transform duration-300 ease-out origin-top flex justify-center"
             style={{ transform: `scale(${scale})` }}>
          
          {dimensions.width > 0 && (
            <div style={{ width: dimensions.width * (dimensions.isPortrait ? 1 : 2), height: dimensions.height }} className="relative z-40">
              {/* @ts-ignore */}
              <HTMLFlipBook 
                width={400} 
                height={566} 
                size="stretch"
                minWidth={100}
                maxWidth={3000}
                minHeight={100}
                maxHeight={3000}
                showCover={true}
                mobileScrollSupport={true}
                showPageCorners={false} 
                usePortrait={true} 
                flippingTime={450} 
                maxShadowOpacity={0.3} 
                swipeDistance={10}
                className="demo-book shadow-2xl"
              >
                {Array.from(new Array(numPages % 2 === 0 ? numPages : numPages + 1), (el, index) => (
                  index < numPages ? (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      pdfDocument={pdfDocument}
                      filterClass={getFilterClass()}
                    />
                  ) : (
                    <div key={`page_empty_${index + 1}`} className={`bg-white ${getFilterClass()}`}></div>
                  )
                ))}
              </HTMLFlipBook>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
