import React from 'react';
import { MatchState, Rally, Team } from '../types';
import { ChevronLeft, Share, Lightbulb, TrendingUp, Target, RotateCw, ClipboardList, ArrowRight } from 'lucide-react';

interface StatsScreenProps {
  state: MatchState;
}

export function StatsScreen({ state }: StatsScreenProps) {
  const rallies = state.rallies;
  const totalRallies = rallies.length;
  
  const ourServes = rallies.filter(r => r.servingTeam === 'us');
  const breakPoints = ourServes.filter(r => r.winningTeam === 'us').length;
  const breakRate = ourServes.length > 0 ? (breakPoints / ourServes.length) * 100 : 0;

  const opponentServes = rallies.filter(r => r.servingTeam === 'opponent');
  const sideOuts = opponentServes.filter(r => r.winningTeam === 'us').length;
  const sideOutRate = opponentServes.length > 0 ? (sideOuts / opponentServes.length) * 100 : 0;

  // Analysing A/B/C Pass efficiency
  const receiveStats = ['A', 'B', 'C', 'Error'].map(q => {
    const passRallies = opponentServes.filter(r => r.events.some(e => e.skill === 'receive' && e.quality === q));
    const passSideOuts = passRallies.filter(r => r.winningTeam === 'us').length;
    return {
      quality: q,
      count: passRallies.length,
      soRate: passRallies.length > 0 ? (passSideOuts / passRallies.length) * 100 : 0
    };
  });
  
  const hasOppServes = opponentServes.length > 0;

  // Rotation Stats
  const rotationStats = Array.from({ length: 6 }).map((_, i) => {
    const rot = i + 1;
    const rotRallies = rallies.filter(r => r.rotation === rot);
    const rotOppServes = rotRallies.filter(r => r.servingTeam === 'opponent');
    const rotOurServes = rotRallies.filter(r => r.servingTeam === 'us');
    
    const rotSo = rotOppServes.filter(r => r.winningTeam === 'us').length;
    const rotBrk = rotOurServes.filter(r => r.winningTeam === 'us').length;
    
    return {
      rotation: rot,
      soRate: rotOppServes.length > 0 ? Math.round((rotSo / rotOppServes.length) * 100) : 0,
      brkRate: rotOurServes.length > 0 ? Math.round((rotBrk / rotOurServes.length) * 100) : 0,
    };
  });

  let maxConsecutiveLost = 0;
  let currentConsecutiveLost = 0;
  let runsOf3PlusLost = 0;
  let tempLost = 0;
  
  rallies.forEach(r => {
    if (r.winningTeam === 'opponent') {
      currentConsecutiveLost++;
      tempLost++;
      if (currentConsecutiveLost > maxConsecutiveLost) {
        maxConsecutiveLost = currentConsecutiveLost;
      }
    } else {
      if (tempLost >= 3) runsOf3PlusLost++;
      currentConsecutiveLost = 0;
      tempLost = 0;
    }
  });
  if (tempLost >= 3) runsOf3PlusLost++;

  const last5 = rallies.slice(-5);
  const recentPoints = Array.from({ length: 5 }).map((_, i) => {
    const idx = last5.length - 1 - i;
    if (idx >= 0) {
      return last5[idx].winningTeam === 'us' ? 'won' : 'lost';
    }
    return 'none';
  }).reverse();

  return (
    <div className="flex flex-col h-full bg-[#0b0c15] text-slate-200 overflow-y-auto no-scrollbar pb-8 relative">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 pt-6 pb-4 bg-[#0b0c15]/90 backdrop-blur-md">
        <button className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center border border-white/5 text-white">
          <ChevronLeft className="w-6 h-6 ml-1" />
        </button>
        <span className="font-bold text-base tracking-widest text-slate-200">試合分析レポート</span>
        <button className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center border border-white/5 text-slate-300">
          <Share className="w-5 h-5" />
        </button>
      </header>

      <div className="px-4">
        {/* Match Header Info */}
        <div className="text-sm font-bold tracking-tight text-slate-400 mb-1">vs 宝南中学</div>
        <div className="flex items-end gap-3 mb-6">
          <div className="text-[56px] font-mono font-bold text-white tracking-tighter leading-none shadow-sm">{state.ourScore}<span className="text-slate-600 mx-2 text-4xl">-</span>{state.opponentScore}</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400">Set 1</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${state.currentServingTeam === 'us' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
              {state.currentServingTeam === 'us' ? '自チームサーブ' : '相手サーブ'}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-slate-500 ml-1">R{state.currentRotation}</span>
          </div>
        </div>

        {/* Team Analysis First Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <div className="mt-0.5 bg-blue-500/20 p-1.5 rounded-lg">
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-1">相手の前に、まずは自チームの分析から</h3>
            <p className="text-[11px] text-blue-200/80 leading-relaxed">
              相手の分析を行う前に、自チームの「サイドアウト率・ブレイク率・サーブレシーブ」などの基礎数値が目標に達しているかを確認するのが鉄則です。
            </p>
          </div>
        </div>

        {/* AI Insight Box (Vollyze Methodology: 1. Identify where to improve) */}
        <div className="bg-[#2a2417] rounded-3xl p-5 mb-5 border border-[#3e3420] relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-[-20%] w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0" />
            <h3 className="font-bold text-sm tracking-widest text-[#f5dab1]">分析ダッシュボード見解</h3>
          </div>
          <p className="text-sm font-bold text-white mb-4 leading-relaxed relative z-10">
            {sideOutRate < 60 && hasOppServes
              ? 'サイドアウト率が目標値(60%)を下回っています。レセプションの質（A/B/C）が原因か、それともパス返球後の攻撃決定力に課題があるか確認しましょう。'
              : maxConsecutiveLost >= 3 
              ? `連続失点が課題です。現在最大${maxConsecutiveLost}連続失点が発生中。特定のローテーションで詰まっている可能性があります。`
              : 'サイドアウト率は目標をクリアしています。ブレイクポイント（サーブからの連続得点）を増やすための戦略を確認しましょう。'
            }
          </p>
          <div className="pt-3 border-t border-[#3e3420]/60 relative z-10 flex gap-4 text-xs font-bold font-mono tracking-widest justify-around">
            <div className="flex flex-col items-center">
              <span className="text-slate-400 text-[10px] mb-1">SO</span>
              <span className={sideOutRate >= 60 ? "text-emerald-400" : "text-yellow-400"}>{Math.round(sideOutRate)}%</span>
            </div>
            <div className="w-[1px] bg-[#3e3420]/60" />
            <div className="flex flex-col items-center">
              <span className="text-slate-400 text-[10px] mb-1">BRK</span>
              <span className={breakRate >= 30 ? "text-emerald-400" : "text-slate-300"}>{Math.round(breakRate)}%</span>
            </div>
            <div className="w-[1px] bg-[#3e3420]/60" />
            <div className="flex flex-col items-center">
              <span className="text-slate-400 text-[10px] mb-1">直近5本得点</span>
              <span className="text-blue-400">{last5.filter(x => x.winningTeam === 'us').length}点</span>
            </div>
          </div>
        </div>

        {/* 1. Vollyze Core: Reception -> Attack efficiency (パス別サイドアウト分析) */}
        <div className="bg-[#1f2231] rounded-3xl p-5 mb-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm text-white tracking-widest">自チームのレセプション・SO分析</h3>
          </div>
          <p className="text-[10px] text-slate-400 mb-4 font-bold tracking-widest">パスの質ごとのサイドアウト率（自チームの攻撃力）を確認</p>
          
          <div className="space-y-3">
            {receiveStats.map((stat) => (
              <div key={stat.quality} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border
                  ${stat.quality === 'A' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 
                    stat.quality === 'B' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                    stat.quality === 'C' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 
                    'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                  {stat.quality}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-bold text-slate-300">{Math.round(stat.soRate)}% <span className="text-[10px] text-slate-500 font-normal ml-1">SO</span></span>
                    <span className="text-[10px] font-mono text-slate-500">{stat.count}本</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        stat.quality === 'A' ? 'bg-blue-500' : 
                        stat.quality === 'B' ? 'bg-emerald-500' : 
                        stat.quality === 'C' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${stat.soRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <h4 className="text-[11px] font-bold text-white mb-2 flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-yellow-500" />サーブレシーブ分析の活用法</h4>
            <p className="text-[10px] text-slate-300 leading-relaxed font-medium relative z-10">
              Aパス率だけでなく<strong className="text-white">「Aパス後に得点できたか」</strong>が重要です。<br/>
              Aパス率が高くても攻撃が決まらない場合は、セッターとの接続や攻撃選択に課題があります。逆に数字が低くても失点が少ない場合は、<strong className="text-emerald-400">二段トスからの切り返し（トランジション）</strong>が機能している証拠です。誰がどのゾーンで狙われたか（前衛の助走やセッターの移動を止められていないか）も合わせて確認しましょう。
            </p>
          </div>
        </div>

        {/* 2. Vollyze Core: Rotation Analysis (ローテごとの弱点分析) */}
        <div className="bg-[#1f2231] rounded-3xl p-5 mb-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-2 mb-5">
            <RotateCw className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white tracking-widest">自チームのローテーション別実績</h3>
          </div>
          
          <div className="grid grid-cols-6 gap-1 border-b border-white/5 pb-2 mb-3">
            {['R1', 'R2', 'R3', 'R4', 'R5', 'R6'].map(r => (
              <div key={r} className="text-center text-[10px] font-bold text-slate-500 font-mono">{r}</div>
            ))}
          </div>
          
          <div className="mb-4">
            <div className="text-[10px] font-bold text-slate-400 mb-2 mt-1">サイドアウト率 (SO%)</div>
            <div className="grid grid-cols-6 gap-1 h-24 items-end">
              {rotationStats.map((r, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-mono font-bold text-blue-200 opacity-60 group-hover:opacity-100 transition-opacity">{r.soRate}%</span>
                  <div className="w-full bg-blue-500/80 rounded-t-sm transition-all duration-500 hover:bg-blue-400" style={{ height: `${r.soRate}%`, minHeight: r.soRate > 0 ? '4px' : '0' }}></div>
                </div>
              ))}
            </div>
          </div>

          <div>
             <div className="text-[10px] font-bold text-slate-400 mb-2 mt-2">ブレイク率 (BRK%)</div>
             <div className="grid grid-cols-6 gap-1 h-16 items-end">
               {rotationStats.map((r, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-mono font-bold text-emerald-200 opacity-60 group-hover:opacity-100 transition-opacity">{r.brkRate}%</span>
                  <div className="w-full bg-emerald-500/80 rounded-t-sm transition-all duration-500 hover:bg-emerald-400" style={{ height: `${r.brkRate}%`, minHeight: r.brkRate > 0 ? '4px' : '0' }}></div>
                </div>
               ))}
             </div>
          </div>

          <div className="mt-5 p-3.5 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            <h4 className="text-[11px] font-bold text-white mb-2 flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-yellow-500" />ローテーション分析の活用法</h4>
            <p className="text-[10px] text-slate-300 leading-relaxed font-medium relative z-10">
              総得失点だけでなく<strong className="text-white">「どの並びのときに苦しくなるか」</strong>を見つけます。<br/>
              タイムアウト時は「R5が弱い」という結果の指摘ではなく、その並びの課題（前衛枚数やセッター位置）を踏まえ、<strong className="text-emerald-400">「1本目の返球を高く上げ、ライト奥への二段を準備しよう」</strong>のように、具体的な次の1プレーへ落とし込みましょう。
            </p>
          </div>
        </div>

        {/* 3. Vollyze Core: Match Record -> Practice Menu (試合後3分で練習を決める) */}
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-5 mb-8 shadow-lg border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm text-white tracking-widest">次の練習テーマを決定</h3>
            </div>
            <span className="text-[9px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
              STEP 3
            </span>
          </div>
          
          <p className="text-[11px] text-blue-100/70 mb-4 leading-relaxed font-medium">
            バレー分析アプリの最大の目的は、<strong className="text-white">「試合後3分で次の練習テーマを1つ決める」</strong>ことです。本日のデータに基づき、以下の練習を推奨します。
          </p>

          <div className="bg-[#0b0c15]/60 rounded-2xl p-4 border border-white/5 space-y-3">
            {sideOutRate < 60 && hasOppServes ? (
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">【最優先】A・Bパスからの決定率向上</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    サイドアウト率が60%を下回っています。レセプション練習に加え、Bパスからの攻撃（ライト・バックアタック）の連携を次回のメイン練習に設定しましょう。
                  </p>
                </div>
              </div>
            ) : maxConsecutiveLost >= 3 ? (
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">【最優先】連続失点のカット（ローテーション対策）</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    最大{maxConsecutiveLost}連続失点が発生しました。特定のローテで詰まる傾向があるため、当該ローテからのサイドアウト練習を重点的に行います。
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">【推奨】トランジション・アタック（切り返し）の強化</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    サイドアウトは安定しています。さらなる得点力向上のため、ディグ（スパイクレシーブ）からのコンビネーション練習を次回のテーマに設定しましょう。
                  </p>
                </div>
              </div>
            )}
            
            <button className="w-full mt-2 bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
              このテーマを練習メニューに登録
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
