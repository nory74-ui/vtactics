import React, { useState } from 'react';
import { ChevronDown, MapPin, Users, X, Check } from 'lucide-react';

interface MatchSetupModalProps {
  onClose: () => void;
  onStart: () => void;
  onGoToMembers?: () => void;
}

const SAMPLE_MEMBERS = [
  { id: '1', number: 1, name: '佐伯 悠', position: 'S' },
  { id: '2', number: 2, name: '三浦 亮', position: 'OH' },
  { id: '3', number: 3, name: '高梨 陸', position: 'OH' },
  { id: '4', number: 4, name: '森 大翔', position: 'MB' },
  { id: '5', number: 5, name: '藤井 翔太', position: 'OP' },
  { id: '6', number: 6, name: '長谷川 碧', position: 'MB' },
];

export function MatchSetupModal({ onClose, onStart, onGoToMembers }: MatchSetupModalProps) {
  const [rotationMode, setRotationMode] = useState<'rotation' | 'free'>('rotation');
  const [usePlayerMemo, setUsePlayerMemo] = useState(false);
  const [is25Points, setIs25Points] = useState(true);
  const [venue, setVenue] = useState('プリセット');
  const [matchType, setMatchType] = useState('大会');
  const [setCount, setSetCount] = useState('3セットマッチ');
  const [date, setDate] = useState('2026-06-16');
  const [time, setTime] = useState('20:00');
  
  const [isStarterModalOpen, setIsStarterModalOpen] = useState(false);
  const [selectedStarters, setSelectedStarters] = useState<string[]>([]);

  const toggleStarter = (id: string) => {
    setSelectedStarters(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleStartWithStarters = () => {
    setIsStarterModalOpen(false);
    onStart();
  };

  return (
    <>
    <div className="fixed inset-0 bg-[#f4f7fa] z-40 flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 px-6 pt-12 shrink-0">
        <button 
          onClick={onClose}
          className="bg-white px-5 py-2.5 rounded-full text-[15px] font-bold text-slate-700 shadow-sm active:scale-95 transition"
        >
          キャンセル
        </button>
        <h2 className="font-bold text-[17px] text-slate-900">新規試合</h2>
        <div className="w-[100px]" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {/* Teams */}
        <h3 className="text-[13px] font-bold text-slate-500 mb-2 ml-1">チーム</h3>
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-8">
          <div className="flex items-center justify-between px-5 min-h-[60px] border-b border-slate-100 relative">
            <span className="text-[15px] font-bold text-slate-700">チーム</span>
            <span className="text-[15px] font-bold text-slate-900">自チーム</span>
          </div>
          <div className="flex items-center justify-between px-5 min-h-[60px] relative">
            <span className="text-[15px] font-bold text-slate-700">対戦相手</span>
            <input 
              type="text" 
              placeholder="チーム名" 
              className="text-right text-[15px] font-medium text-slate-400 focus:outline-none" 
            />
          </div>
        </div>

        {/* Match Info */}
        <h3 className="text-[13px] font-bold text-slate-500 mb-2 ml-1">試合情報</h3>
        <div className="bg-white rounded-[32px] p-2 shadow-sm mb-8">
          <div className="flex items-center justify-between px-3 py-2 mb-2">
            <span className="text-[15px] font-bold text-slate-700 ml-1">日時</span>
            <div className="flex gap-2">
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="bg-slate-100 px-3 py-1.5 rounded-xl text-[14px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                className="bg-slate-100 px-3 py-1.5 rounded-xl text-[14px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2 mb-4">
            <span className="text-[15px] font-bold text-slate-700 ml-1">会場</span>
            <div className="flex gap-2 items-center">
              <span className="text-[15px] font-medium text-slate-400">会場名</span>
              <label className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1 relative cursor-pointer overflow-hidden">
                <MapPin className="w-3.5 h-3.5" />
                {venue}
                <select value={venue} onChange={e => setVenue(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                  <option value="プリセット">プリセット</option>
                  <option value="ホーム体育館">ホーム体育館</option>
                  <option value="アウェイ体育館">アウェイ体育館</option>
                  <option value="〇〇市民体育館">〇〇市民体育館</option>
                </select>
              </label>
            </div>
          </div>

          <div className="bg-slate-100 p-1 flex rounded-[24px] mb-3 mx-1">
            <button 
              onClick={() => setRotationMode('rotation')}
              className={`flex-1 py-3 text-[14px] font-bold rounded-[20px] transition ${rotationMode === 'rotation' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              ローテーションあり
            </button>
            <button 
              onClick={() => setRotationMode('free')}
              className={`flex-1 py-3 text-[14px] font-bold rounded-[20px] transition ${rotationMode === 'free' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              フリーポジション制
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed px-3 mb-6">
            <span className="inline-block border border-slate-300 w-3 h-3 rounded-full mr-1 flex items-center justify-center">
              <span className="block w-1.5 h-1.5 border-t border-r border-slate-500 rotate-45 transform origin-center"></span>
            </span> {/* simple mock icon */}
            サイドアウトでローテーションを進め、ローテ別分析も使います。
          </p>

          <div className="flex items-center justify-between px-3 mb-2">
            <div>
              <span className="text-[15px] font-bold text-slate-700 mb-1 block">選手メモを使う</span>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-[240px]">
                得点・失点理由のあとに、関わった選手を1人だけ任意で残せます。入力しなくても記録は完了できます。
              </p>
            </div>
            <button 
              onClick={() => setUsePlayerMemo(!usePlayerMemo)}
              className={`w-[52px] h-8 rounded-full p-1 transition-colors shrink-0 ${usePlayerMemo ? 'bg-blue-500' : 'bg-slate-200'}`}
            >
              <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${usePlayerMemo ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="w-full h-[1px] bg-slate-100 my-4" />

          <label className="flex items-center gap-1 text-blue-600 font-bold px-3 py-2 text-[15px] relative cursor-pointer overflow-hidden w-fit">
            {matchType} <ChevronDown className="w-5 h-5 opacity-70" />
            <select value={matchType} onChange={e => setMatchType(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
              <option value="大会">大会</option>
              <option value="練習試合">練習試合</option>
              <option value="紅白戦">紅白戦</option>
            </select>
          </label>

          <div className="w-full h-[1px] bg-slate-100 my-4" />

          <label className="flex items-center gap-1 text-blue-600 font-bold px-3 py-2 text-[15px] mb-4 relative cursor-pointer overflow-hidden w-fit">
            {setCount} <ChevronDown className="w-5 h-5 opacity-70" />
            <select value={setCount} onChange={e => setSetCount(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
              <option value="1セットマッチ">1セットマッチ</option>
              <option value="3セットマッチ">3セットマッチ</option>
              <option value="5セットマッチ">5セットマッチ</option>
            </select>
          </label>

          <div className="bg-slate-100 p-1 flex rounded-[24px] mb-3 mx-1">
            <button 
              onClick={() => setIs25Points(true)}
              className={`flex-1 py-3 text-[14px] font-bold rounded-[20px] transition ${is25Points ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              25点
            </button>
            <button 
              onClick={() => setIs25Points(false)}
              className={`flex-1 py-3 text-[14px] font-bold rounded-[20px] transition ${!is25Points ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              21点
            </button>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed px-3 mb-2">
            通常セットの終了点です。小学生・ヤング大会・地域ルールで21点制を使う場合は21点を選んでください。
          </p>
        </div>

        <p className="text-[11px] text-slate-500 font-medium leading-relaxed px-2 mb-8">
          日時以外は未入力でも開始できます。会場右の「プリセット」をタップで選択、長押しで編集できます。
        </p>

        {/* Start Methods */}
        <h3 className="text-[13px] font-bold text-slate-500 mb-2 ml-1">開始方法</h3>
        <div className="bg-white rounded-[32px] p-2 shadow-sm mb-6 flex flex-col gap-2">
          
          <button 
            onClick={onStart}
            className="w-full bg-blue-600 text-white font-bold text-[17px] py-4 rounded-[24px] flex justify-center items-center gap-2 active:scale-[0.98] transition-transform shadow-sm"
          >
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent" />
            このまま記録を始める
          </button>

          <div 
            onClick={() => setIsStarterModalOpen(true)}
            className="p-4 flex items-center justify-between border-b border-slate-100 active:bg-slate-50 transition cursor-pointer"
          >
            <div>
              <h4 className="font-bold text-[16px] text-slate-900 mb-1">スタメンを先に決める</h4>
              <p className="text-[13px] font-bold text-slate-700 mb-1">(任意)</p>
              <p className="text-[11px] font-medium text-slate-400">メンバーを事前に選択して開始します</p>
            </div>
            <div className="w-[72px] h-[72px] bg-slate-100 rounded-2xl flex items-center justify-center">
               <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="p-4 flex items-start gap-3">
             <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-4 h-4 text-blue-600" />
             </div>
             <div>
               <p className="text-[13px] font-bold text-slate-500 leading-relaxed mb-2">
                 先にメンバーを登録しておくと、スタメンや選手指定がスムーズです
               </p>
               <button onClick={onGoToMembers} className="text-blue-600 font-bold text-[13px] flex items-center gap-1 active:opacity-70 transition">
                 <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center relative">
                   <div className="w-2.5 h-[2px] bg-blue-600 absolute" />
                   <div className="h-2.5 w-[2px] bg-blue-600 absolute" />
                 </div>
                 メンバーを追加
               </button>
             </div>
          </div>
        </div>

        <p className="text-[12px] text-slate-500 font-medium leading-relaxed px-2 pb-8">
          作成後はすぐに記録画面へ進めます。出場選手は必要になったタイミングで交代・選手指定が可能です。
        </p>

      </div>
    </div>
    
    {isStarterModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-t-[32px] p-6 pb-auto max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg text-slate-800">スタメン設定</h2>
              </div>
              <button 
                onClick={() => setIsStarterModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[13px] font-medium text-slate-500 mb-4 leading-relaxed shrink-0">
              出場する選手を選んでください。({selectedStarters.length} / 6名)
            </p>

            <div className="flex-1 overflow-y-auto mb-6 bg-slate-50 rounded-2xl p-2">
              {SAMPLE_MEMBERS.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => toggleStarter(m.id)}
                  className={`flex items-center p-3 mb-2 rounded-xl cursor-pointer transition ${selectedStarters.includes(m.id) ? 'bg-blue-100 border border-blue-200 shadow-sm' : 'bg-white border border-slate-100 hover:border-blue-200'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm font-mono shrink-0 shadow-sm ${selectedStarters.includes(m.id) ? 'bg-blue-500' : 'bg-slate-300'}`}>
                    #{m.number}
                  </div>
                  <div className="flex-1 px-3">
                    <h3 className="font-bold text-slate-800 text-[15px]">{m.name}</h3>
                    <span className="text-[11px] font-bold text-slate-500">{m.position}</span>
                  </div>
                  {selectedStarters.includes(m.id) && (
                     <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={handleStartWithStarters}
              className={`w-full font-bold py-4 rounded-full transition-transform text-[16px] shrink-0 ${selectedStarters.length > 0 ? 'bg-blue-600 text-white active:scale-[0.98]' : 'bg-slate-200 text-slate-400'}`}
            >
              スタメンを決定して開始
            </button>
            <div className="h-4 shrink-0" />
          </div>
        </div>
      )}
    </>
  );
}