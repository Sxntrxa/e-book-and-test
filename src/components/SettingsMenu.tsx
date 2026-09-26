"use client";

import React, { useState } from 'react';
import { useSettings } from './SettingsProvider';
import { Settings, Moon, Sun, Type, BookOpenText, X } from 'lucide-react';

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const { theme, setTheme, fontSize, setFontSize } = useSettings();

  return (
    <>
    <div className="fixed top-4 right-4 z-[100] flex items-center gap-2">
      <button
        onClick={() => setShowManual(true)}
        className="h-10 px-3 rounded-full glass-panel flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors shadow-lg text-sm font-medium"
        title="คู่มือการใช้งาน"
      >
        <BookOpenText size={18} />
        <span className="hidden sm:inline">คู่มือ</span>
      </button>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg"
      >
        <Settings size={20} className={isOpen ? "rotate-90 transition-transform" : "transition-transform"} />
      </button>

      {isOpen && (
        <>
        <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
        <div className="absolute top-12 right-0 w-64 glass-panel-heavy p-4 rounded-2xl shadow-2xl origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">ตั้งค่าระบบ</h3>
          
          <div className="mb-4">
            <label className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block flex items-center gap-1">
              <Sun size={14}/> ธีมสี (Theme)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setTheme('light')}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition ${theme === 'light' ? 'glass-button active' : 'glass-button'}`}
              >
                สว่าง
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition ${theme === 'dark' ? 'glass-button active' : 'glass-button'}`}
              >
                มืด
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted font-bold uppercase tracking-wider mb-2 block flex items-center gap-1">
              <Type size={14}/> ขนาดตัวอักษร
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setFontSize('sm')}
                className={`py-2 px-2 rounded-lg text-sm font-medium transition ${fontSize === 'sm' ? 'glass-button active' : 'glass-button'}`}
              >
                เล็ก
              </button>
              <button 
                onClick={() => setFontSize('base')}
                className={`py-2 px-2 rounded-lg text-sm font-medium transition ${fontSize === 'base' ? 'glass-button active' : 'glass-button'}`}
              >
                กลาง
              </button>
              <button 
                onClick={() => setFontSize('lg')}
                className={`py-2 px-2 rounded-lg text-sm font-medium transition ${fontSize === 'lg' ? 'glass-button active' : 'glass-button'}`}
              >
                ใหญ่
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </div>

    {/* Manual PDF Modal */}
    {showManual && (
      <div className="fixed inset-0 z-[200] flex flex-col bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-3 glass-panel-heavy border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-2">
            <BookOpenText size={20} className="text-primary" />
            <h2 className="text-lg font-bold">คู่มือการใช้งาน</h2>
          </div>
          <button
            onClick={() => setShowManual(false)}
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
            title="ปิด"
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src="/SOP For E-Book & Exam.pdf"
            className="w-full h-full border-0"
            title="คู่มือการใช้งาน"
          />
        </div>
      </div>
    )}
    </>
  );
}
