import React, { useState, useEffect } from 'react';
import { MatchState, ReceptionQuality, Team } from '../types';
import { Undo2, Plus, Minus, ChevronLeft, Lock, AlignRight, Play, RefreshCcw, LogOut, AlertTriangle, X } from 'lucide-react';

interface InputScreenProps {
  state: MatchState;
  onScore: (winningTeam: Team, receiveQuality?: ReceptionQuality) => void;
  onUndo: () => void;
  onRotate: () => void;
  onSetServingTeam: (team: Team) => void;
  onEndMatch: () => void;
}

export function InputScreen({ state, onScore, onUndo, onRotate, onSetServingTeam, onEndMatch }: InputScreenProps) {
  const isOurReceive = state.currentServingTeam === 'opponent';
  const [pending, setPending] = useState<'us' | 'opponent' | null>(null);
  const [isTOModalOpen, setIsTOModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [showServeSelect, setShowServeSelect] = useState(false);

  // mock statuses string
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  useEffect(() => {
    // Show Serve Select modal on initial load when match is just starting
    if (state.ourScore === 0 && state.opponentScore === 0 && state.rallies.length === 0) {
      setShowServeSelect(true);
    }
  }, []);

  const submitScore = (quality?: ReceptionQuality) => {
    if (!pending) return;
    onScore(pending, quality);
    setPending(null);
  };

  // Helper for TO Insights
  let currentConsecutiveLost = 0;
  state.rallies.forEach(r => {
    if (r.winningTeam === 'opponent') {
      currentConsecutiveLost++;
    } else {
      currentConsecutiveLost = 0;
    }
  });

  return (
    <div className="flex flex-col h-full bg-[#E8F5E9] text-slate-800 overflow-hidden relative no-scrollbar">
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button className="text-blue-500" onClick={onEndMatch}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="font-mono text-sm font-bold text-slate-700">00:02</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setShareStatus('共有用のリンクをコピーしました');
              setTimeout(() => setShareStatus(null), 2500);
            }}
            className="flex items-center gap-1 bg-white/60 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-black/5 active:scale-95 transition"
          >
            <Lock className="w-3 h-3" />
            共有開始
          </button>
          <button 
             onClick={() => {
              setShareStatus('試合のまとめ（スコア分析）を生成しました');
              setTimeout(() => setShareStatus(null), 2500);
            }}
            className="flex items-center gap-1 bg-white/60 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-black/5 active:scale-95 transition"
          >
            <AlignRight className="w-3 h-3" />
            試合のまとめ
          </button>
        </div>
      </header>

      {/* Badges Row */}
      <div className="flex items-center space-x-2 px-4 py-2 shrink-0 overflow-x-auto no-scrollbar">
        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 shrink-0"># Set 1</div>
        <div className="bg-orange-100/50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 shrink-0 flex items-center gap-1">
          <span>🏆</span> 0-0
        </div>
        <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold border border-purple-200 shrink-0 flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-purple-600 flex items-center justify-center">
             <div className="w-1 h-1 bg-purple-600 rounded-full" />
          </div>
          25点
        </div>
        <div className="ml-auto bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold border border-slate-300 flex items-center gap-1 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          未決定
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
        {/* Main Score Card */}
        <div className="bg-white rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 mb-4 mt-2 relative">
          
          {/* Overlays for Serving Team background indicator */}
          <div className={`absolute top-0 left-0 bottom-0 right-1/2 rounded-l-[32px] transition-colors duration-500 ${state.currentServingTeam === 'us' && !showServeSelect ? 'bg-blue-50/50' : 'bg-transparent'}`} />
          <div className={`absolute top-0 left-1/2 bottom-0 right-0 rounded-r-[32px] transition-colors duration-500 ${state.currentServingTeam === 'opponent' && !showServeSelect ? 'bg-red-50/50' : 'bg-transparent'}`} />

          <div className="flex flex-col items-center mb-6 relative z-10">
            <div className="text-sm font-bold text-slate-500 mb-2">vs 対戦相手未設定</div>
            <div className="flex gap-2">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-blue-100">大会</span>
              <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-purple-100">3セット</span>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-emerald-100">交代無制限</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 relative z-10">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-1">自チーム</span>
              <span className={`text-[80px] font-bold leading-none tabular-nums tracking-tighter text-blue-500`}>
                {state.ourScore}
              </span>
            </div>
            
            <span className="text-3xl text-slate-300 font-light mb-8">-</span>
            
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 mb-1">相手</span>
              <span className={`text-[80px] font-bold leading-none tabular-nums tracking-tighter text-slate-700`}>
                {state.opponentScore}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex gap-3 mb-4 shrink-0">
          <button 
            onClick={() => setPending('us')}
            className="flex-1 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition-transform text-white rounded-[24px] h-[100px] flex flex-col items-center justify-center shadow-md shadow-blue-500/20"
          >
            <Plus className="w-8 h-8 mb-1" />
            <span className="text-lg font-bold">得点</span>
          </button>
          <button 
            onClick={() => setPending('opponent')}
            className="flex-1 bg-red-500 hover:bg-red-600 active:scale-[0.98] transition-transform text-white rounded-[24px] h-[100px] flex flex-col items-center justify-center shadow-md shadow-red-500/20"
          >
            <Minus className="w-8 h-8 mb-1" />
            <span className="text-lg font-bold">失点</span>
          </button>
        </div>

        <div className="flex gap-2 w-full mb-4 shrink-0">
          <button 
            onClick={onUndo}
            className="flex-1 flex items-center justify-center gap-2 text-slate-500 font-medium py-3 active:bg-black/5 rounded-2xl transition"
            disabled={state.rallies.length === 0}
          >
            <Undo2 className="w-4 h-4" />
            取り消し
          </button>
        </div>
      </div>
      
      {/* Bottom Sub Actions */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-around items-center pt-3 pb-safe border-t border-emerald-600/10 text-emerald-700 font-bold text-[10px] px-2 bg-[#E8F5E9]/90 backdrop-blur z-10">
        <button className="flex flex-col items-center justify-center gap-1 w-16" onClick={() => setIsSubModalOpen(true)}>
          <RefreshCcw className="w-5 h-5 flex-shrink-0" />
          交代
        </button>
        <button className="flex flex-col items-center justify-center gap-1 w-16 relative" onClick={() => setIsTOModalOpen(true)}>
          <Play className="w-5 h-5 flex-shrink-0" />
          TO
          {currentConsecutiveLost >= 3 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
        <button className="flex flex-col items-center justify-center gap-1 w-16" onClick={() => onSetServingTeam(state.currentServingTeam === 'us' ? 'opponent' : 'us')}>
           <RefreshCcw className="w-5 h-5 flex-shrink-0" />
           サーブ権
        </button>
        <button onClick={onRotate} className="flex flex-col items-center justify-center gap-1 w-16">
           <RefreshCcw className="w-5 h-5 flex-shrink-0" />
           ローテ
        </button>
        <button className="flex flex-col items-center justify-center gap-1 w-16" onClick={onEndMatch}>
          <LogOut className="w-5 h-5 flex-shrink-0" />
          終了
        </button>
      </div>

      {/* Serve Selection Modal (Image 5) */}
      {showServeSelect && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[12px] z-50 flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full rounded-[32px] pt-8 pb-8 px-6 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-slate-100 animate-in slide-in-from-bottom-[100%] duration-300 spring-bounce-20 relative overflow-hidden mb-12">
            <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
            
            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-[20px] flex items-center justify-center mb-5 border border-blue-100/50">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h2 className="font-black text-[22px] text-slate-900 mb-1">サーブ開始</h2>
              <p className="text-[13px] font-medium text-slate-500">このセットの最初のサーブ側を選択</p>
            </div>
            
            <div className="flex flex-col gap-3 relative z-10">
              <button 
                onClick={() => {
                  onSetServingTeam('us');
                  setShowServeSelect(false);
                }}
                className="w-full bg-blue-600 text-white font-bold text-[16px] py-4 rounded-full flex justify-center items-center gap-2 active:scale-[0.98] transition-transform shadow-[0_4px_16px_rgba(37,99,235,0.2)]"
              >
                <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
                自チームがサーブ
              </button>
              <button 
                onClick={() => {
                  onSetServingTeam('opponent');
                  setShowServeSelect(false);
                }}
                className="w-full bg-white text-blue-600 font-bold text-[16px] py-4 rounded-full flex justify-center items-center gap-2 active:scale-[0.98] transition-transform shadow-sm border border-slate-200/60"
              >
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                相手がサーブ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reason Selection Modal */}
      {pending && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-[16px] flex items-center justify-center text-white ${pending === 'us' ? 'bg-blue-500' : 'bg-red-500'} shadow-sm`}>
                  {pending === 'us' ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-[17px]">
                    {pending === 'us' ? '得点理由' : '失点理由'}を1つ選択
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setPending(null)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 active:scale-95 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pending === 'us' ? (
              // Our Point (We won the rally)
              isOurReceive ? (
                // We were receiving (Opponent Served) -> Side Out
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => submitScore('A')} className="h-24 bg-blue-500 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 active:scale-95 transition shadow-lg shadow-blue-500/30">
                    <span className="text-2xl font-bold font-mono">A</span>
                    <span className="text-[10px] font-bold">Aパスから</span>
                  </button>
                  <button onClick={() => submitScore('B')} className="h-24 bg-white text-slate-700 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition hover:border-blue-200 hover:bg-blue-50/50">
                    <span className="text-2xl font-bold font-mono">B</span>
                    <span className="text-[10px] font-bold">Bパスから</span>
                  </button>
                  <button onClick={() => submitScore('C')} className="h-24 bg-white text-slate-700 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition hover:border-blue-200 hover:bg-blue-50/50">
                    <span className="text-2xl font-bold font-mono">C</span>
                    <span className="text-[10px] font-bold">Cパスから</span>
                  </button>
                  <button onClick={() => submitScore()} className="col-span-2 h-14 bg-white text-slate-700 rounded-xl border-2 border-slate-100 flex items-center justify-center gap-2 active:scale-95 transition hover:bg-slate-50">
                    <span className="text-[13px] font-bold">相手ミス / ダイレクト</span>
                  </button>
                  <button onClick={() => submitScore()} className="h-14 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition hover:bg-slate-200">
                    <span className="text-[13px] font-bold">Skip</span>
                  </button>
                </div>
              ) : (
                // We were serving (We Served) -> Break
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => submitScore()} className="h-14 bg-blue-500 text-white rounded-[20px] flex items-center justify-center text-[14px] font-bold shadow-sm active:scale-95 transition">サービスエース</button>
                  <button onClick={() => submitScore()} className="h-14 bg-white text-slate-700 border-2 border-slate-100 rounded-[20px] flex items-center justify-center text-[14px] font-bold active:scale-95 transition hover:border-blue-200">ブロック</button>
                  <button onClick={() => submitScore()} className="h-14 bg-white text-slate-700 border-2 border-slate-100 rounded-[20px] flex items-center justify-center text-[14px] font-bold active:scale-95 transition hover:border-blue-200">スパイク</button>
                  <button onClick={() => submitScore()} className="h-14 bg-white text-slate-700 border-2 border-slate-100 rounded-[20px] flex items-center justify-center text-[14px] font-bold active:scale-95 transition hover:border-blue-200">相手ミス</button>
                  <button onClick={() => submitScore()} className="col-span-2 h-12 bg-slate-100 text-slate-500 rounded-[16px] flex items-center justify-center text-[13px] font-bold active:scale-95 transition">Skip</button>
                </div>
              )
            ) : (
              // Opponent Point (We lost the rally)
              isOurReceive ? (
                // We were receiving (Opponent Served) -> OPP Break
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => submitScore('Error')} className="col-span-3 h-14 bg-red-500 text-white rounded-[20px] flex items-center justify-center gap-2 active:scale-95 transition shadow-sm">
                    <span className="text-[14px] font-bold">レシーブミス (エースされる)</span>
                  </button>
                  <button onClick={() => submitScore('A')} className="h-20 bg-white text-slate-700 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center gap-1 active:scale-95 transition hover:border-red-200">
                    <span className="text-xl font-bold font-mono">A</span>
                    <span className="text-[10px] font-bold">Aから失点</span>
                  </button>
                  <button onClick={() => submitScore('B')} className="h-20 bg-white text-slate-700 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center gap-1 active:scale-95 transition hover:border-red-200">
                    <span className="text-xl font-bold font-mono">B</span>
                    <span className="text-[10px] font-bold">Bから失点</span>
                  </button>
                  <button onClick={() => submitScore('C')} className="h-20 bg-white text-slate-700 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center gap-1 active:scale-95 transition hover:border-red-200">
                    <span className="text-xl font-bold font-mono">C</span>
                    <span className="text-[10px] font-bold">Cから失点</span>
                  </button>
                  <button onClick={() => submitScore()} className="col-span-3 h-12 bg-slate-100 text-slate-500 rounded-[16px] flex items-center justify-center gap-2 active:scale-95 transition">
                    <span className="text-[13px] font-bold">Skip</span>
                  </button>
                </div>
              ) : (
                // We were serving (We Served) -> Side Out
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => submitScore()} className="h-14 bg-red-500 text-white rounded-[20px] flex items-center justify-center text-[14px] font-bold shadow-sm active:scale-95 transition">サーブミス</button>
                  <button onClick={() => submitScore()} className="h-14 bg-white text-slate-700 border-2 border-slate-100 rounded-[20px] flex items-center justify-center text-[14px] font-bold active:scale-95 transition hover:border-red-200">スパイク失点</button>
                  <button onClick={() => submitScore()} className="h-14 bg-white text-slate-700 border-2 border-slate-100 rounded-[20px] flex items-center justify-center text-[14px] font-bold active:scale-95 transition hover:border-red-200">被ブロック</button>
                  <button onClick={() => submitScore()} className="h-14 bg-white text-slate-700 border-2 border-slate-100 rounded-[20px] flex items-center justify-center text-[14px] font-bold active:scale-95 transition hover:border-red-200">相手の得点</button>
                  <button onClick={() => submitScore()} className="col-span-2 h-12 bg-slate-100 text-slate-500 rounded-[16px] flex items-center justify-center text-[13px] font-bold active:scale-95 transition">Skip</button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* TO Modal */}
      {isTOModalOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-t-[32px] p-6 pb-auto animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-red-100 p-2 rounded-xl text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg text-slate-800">タイムアウト確認項目</h2>
              </div>
              <button 
                onClick={() => setIsTOModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[13px] font-medium text-slate-500 mb-6 leading-relaxed">
              タイムアウトでの指示は、直近のデータに基づき「次に何を変えるか」に絞ることが有効です。
            </p>

            <div className="space-y-3 mb-8">
              {currentConsecutiveLost >= 1 ? (
                <div className={`p-4 rounded-3xl border ${currentConsecutiveLost >= 3 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                  <h4 className={`text-[15px] font-bold mb-2 ${currentConsecutiveLost >= 3 ? 'text-red-600' : 'text-slate-800'}`}>
                    現在 {currentConsecutiveLost} 連続失点中
                  </h4>
                  <p className="text-[12px] font-medium leading-relaxed text-slate-600">
                    現在のローテ（R{state.currentRotation}）からのサイドアウトを切るための具体的な攻撃パターンを指示してください。
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-3xl border bg-emerald-50 border-emerald-200">
                  <h4 className="text-[15px] font-bold text-emerald-800 mb-2">
                    連続失点なし
                  </h4>
                  <p className="text-[12px] font-medium leading-relaxed text-emerald-700">
                    現在サイドアウトは回っています。このタイムアウトでは戦術の共有や相手の対策に集中できます。
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsTOModalOpen(false)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-full active:scale-[0.98] transition-transform text-[16px]"
            >
              確認して閉じる
            </button>
            <div className="h-4" />
          </div>
        </div>
      )}

      {/* Overlay status toast */}
      {shareStatus && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          {shareStatus}
        </div>
      )}

      {/* Sub Modal */}
      {isSubModalOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-t-[32px] p-6 pb-auto animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                  <RefreshCcw className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg text-slate-800">選手交代</h2>
              </div>
              <button 
                onClick={() => setIsSubModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[13px] font-medium text-slate-500 mb-6 leading-relaxed">
              交代する選手を選んでください。スタメンが未設定のためデモ表示です。
            </p>

            <button 
              onClick={() => setIsSubModalOpen(false)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-full active:scale-[0.98] transition-transform text-[16px]"
            >
              交代完了
            </button>
            <div className="h-4" />
          </div>
        </div>
      )}

    </div>
  );
}
