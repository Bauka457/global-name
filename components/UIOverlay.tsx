import React from 'react';
import { Target, Flag } from 'lucide-react';

interface UIOverlayProps {
  score: number;
  total: number;
  answeredCount: number;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ score, total, answeredCount }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none">
      {/* Left: Progress */}
      <div className="flex flex-col space-y-2">
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center space-x-3 pointer-events-auto">
          <Target className="w-5 h-5 text-blue-400" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Ұпай</span>
            <span className="text-xl font-black text-white leading-none">{score}</span>
          </div>
        </div>
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center space-x-3 pointer-events-auto">
          <Flag className="w-5 h-5 text-green-400" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Экспедиция</span>
            <span className="text-xl font-black text-white leading-none">{answeredCount} / {total}</span>
          </div>
        </div>
      </div>

      {/* Right: Help/Instructions */}
      <div className="bg-black/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-right pointer-events-auto max-w-xs hidden md:block">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Қалай ойнау керек</h3>
        <p className="text-sm text-gray-200 leading-tight">
          Миссия маркерлерін табу үшін глобусты айналдырыңыз. Сынақты бастау үшін қызыл маркерді басыңыз. 
          Барлық {total} орынды жинаңыз!
        </p>
      </div>
      
      {/* Mobile hint */}
      <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs text-white/80 animate-pulse">
        Глобустағы маркерлерді табыңыз
      </div>
    </div>
  );
};