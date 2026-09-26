import Link from 'next/link';
import { categories } from '@/data/books';
import { Library, FolderOpen } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-[var(--foreground)] font-sans relative z-10">
      {/* Header */}
      <header className="glass-panel border-b border-[var(--glass-border)] p-6">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Library size={32} className="text-primary drop-shadow-md" />
          <h1 className="text-2xl font-bold tracking-wide">ห้องสมุดดิจิทัล (Digital Library)</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 mt-6">
        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)] border-b-2 border-[var(--glass-border)] pb-2 drop-shadow-sm">
          เลือกหมวดหมู่ที่ต้องการอ่าน
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const colors = [
              { bg: 'bg-blue-100', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-600', hoverText: 'group-hover:text-blue-600' },
              { bg: 'bg-purple-100', text: 'text-purple-600', hoverBg: 'group-hover:bg-purple-600', hoverText: 'group-hover:text-purple-600' },
              { bg: 'bg-emerald-100', text: 'text-emerald-600', hoverBg: 'group-hover:bg-emerald-600', hoverText: 'group-hover:text-emerald-600' },
              { bg: 'bg-amber-100', text: 'text-amber-600', hoverBg: 'group-hover:bg-amber-600', hoverText: 'group-hover:text-amber-600' }
            ];
            const color = colors[index % colors.length];

            return (
              <Link 
                href={`/category/${category.id}`} 
                key={category.id}
                className="group flex items-center gap-4 glass-panel rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border border-[var(--glass-border)]"
              >
                <div className={`w-16 h-16 ${color.bg} rounded-lg flex items-center justify-center ${color.text} ${color.hoverBg} group-hover:text-white transition-colors`}>
                  <FolderOpen size={32} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold text-[var(--foreground)] ${color.hoverText} transition-colors leading-tight`}>
                    {category.title.includes(' ') ? (
                      <>
                        <span className="block text-sm font-semibold opacity-70 mb-0.5">{category.title.split(' ')[0]}</span>
                        <span className="block">{category.title.substring(category.title.indexOf(' ') + 1)}</span>
                      </>
                    ) : (
                      <span className="block">{category.title}</span>
                    )}
                  </h3>
                  <p className="text-sm text-muted mt-1.5 font-medium">
                    {category.books.length} บทเรียน
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
