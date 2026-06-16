import React from 'react';
import { MatchState } from '../types';

interface CourtDiagramProps {
  state: MatchState;
}

export function CourtDiagram({ state }: CourtDiagramProps) {
  // Positions on the left half court (net is on the right)
  const leftPositions = [
    { id: 4, top: '20%', left: '75%', label: 'フロントL' },
    { id: 3, top: '50%', left: '75%', label: 'フロントC' },
    { id: 2, top: '80%', left: '75%', label: 'フロントR' },
    { id: 5, top: '20%', left: '25%', label: 'バックL' },
    { id: 6, top: '50%', left: '25%', label: 'バックC' },
    { id: 1, top: '80%', left: '25%', label: 'バックR' },
  ];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-slate-800">
      {/* Header Info */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 shrink-0 pointer-events-none">
        <div className="flex flex-col">
          <span className="text-white/50 font-bold uppercase tracking-widest text-xs mb-1">TACTICAL VIEW</span>
          <span className="text-white text-xl font-bold tracking-tight">コート図</span>
        </div>
        <div className="bg-blue-600/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold shadow-lg backdrop-blur flex items-center gap-2">
          <span>ローテーション</span>
          <span className="text-white text-lg">R{state.currentRotation}</span>
        </div>
      </div>
      
      {/* Court Area */}
      <div className="flex-1 flex items-center justify-center p-12 lg:p-20 relative">
        <div className="w-full max-w-5xl aspect-[2/1] bg-[#e68a5c] border-[6px] border-white shadow-2xl relative flex mx-auto">
          {/* Left Court (Our Team) */}
          <div className="flex-1 border-r-[3px] border-white relative overflow-hidden">
            {/* Attack Line (3m line) */}
            <div className="absolute top-0 bottom-0 right-[33.3%] border-r-[4px] border-white/60" />
            
            <div className="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-5xl md:text-6xl uppercase tracking-widest pointer-events-none select-none">
              自チーム
            </div>
            
            {leftPositions.map(pos => (
              <div 
                key={pos.id}
                className="absolute w-14 h-14 md:w-16 md:h-16 -ml-7 -mt-7 md:-ml-8 md:-mt-8 rounded-full bg-blue-600/90 text-white flex flex-col items-center justify-center font-bold shadow-lg border-2 border-white/50 backdrop-blur transition-all duration-300"
                style={{ top: pos.top, left: pos.left }}
              >
                <span className="text-lg md:text-xl font-mono leading-none">P{pos.id}</span>
              </div>
            ))}
            
            {/* Server indicator */}
            {state.currentServingTeam === 'us' && (
              <div className="absolute top-[80%] left-[-40px] md:left-[-60px] flex items-center gap-2 text-emerald-400 font-bold">
                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-emerald-500 animate-pulse border-2 border-white shadow-lg" />
                <span className="text-sm tracking-widest bg-emerald-900/40 px-2 py-0.5 rounded backdrop-blur">SERVE</span>
              </div>
            )}
          </div>
          
          {/* Right Court (Opponent) */}
          <div className="flex-1 border-l-[3px] border-white relative overflow-hidden">
            {/* Attack Line */}
            <div className="absolute top-0 bottom-0 left-[33.3%] border-l-[4px] border-white/60" />
            
            <div className="absolute inset-0 flex items-center justify-center text-white/20 font-bold text-5xl md:text-6xl uppercase tracking-widest pointer-events-none select-none">
              相手チーム
            </div>
            
            {state.currentServingTeam === 'opponent' && (
              <div className="absolute top-[80%] right-[-40px] md:right-[-60px] flex flex-row-reverse items-center gap-2 text-emerald-400 font-bold">
                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-emerald-500 animate-pulse border-2 border-white shadow-lg" />
                <span className="text-sm tracking-widest bg-emerald-900/40 px-2 py-0.5 rounded backdrop-blur">SERVE</span>
              </div>
            )}
          </div>
          
          {/* Net */}
          <div className="absolute top-[-30px] bottom-[-30px] left-1/2 w-4 bg-slate-200 -translate-x-1/2 shadow-2xl z-10 border-x border-slate-400 flex flex-col">
          </div>
            
          {/* Antennas */}
          <div className="absolute top-[-50px] left-1/2 w-1.5 h-14 bg-red-500 -translate-x-1/2 z-20 overflow-hidden rounded-t-sm">
            <div className="w-full h-2.5 bg-white mb-2" />
            <div className="w-full h-2.5 bg-white mb-2" />
            <div className="w-full h-2.5 bg-white" />
          </div>
          <div className="absolute bottom-[-50px] left-1/2 w-1.5 h-14 bg-red-500 -translate-x-1/2 z-20 overflow-hidden flex flex-col justify-end rounded-b-sm">
             <div className="w-full h-2.5 bg-white mt-2" />
             <div className="w-full h-2.5 bg-white mt-2" />
             <div className="w-full h-2.5 bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
