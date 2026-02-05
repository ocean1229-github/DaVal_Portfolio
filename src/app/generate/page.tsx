"use client";

import { useState } from 'react';

export default function GeneratePage() {
    const [platform, setPlatform] = useState('wishket');
    const [generatedText, setGeneratedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            const text = `[${platform.toUpperCase()} 지원서 - DaVal AI SaaS]\n\n안녕하세요, DaVal입니다. 귀사의 프로젝트 내용을 검토한 후, 저희의 AI 자동화 역량이 본 프로젝트에 최적화되어 있다고 판단하여 지원합니다.\n\n■ 주요 제안 사항:\n1. DaVal만의 자동화 알고리즘 적용\n2. 주간 단위 개발 진행 상황 공유 및 투명한 소통\n3. 프로젝트 완료 후 3개월 무상 유지보수\n\n■ 관련 포트폴리오:\n- AI 기반 매장 자동화 시스템 (참여율 100%)\n- 데이터 크롤링 및 분석 솔루션 (Vercel 배포 완료)\n\n감사합니다.`;
            setGeneratedText(text);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="fade-in space-y-8 pb-20">
            <section>
                <h2 className="text-3xl font-bold tracking-tight mb-2">지원서 생성기</h2>
                <p className="text-zinc-400">포트폴리오와 회사 정보를 조합하여 플랫폼별 맞춤형 지원서를 생성합니다.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Step 1: Selection */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-[10px] flex items-center justify-center">1</span>
                            대상 플랫폼 선택
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setPlatform('wishket')}
                                className={`py-3 rounded-xl border transition-all text-sm font-semibold ${platform === 'wishket' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-zinc-800 hover:bg-zinc-800'}`}
                            >
                                위시켓
                            </button>
                            <button
                                onClick={() => setPlatform('freemoa')}
                                className={`py-3 rounded-xl border transition-all text-sm font-semibold ${platform === 'freemoa' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-zinc-800 hover:bg-zinc-800'}`}
                            >
                                프리모아
                            </button>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-[10px] flex items-center justify-center">2</span>
                            핵심 포트폴리오 선택
                        </h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <label key={i} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors">
                                    <input type="checkbox" className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-600" />
                                    <span className="text-xs text-zinc-300">AI 자동화 시스템 {i}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                생성 중...
                            </>
                        ) : '지원서 생성하기'}
                    </button>
                </div>

                {/* Step 3: Result */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass p-6 rounded-2xl h-full flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-green-600 text-[10px] flex items-center justify-center">3</span>
                                생성된 지원서 초안
                            </h3>
                            {generatedText && (
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedText);
                                        alert('클립보드에 복사되었습니다!');
                                    }}
                                    className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md text-[10px] text-zinc-300 transition-colors"
                                >
                                    클립보드 복사
                                </button>
                            )}
                        </div>

                        <div className="flex-1 min-h-[400px] p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 font-mono text-sm text-zinc-400 overflow-y-auto whitespace-pre-wrap">
                            {generatedText || (
                                <div className="h-full flex items-center justify-center text-zinc-600 italic">
                                    플랫폼과 포트폴리오를 선택한 후 생성 버튼을 눌러주세요.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
