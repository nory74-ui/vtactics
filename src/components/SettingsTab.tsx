import React, { useState } from 'react';
import { Download, Upload, ChevronRight } from 'lucide-react';

export function SettingsTab() {
  const [inputMode, setInputMode] = useState<'detail' | 'simple'>('detail');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f4f7fa] overflow-y-auto w-full relative">
      <div className="p-6 pb-24">
        <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">設定</h1>

        <div className="mb-8">
          <h3 className="text-[15px] font-bold text-slate-700 mb-4 ml-1">試合中の入力モード</h3>
          
          <div className="bg-white rounded-3xl p-2 flex border border-slate-100 shadow-sm mb-4">
            <button
              onClick={() => setInputMode('detail')}
              className={`flex-1 py-3 text-[14px] font-bold rounded-2xl transition ${inputMode === 'detail' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
            >
              詳細 (おすすめ)
            </button>
            <button
              onClick={() => setInputMode('simple')}
              className={`flex-1 py-3 text-[14px] font-bold rounded-2xl transition ${inputMode === 'simple' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}
            >
              簡易 (得点のみ)
            </button>
          </div>

          <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-1">
            {inputMode === 'detail' 
              ? '詳細: 理由 / 打ち手など次のアクションに繋がる情報を入力。' 
              : '簡易: 得点のみ記録し、試合後の振り返りで詳細を追記。'}
          </p>
          <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-1 mt-4">
            試合中の画面を「詳細 / 簡易」どちらで開くかを選びます。
          </p>
        </div>

        <div>
          <h3 className="text-[15px] font-bold text-slate-700 mb-4 ml-1">バックアップ</h3>
          
          <div 
            onClick={() => showToast('バックアップを書き出しました')}
            className="bg-white rounded-3xl p-5 shadow-sm mb-4 flex items-center justify-between active:scale-[0.98] transition cursor-pointer"
          >
            <div className="flex gap-4 items-start">
              <div className="mt-1 shrink-0">
                <Download className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="font-bold text-[16px] text-slate-900">バックアップを<br/>書き出す</h4>
                </div>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed pr-2">
                  試合・選手データをまとめて安全に保存できます。
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
          </div>

          <label className="bg-white rounded-3xl p-5 shadow-sm flex items-center justify-between active:scale-[0.98] transition cursor-pointer">
            <input type="file" className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  showToast('バックアップから復元しました');
                }
                e.target.value = '';
              }}
            />
            <div className="flex gap-4 items-center">
              <div className="shrink-0">
                <Upload className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[16px] text-slate-900">バックアップから復元</h4>
                </div>
                <p className="text-[13px] text-slate-500 font-medium leading-relaxed mt-1">
                  保存したバックアップデータから復元します。
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
          </label>

        </div>

      </div>

      {toastMessage && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
