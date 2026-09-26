"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, BellRing } from 'lucide-react';

export default function UpdateNotice() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);

  useEffect(() => {
    // Check if we should show the modal
    const hideUntil = localStorage.getItem('hideUpdateNoticeUntil');
    if (hideUntil) {
      const hideUntilDate = new Date(hideUntil);
      const now = new Date();
      if (now < hideUntilDate) {
        return; // Don't show
      }
    }
    
    // Slight delay so it doesn't pop up too aggressively instantly
    const timer = setTimeout(() => setIsOpen(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (dontShowToday) {
      // Set to tomorrow at midnight
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      localStorage.setItem('hideUpdateNoticeUntil', tomorrow.toISOString());
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1a1b26] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Sparkles size={24} className="text-yellow-300" />
            </div>
            <h2 className="text-2xl font-bold">มีอะไรใหม่! (อัปเดตล่าสุด)</h2>
          </div>
          <p className="text-blue-100 text-sm">อัปเดตระบบเพื่อให้ประสบการณ์ใช้งานของคุณดียิ่งขึ้น</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <ul className="space-y-4 mb-6">
            <li className="flex gap-3">
              <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 shrink-0">
                <Check size={16} />
              </div>
              <div>
                <strong className="block text-gray-800 dark:text-gray-100">ดีไซน์ใหม่แบบ Liquid Glass</strong>
                <span className="text-sm text-gray-600 dark:text-gray-400">เปลี่ยนหน้าจอหลักและส่วนต่างๆ ให้เป็นธีมกระจกใส สวยงามและเข้ากับโหมดสว่าง/มืด</span>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 shrink-0">
                <Check size={16} />
              </div>
              <div>
                <strong className="block text-gray-800 dark:text-gray-100">คู่มือการใช้งาน (SOP) ในแอพ</strong>
                <span className="text-sm text-gray-600 dark:text-gray-400">เปิดอ่านคู่มือได้จากในแอพโดยตรง ในรูปแบบหน้าเปิดหนังสือ (BookReader)</span>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 shrink-0">
                <Check size={16} />
              </div>
              <div>
                <strong className="block text-gray-800 dark:text-gray-100">รองรับ iPad & iPhone เต็มรูปแบบ</strong>
                <span className="text-sm text-gray-600 dark:text-gray-400">เพิ่มโลโก้ SINTREA เมื่อกด Add to Home Screen และแก้ปัญหาจอกระตุกทับซ้อน</span>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 shrink-0">
                <Check size={16} />
              </div>
              <div>
                <strong className="block text-gray-800 dark:text-gray-100">อัปเดตแบบทดสอบล่าสุด</strong>
                <span className="text-sm text-gray-600 dark:text-gray-400">ปรับปรุงระบบข้อสอบให้เสถียรขึ้น และแก้ไขบทเรียนต่างๆ ให้ถูกต้อง</span>
              </div>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-white/10">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800"
                checked={dontShowToday}
                onChange={(e) => setDontShowToday(e.target.checked)}
              />
              ไม่แสดงอีกในวันนี้
            </label>
            <button 
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              รับทราบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
