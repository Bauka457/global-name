import React from 'react';
import { Globe as GlobeIcon, Compass, Rocket } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="max-w-xl p-12 bg-gray-900/80 rounded-3xl border border-white/10 shadow-2xl text-center transform transition-all hover:scale-[1.02]">
        <div className="flex justify-center mb-6 space-x-4">
          <GlobeIcon className="w-12 h-12 text-blue-400 animate-pulse" />
          <Rocket className="w-12 h-12 text-yellow-400 animate-bounce" />
        </div>
        
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Ғарыштық Викторина
        </h1>
        
        <p className="text-gray-300 text-xl mb-8 leading-relaxed">
          Планетамыз бойынша таңғажайып саяхатқа аттаныңыз. 
          Көрнекті жерлерді ашыңыз, біліміңізді сынаңыз және бүкіл әлем 
          бойынша шашыраған 30 сынақты жеңіңіз.
        </p>
        
        <button
          onClick={onStart}
          className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-2xl font-bold transition-all shadow-lg hover:shadow-blue-500/50 flex items-center justify-center mx-auto overflow-hidden"
        >
          <span className="relative z-10">Саяхатқа дайынсыз ба?</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
        
        <div className="mt-8 flex justify-center space-x-6 text-gray-400 text-sm">
          <div className="flex items-center"><Compass className="w-4 h-4 mr-1" /> 30 орын</div>
          <div className="flex items-center"><Rocket className="w-4 h-4 mr-1" /> Жылдам қарқын</div>
          <div className="flex items-center"><GlobeIcon className="w-4 h-4 mr-1" /> 3D Зерттеуші</div>
        </div>
      </div>
    </div>
  );
};