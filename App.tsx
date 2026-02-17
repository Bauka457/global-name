
import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Environment } from '@react-three/drei';
import { GameState, QuizProgress, Question } from './types';
import { QUESTIONS } from './constants';
import { Globe } from './components/Globe';
import { SolarSystem } from './components/SolarSystem';
import { IntroScreen } from './components/IntroScreen';
import { QuestionModal } from './components/QuestionModal';
import { Results } from './components/Results';
import { UIOverlay } from './components/UIOverlay';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [progress, setProgress] = useState<QuizProgress>({
    answered: [],
    score: 0,
    currentQuestion: null,
  });

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleSelectQuestion = useCallback((q: Question) => {
    if (progress.answered.includes(q.id)) return;
    setProgress(prev => ({ ...prev, currentQuestion: q }));
  }, [progress.answered]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (!progress.currentQuestion) return;

    setProgress(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      answered: [...prev.answered, prev.currentQuestion!.id],
      currentQuestion: null,
    }));

    if (progress.answered.length + 1 === QUESTIONS.length) {
      setTimeout(() => setGameState('results'), 1000);
    }
  }, [progress]);

  const handleRestart = () => {
    setProgress({ answered: [], score: 0, currentQuestion: null });
    setGameState('intro');
  };

  const isQuestionActive = !!progress.currentQuestion;

  return (
    <div className="w-full h-full relative bg-black">
      <Canvas
        shadows
        camera={{ position: [0, 10, 30], fov: 45, far: 8000 }}
        className="bg-black"
      >
        <color attach="background" args={['#000005']} />
        <Stars radius={500} depth={150} count={20000} factor={8} saturation={0} fade speed={1.5} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
        
        <SolarSystem />
        
        <Globe 
          questions={QUESTIONS} 
          answeredIds={progress.answered}
          onMarkerClick={handleSelectQuestion}
          focusQuestion={progress.currentQuestion}
        />

        {/* Сұрақ белсенді болса, OrbitControls өшіріледі, әйтпесе камера секіреді */}
        <OrbitControls 
          enabled={!isQuestionActive && gameState !== 'results'}
          enablePan={false} 
          minDistance={8} 
          maxDistance={100} 
          autoRotate={gameState !== 'results'}
          autoRotateSpeed={isQuestionActive ? 0 : 0.4}
        />
        <Environment preset="night" />
      </Canvas>

      {/* UI Layers */}
      {gameState === 'intro' && <IntroScreen onStart={handleStartGame} />}
      
      {progress.currentQuestion && (
        <QuestionModal 
          question={progress.currentQuestion} 
          onAnswer={handleAnswer} 
        />
      )}

      {gameState === 'playing' && !isQuestionActive && (
        <UIOverlay 
          score={progress.score} 
          total={QUESTIONS.length} 
          answeredCount={progress.answered.length} 
        />
      )}

      {gameState === 'results' && (
        <Results 
          score={progress.score} 
          total={QUESTIONS.length} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
};

export default App;
