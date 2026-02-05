export default function PortfolioPage() {
    return (
        <div className="fade-in space-y-8">
            <section className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">포트폴리오 관리</h2>
                    <p className="text-zinc-400">DaVal의 성공적인 프로젝트들을 등록하고 관리하세요.</p>
                </div>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all">
                    새 포트폴리오 추가
                </button>
            </section>

            {/* Filters */}
            <div className="flex gap-4">
                <select className="glass px-4 py-2 rounded-lg text-sm outline-none border-zinc-800">
                    <option>모든 개발분류</option>
                    <option>웹 자동화</option>
                    <option>데이터 분석</option>
                    <option>AI 모델링</option>
                </select>
                <input
                    type="text"
                    placeholder="태그 또는 제목 검색..."
                    className="glass px-4 py-2 rounded-lg text-sm outline-none border-zinc-800 flex-1"
                />
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass glass-hover rounded-xl overflow-hidden group">
                        <div className="aspect-video bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-700 transition-colors">
                            Thumbnail / Video
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg line-clamp-1">자동화 플랫폼 구축 프로젝트 {i}</h4>
                                <span className="text-[10px] px-2 py-0.5 border border-zinc-700 rounded-full text-zinc-500">2024.01 - 2024.03</span>
                            </div>
                            <p className="text-sm text-zinc-400 line-clamp-2">
                                위시켓 지원을 위한 고퀄리티 자동화 시스템 구축 사례입니다. 참여율 100%를 달성했습니다.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-0.5 text-[10px] bg-blue-900/20 text-blue-400 rounded-full">#React</span>
                                <span className="px-2 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded-full">#Python</span>
                            </div>
                            <div className="pt-4 flex gap-2">
                                <button className="flex-1 py-2 text-xs border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">수정</button>
                                <button className="flex-1 py-2 text-xs border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors">상세보기</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
