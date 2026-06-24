import React, { useState } from 'react';
import { Home, BarChart2, Users, Settings, Plus } from 'lucide-react';
import { MatchState, Rally, Team, ReceptionQuality } from './types';
import { InputScreen } from './components/InputScreen';
import { StatsScreen } from './components/StatsScreen';
import { MembersTab } from './components/MembersTab';
import { SettingsTab } from './components/SettingsTab';
import { MatchSetupModal } from './components/MatchSetupModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'matches' | 'members' | 'settings'>('members');
  
  // Match flows: setup, active (input/stats), none
  const [matchScreen, setMatchScreen] = useState<'setup' | 'input' | 'stats' | null>(null);

  const [matchState, setMatchState] = useState<MatchState>({
    ourScore: 0,
    opponentScore: 0,
    currentServingTeam: 'us',
    currentRotation: 1,
    rallies: []
  });

  const handleScore = (winningTeam: Team, receiveQuality?: ReceptionQuality) => {
    const newRally: Rally = {
      id: Math.random().toString(36).substring(7),
      servingTeam: matchState.currentServingTeam,
      rotation: matchState.currentRotation,
      events: [],
      winningTeam,
      ourScore: matchState.ourScore + (winningTeam === 'us' ? 1 : 0),
      opponentScore: matchState.opponentScore + (winningTeam === 'opponent' ? 1 : 0)
    };

    if (receiveQuality && matchState.currentServingTeam === 'opponent') {
      newRally.events.push({
        id: Math.random().toString(36).substring(7),
        team: 'us',
        skill: 'receive',
        quality: receiveQuality,
        timestamp: Date.now()
      });
    }

    setMatchState(prev => {
      const nextScoreUs = prev.ourScore + (winningTeam === 'us' ? 1 : 0);
      const nextScoreOpp = prev.opponentScore + (winningTeam === 'opponent' ? 1 : 0);
      
      let nextRotation = prev.currentRotation;
      let nextServingTeam = winningTeam;
      
      if (winningTeam === 'us' && prev.currentServingTeam === 'opponent') {
        nextRotation = prev.currentRotation === 6 ? 1 : prev.currentRotation + 1;
      }

      return {
        ...prev,
        ourScore: nextScoreUs,
        opponentScore: nextScoreOpp,
        currentServingTeam: nextServingTeam,
        currentRotation: nextRotation,
        rallies: [...prev.rallies, newRally]
      };
    });
  };

  const handleUndo = () => {
    setMatchState(prev => {
      if (prev.rallies.length === 0) return prev;
      
      const newRallies = [...prev.rallies];
      const lastRally = newRallies.pop();
      if (!lastRally) return prev;

      let prevServingTeam: Team = 'us';
      let prevRotation = 1;

      if (newRallies.length > 0) {
        const prevRally = newRallies[newRallies.length - 1];
        prevServingTeam = prevRally.winningTeam === 'us' ? 'us' : 'opponent';
        prevRotation = lastRally.rotation;
      } else {
         // Reverting the very first point. We keep the same serving team that served first.
         prevServingTeam = lastRally.servingTeam;
         prevRotation = lastRally.rotation;
      }

      return {
        ...prev,
        rallies: newRallies,
        ourScore: prev.ourScore - (lastRally.winningTeam === 'us' ? 1 : 0),
        opponentScore: prev.opponentScore - (lastRally.winningTeam === 'opponent' ? 1 : 0),
        currentServingTeam: prevServingTeam,
        currentRotation: prevRotation
      };
    });
  };

  const handleRotate = () => {
    setMatchState(prev => ({
      ...prev,
      currentRotation: prev.currentRotation === 6 ? 1 : prev.currentRotation + 1
    }));
  };

  const handleSetServingTeam = (team: Team) => {
    setMatchState(prev => ({
      ...prev,
      currentServingTeam: team
    }));
  };

  const handleStartMatch = () => {
    // Reset state for new match
    setMatchState({
      ourScore: 0,
      opponentScore: 0,
      currentServingTeam: 'us',
      currentRotation: 1,
      rallies: []
    });
    setMatchScreen('input');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col h-full items-center justify-center bg-[#f4f7fa] p-6 text-center">
            <h1 className="text-2xl font-black text-slate-800 mb-2">V-Tacticsへようこそ</h1>
            <p className="text-[13px] text-slate-500 font-medium mb-8">日々の記録から勝利へのヒントを見つけましょう</p>
            <button 
              onClick={() => setMatchScreen('setup')}
              className="bg-blue-600 text-white font-bold px-8 py-4 rounded-full shadow-[0_8px_32px_rgba(37,99,235,0.4)] flex items-center gap-2 active:scale-95 transition"
            >
              <Plus className="w-5 h-5" />
              新しい試合を記録
            </button>
          </div>
        );
      case 'matches':
        return (
          <div className="flex flex-col h-full bg-[#f4f7fa] p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">試合</h1>
            </div>
            {matchState.rallies.length > 0 && (
               <div 
                 onClick={() => setMatchScreen('input')}
                 className="bg-white p-5 rounded-3xl shadow-sm mb-4 active:scale-[0.98] transition cursor-pointer border border-slate-100"
               >
                 <div className="flex justify-between items-center mb-3">
                   <div className="flex gap-2">
                     <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-sm">練習試合</span>
                     <span className="text-xs font-bold text-slate-500">2026/06/16</span>
                   </div>
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 </div>
                 <div className="flex items-center justify-between mb-1">
                   <span className="text-[15px] font-bold text-slate-800">自チーム</span>
                   <span className="text-2xl font-black text-blue-600">{matchState.ourScore}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-[15px] font-bold text-slate-800">対戦相手</span>
                   <span className="text-2xl font-black text-slate-800">{matchState.opponentScore}</span>
                 </div>
               </div>
            )}
            <button 
              onClick={() => setMatchScreen('setup')}
              className="w-full border-2 border-dashed border-slate-300 rounded-3xl py-6 flex flex-col items-center justify-center gap-2 text-slate-500 font-bold active:bg-slate-100 transition"
            >
              <Plus className="w-6 h-6" />
              新しい試合
            </button>
          </div>
        );
      case 'members':
        return <MembersTab />;
      case 'settings':
        return <SettingsTab />;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-[430px] mx-auto bg-slate-50 font-sans overflow-hidden shadow-2xl relative">
      
      {/* Root Interface */}
      {!matchScreen && (
        <>
          <main className="flex-1 overflow-hidden relative flex flex-col bg-slate-50">
            {renderActiveTab()}
          </main>

          {/* Bottom Navigation */}
          <nav className="h-16 bg-[#ebf0f5] w-full flex justify-around items-center px-2 pb-safe shrink-0 z-50 rounded-t-[32px] border-t border-slate-200/50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center w-16 gap-1.5 transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Home className="w-6 h-6 stroke-[2.5]" />
              <span className="text-[10px] font-bold">ホーム</span>
            </button>
            <button 
              onClick={() => setActiveTab('matches')}
              className={`flex flex-col items-center justify-center w-16 gap-1.5 transition-colors ${activeTab === 'matches' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className="relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {matchState.rallies.length > 0 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#ebf0f5]" />}
              </div>
              <span className="text-[10px] font-bold">試合</span>
            </button>
            <button 
              onClick={() => setActiveTab('members')}
              className={`flex flex-col items-center justify-center w-16 gap-1.5 transition-colors ${activeTab === 'members' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Users className="w-6 h-6 stroke-[2.5]" />
              <span className="text-[10px] font-bold">メンバー</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center justify-center w-16 gap-1.5 transition-colors ${activeTab === 'settings' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Settings className="w-6 h-6 stroke-[2.5]" />
              <span className="text-[10px] font-bold">設定</span>
            </button>
          </nav>
        </>
      )}

      {/* Overlays / Modals */}
      {matchScreen === 'setup' && (
        <MatchSetupModal 
          onClose={() => setMatchScreen(null)} 
          onStart={handleStartMatch} 
          onGoToMembers={() => {
            setMatchScreen(null);
            setActiveTab('members');
          }}
        />
      )}

      {(matchScreen === 'input' || matchScreen === 'stats') && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white">
          <main className="flex-1 overflow-hidden relative flex flex-col">
            {matchScreen === 'input' && (
              <InputScreen 
                state={matchState} 
                onScore={handleScore} 
                onUndo={handleUndo}
                onRotate={handleRotate}
                onSetServingTeam={handleSetServingTeam}
                onEndMatch={() => setMatchScreen(null)} // Go back to root
              />
            )}
            {matchScreen === 'stats' && (
              <StatsScreen state={matchState} />
            )}
          </main>
          
          {/* Match Bottom Navigation (Input / Stats toggle) */}
          <nav className="h-16 bg-[#1a2130] w-full flex justify-around items-center px-4 pb-safe shrink-0 z-50">
            <button 
              onClick={() => setMatchScreen('input')}
              className={`flex flex-col items-center justify-center w-20 gap-1.5 transition-colors ${matchScreen === 'input' ? 'text-blue-400' : 'text-slate-400'}`}
            >
              <Home className="w-5 h-5 stroke-[2.5]" />
              <span className="text-[10px] font-bold">入力</span>
            </button>
            <button 
              onClick={() => setMatchScreen('stats')}
              className={`flex flex-col items-center justify-center w-20 gap-1.5 transition-colors ${matchScreen === 'stats' ? 'text-blue-400' : 'text-slate-400'}`}
            >
              <BarChart2 className="w-5 h-5 stroke-[2.5]" />
              <span className="text-[10px] font-bold">分析</span>
            </button>
          </nav>
        </div>
      )}
      
    </div>
  );
}
