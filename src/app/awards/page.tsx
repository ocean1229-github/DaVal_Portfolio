export default function AwardsPage() {
    return (
        <div className="fade-in space-y-8">
            <section className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">수상이력 및 인증</h2>
                    <p className="text-zinc-400">DaVal의 공식적인 성과와 신뢰 지표를 등록하세요.</p>
                </div>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all">
                    새 이력 등록
                </button>
            </section>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
                {[2024, 2023].map((year) => (
                    <div key={year} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2l-6 6 2 2 4-4 4 4 2-2-6-6z" />
                            </svg>
                        </div>
                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass p-6 rounded-xl shadow-xl">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-lg">{year}년 대한민국 혁신 대상</div>
                                <time className="font-mono text-zinc-500 text-sm">{year}.11</time>
                            </div>
                            <div className="text-sm text-zinc-400">중소벤처기업부 주관 AI 자동화 부문 대상 수상을 통해 기술력을 인정받았습니다.</div>
                            <div className="mt-4 flex gap-2">
                                <button className="text-xs text-zinc-500 hover:text-white transition-colors">수정</button>
                                <div className="h-3 w-px bg-zinc-800"></div>
                                <button className="text-xs text-zinc-500 hover:text-white transition-colors">삭제</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
