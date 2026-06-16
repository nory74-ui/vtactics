import React, { useState } from 'react';
import { Search, FileText, Plus, ChevronRight, X } from 'lucide-react';
import { Member } from '../types';

const SAMPLE_MEMBERS: Member[] = [
  { id: '1', number: 1, name: '佐伯 悠', position: 'S', category: '高校生 / 3年', isLibero: false, tag: 'サンプル' },
  { id: '2', number: 2, name: '三浦 亮', position: 'OH', category: '高校生 / 3年', isLibero: false, tag: 'サンプル' },
  { id: '3', number: 3, name: '高梨 陸', position: 'OH', category: '高校生 / 3年', isLibero: false, tag: 'サンプル' },
  { id: '4', number: 4, name: '森 大翔', position: 'MB', category: '高校生 / 2年', isLibero: false, tag: 'サンプル' },
  { id: '5', number: 5, name: '藤井 翔太', position: 'OP', category: '高校生 / 2年', isLibero: false, tag: 'サンプル' },
  { id: '6', number: 6, name: '長谷川 碧', position: 'MB', category: '高校生 / 2年', isLibero: false, tag: 'サンプル' },
];

export function MembersTab() {
  const [members, setMembers] = useState<Member[]>(SAMPLE_MEMBERS);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBatchAddModalOpen, setIsBatchAddModalOpen] = useState(false);
  const [lineShareState, setLineShareState] = useState<'idle' | 'loading' | 'done'>('idle');

  const filteredMembers = members.filter(m => 
    m.name.includes(search) || m.number.toString().includes(search)
  );

  const handleLineShare = () => {
    setLineShareState('loading');
    setTimeout(() => {
      setLineShareState('done');
      setTimeout(() => setLineShareState('idle'), 3000);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa] overflow-y-auto w-full relative">
      <div className="p-6 pb-24">
        <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">メンバー</h1>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="名前・番号で検索" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 bg-slate-200/50 rounded-full pl-12 pr-4 text-[15px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-shadow"
          />
        </div>

        {/* Batch Add */}
        <div 
          onClick={() => setIsBatchAddModalOpen(true)}
          className="bg-white rounded-3xl p-5 mb-8 shadow-sm flex items-center gap-4 active:scale-[0.98] transition cursor-pointer"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-[15px] mb-1">名簿をまとめて追加</h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              表に直接入力、またはスプレッドシートから貼り付けて30名以上も登録できます。
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </div>

        {/* List */}
        <div>
          <h2 className="text-slate-500 font-bold text-[15px] mb-4 ml-1 tracking-wider">
            アクティブ ({members.length}名)
          </h2>
          
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm">
            {filteredMembers.map((m, i) => (
              <div key={m.id} className="relative">
                <div className="flex items-center p-4 gap-4 bg-white active:bg-slate-50 transition cursor-pointer">
                  {/* Number Badge */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg font-mono shrink-0 shadow-sm
                    ${i % 6 === 0 ? 'bg-purple-500' : 
                      i % 6 === 1 ? 'bg-blue-500' : 
                      i % 6 === 2 ? 'bg-sky-500' : 
                      i % 6 === 3 ? 'bg-orange-500' : 
                      i % 6 === 4 ? 'bg-red-500' : 'bg-amber-500'}`}
                  >
                    #{m.number}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-[17px] mb-1">{m.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-slate-400 w-6">{m.position}</span>
                      {m.tag && (
                        <span className="bg-blue-50 text-blue-500 px-2.5 py-0.5 rounded-full">
                          {m.tag}
                        </span>
                      )}
                      <span className="text-slate-400 font-medium">{m.category}</span>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
                {i < filteredMembers.length - 1 && (
                  <div className="absolute bottom-0 right-0 left-[76px] h-[1px] bg-slate-100" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-[88px] right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-transform z-10"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddMemberModal onClose={() => setIsAddModalOpen(false)} onAdd={(m) => {
          setMembers([...members, m]);
          setIsAddModalOpen(false);
        }} />
      )}

      {/* Batch Add Modal */}
      {isBatchAddModalOpen && (
        <BatchAddModal onClose={() => setIsBatchAddModalOpen(false)} onAdd={(newMembers) => {
          setMembers([...members, ...newMembers]);
          setIsBatchAddModalOpen(false);
        }} />
      )}
    </div>
  );
}

function BatchAddModal({ onClose, onAdd }: { onClose: () => void, onAdd: (m: Member[]) => void }) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const newMembers: Member[] = lines.map((line, i) => {
      let parts = line.split('\t');
      if (parts.length === 1) parts = line.split(',');
      if (parts.length === 1) parts = line.split(/ +/);
      if (parts.length === 1) parts = line.split(/　+/);
      
      parts = parts.map(p => p.trim()).filter(p => p);

      let number: number | '' = '';
      let name = '';
      let position = '';
      let category = '';

      if (parts.length === 1) {
        name = parts[0];
      } else {
        const firstAsNum = parseInt(parts[0], 10);
        if (!isNaN(firstAsNum)) {
          number = firstAsNum;
          name = parts[1] || '';
          position = parts[2] || '';
          category = parts.slice(3).join(' ') || '';
        } else {
          name = parts[0];
          position = parts[1] || '';
          category = parts.slice(2).join(' ') || '';
        }
      }

      return {
        id: Math.random().toString(36).substring(7) + i,
        name: name || `選手${i+1}`,
        number: number,
        position: position,
        category: category,
        isLibero: position.toUpperCase() === 'L' || position === 'リベロ',
      };
    });
    onAdd(newMembers);
  };

  return (
    <div className="fixed inset-0 bg-[#f4f7fa] z-50 flex flex-col animate-in slide-in-from-bottom-full duration-300">
      <div className="flex items-center justify-between p-4 px-6 pt-12 shrink-0">
        <button 
          onClick={onClose}
          className="bg-white px-5 py-2.5 rounded-full text-[15px] font-bold text-slate-700 shadow-sm active:scale-95 transition"
        >
          キャンセル
        </button>
        <h2 className="font-bold text-[17px] text-slate-900">まとめて追加</h2>
        <button 
          onClick={handleAdd}
          className={`px-5 py-2.5 rounded-full text-[15px] font-bold shadow-sm transition ${text.trim() ? 'bg-white text-blue-600 active:scale-95' : 'bg-white/50 text-slate-400'}`}
          disabled={!text.trim()}
        >
          追加
        </button>
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-24 flex flex-col">
        <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-4 px-1">
          スプレッドシートやエクセルからコピーした表（番号・名前・ポジションなど）をそのまま貼り付けられます。改行区切りでも登録可能です。
        </p>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="例:&#13;&#10;1  佐伯 悠  S  高校生/3年&#13;&#10;2  三浦 亮  OH 高校生/3年"
          className="flex-1 w-full bg-white rounded-3xl p-5 text-[15px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none shadow-sm resize-none"
        />
      </div>
    </div>
  );
}

function AddMemberModal({ onClose, onAdd }: { onClose: () => void, onAdd: (m: Member) => void }) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [position, setPosition] = useState('未設定');
  const [category, setCategory] = useState('未設定');
  const [grade, setGrade] = useState('未設定');
  const [isLibero, setIsLibero] = useState(false);

  return (
    <div className="fixed inset-0 bg-[#f4f7fa] z-50 flex flex-col animate-in slide-in-from-bottom-full duration-300">
      <div className="flex items-center justify-between p-4 px-6 pt-12 shrink-0">
        <button 
          onClick={onClose}
          className="bg-white px-5 py-2.5 rounded-full text-[15px] font-bold text-slate-700 shadow-sm active:scale-95 transition"
        >
          キャンセル
        </button>
        <h2 className="font-bold text-[17px] text-slate-900">メンバー追加</h2>
        <button 
          onClick={() => {
            if (name) {
              onAdd({
                id: Math.random().toString(),
                name,
                number: number ? parseInt(number, 10) : '',
                position: position === '未設定' ? '' : position,
                category: grade !== '未設定' ? `${category} / ${grade}` : category,
                isLibero
              });
            }
          }}
          className={`px-5 py-2.5 rounded-full text-[15px] font-bold shadow-sm transition ${name ? 'bg-white text-blue-600 active:scale-95' : 'bg-white/50 text-slate-400'}`}
          disabled={!name}
        >
          追加
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <h3 className="text-[13px] font-bold text-slate-500 mb-2 ml-1">基本情報</h3>
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-2">
          <div className="flex items-center px-5 min-h-[60px] border-b border-slate-100 relative">
            <span className="w-[84px] text-[15px] font-bold text-slate-700 shrink-0">名前</span>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="flex-1 h-full py-4 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none" 
            />
          </div>
          <div className="flex items-center px-5 min-h-[60px] relative">
            <span className="w-[84px] text-[15px] font-bold text-slate-700 shrink-0">背番号</span>
            <input 
              type="number" 
              value={number}
              onChange={e => setNumber(e.target.value)}
              placeholder="番号"
              className="flex-1 h-full py-4 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none text-right" 
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed font-medium px-2 mb-8">
          必須は名前だけです。背番号やポジションは後から設定できます。
        </p>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-6">
          <label className="flex items-center justify-between px-5 min-h-[60px] border-b border-slate-100 active:bg-slate-50 transition relative">
            <span className="text-[15px] font-bold text-slate-700">ポジション</span>
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-medium text-slate-500">{position}</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            <select value={position} onChange={e => setPosition(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
              <option value="未設定">未設定</option>
              <option value="OH">OH (アウトサイドヒッター)</option>
              <option value="MB">MB (ミドルブロッカー)</option>
              <option value="OP">OP (オポジット)</option>
              <option value="S">S (セッター)</option>
              <option value="L">L (リベロ)</option>
            </select>
          </label>
          <label className="flex items-center justify-between px-5 min-h-[60px] border-b border-slate-100 active:bg-slate-50 transition relative">
            <span className="text-[15px] font-bold text-slate-700">年代・カテゴリ</span>
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-medium text-slate-500">{category}</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
              <option value="未設定">未設定</option>
              <option value="小学生">小学生</option>
              <option value="中学生">中学生</option>
              <option value="高校生">高校生</option>
              <option value="大学生">大学生</option>
              <option value="社会人">社会人</option>
              <option value="ママさん">ママさん</option>
            </select>
          </label>
          <label className="flex items-center justify-between px-5 min-h-[60px] border-b border-slate-100 active:bg-slate-50 transition relative">
            <span className="text-[15px] font-bold text-slate-700">学年 (必要なら)</span>
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-medium text-slate-500">{grade}</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            <select value={grade} onChange={e => setGrade(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
              <option value="未設定">未設定</option>
              <option value="1年">1年</option>
              <option value="2年">2年</option>
              <option value="3年">3年</option>
              <option value="4年">4年</option>
            </select>
          </label>
          <div className="flex items-center justify-between px-5 min-h-[60px] active:bg-slate-50 transition">
            <span className="text-[15px] font-bold text-slate-700">リベロ</span>
            <button 
              onClick={() => setIsLibero(!isLibero)}
              className={`w-[52px] h-8 rounded-full p-1 transition-colors ${isLibero ? 'bg-blue-500' : 'bg-slate-200'}`}
            >
              <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${isLibero ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {!name && (
          <div className="bg-white rounded-3xl p-5 shadow-sm text-center">
            <span className="text-[13px] font-bold text-orange-500">名前を入力してください。</span>
          </div>
        )}
      </div>
    </div>
  );
}
