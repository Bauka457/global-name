import React from 'react';
import { Trophy, RefreshCcw, Star, Award } from 'lucide-react';

interface ResultsProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export const Results: React.FC<ResultsProps> = ({ score, total, onRestart }) => {
  const percentage = (score / total) * 100;
  
  const getFeedback = () => {
    if (percentage === 100) return "Әлемнің шебері!";
    if (percentage >= 80) return "Жаһандық сарапшы!";
    if (percentage >= 50) return "Тәжірибелі саяхатшы!";
    return "Тағы бір саяхатқа шығамыз ба?";
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className="max-w-md w-full bg-gray-900/90 border border-white/10 rounded-[3rem] p-10 text-center shadow-[0_0_50px_rgba(59,130,246,0.3)]">
        <div className="relative inline-block mb-8">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto animate-bounce" />
          <Star className="absolute -top-4 -right-4 w-10 h-10 text-blue-400 animate-pulse" />
          <Award className="absolute -bottom-2 -left-4 w-12 h-12 text-purple-400 animate-spin-slow" />
        </div>

        <h2 className="text-4xl font-extrabold mb-2 text-white">{getFeedback()}</h2>
        
        <div className="my-8">
          <div className="text-6xl font-black text-blue-500 mb-2">
            {score} <span className="text-2xl text-gray-500">/ {total}</span>
          </div>
          <p className="text-gray-400 font-medium">Жиналған ұпайлар</p>
        </div>

        <div className="w-full h-4 bg-gray-800 rounded-full mb-10 overflow-hidden p-1">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center space-x-3 py-5 bg-white text-black hover:bg-blue-400 hover:text-white rounded-2xl text-xl font-bold transition-all transform active:scale-95 shadow-xl"
        >
          <RefreshCcw className="w-6 h-6" />
          <span>Жаңа экспедиция</span>
        </button>
      </div>
    </div>
  );
};