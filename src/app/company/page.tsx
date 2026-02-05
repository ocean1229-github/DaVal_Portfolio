export default function CompanyPage() {
    return (
        <div className="fade-in space-y-12 pb-20">
            <section>
                <h2 className="text-3xl font-bold tracking-tight mb-2">회사 정보</h2>
                <p className="text-zinc-400">DaVal의 정체성과 핵심 역량을 관리하여 지원서의 신뢰도를 높이세요.</p>
            </section>

            {/* Intro Section */}
            <section className="glass p-8 rounded-2xl space-y-6">
                <h3 className="text-xl font-bold border-b border-zinc-800 pb-4">회사 소개 (Intro)</h3>
                <div className="space-y-4">
                    <textarea
                        rows={5}
                        className="w-full glass px-4 py-3 rounded-xl outline-none border-zinc-800 focus:border-blue-500 transition-colors resize-none"
                        defaultValue="DaVal은 AI 기반 자동화 솔루션을 통해 소상공인과 중소기업의 디지털 전환을 혁신하는 SaaS 기업입니다. 우리는 단순한 도구를 넘어 기업의 성장 파트너로서 최적의 자동화 환경을 구축합니다."
                    ></textarea>
                </div>
            </section>

            {/* Expertise & Strengths */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-8 rounded-2xl space-y-6">
                    <h3 className="text-xl font-bold border-b border-zinc-800 pb-4">주요 업무 분야</h3>
                    <div className="space-y-3">
                        {['웹 서비스 자동화', '데이터 크롤링 및 분석', 'AI 챗봇 솔루션', '업무 프로세스 자동화 (RPA)'].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <input type="text" defaultValue={item} className="bg-transparent outline-none flex-1 text-sm" />
                            </div>
                        ))}
                        <button className="w-full py-2 border border-zinc-800 rounded-lg text-xs text-zinc-500 hover:bg-zinc-800 transition-colors">+ 분야 추가</button>
                    </div>
                </div>

                <div className="glass p-8 rounded-2xl space-y-6">
                    <h3 className="text-xl font-bold border-b border-zinc-800 pb-4">회사의 강점 (USP)</h3>
                    <div className="space-y-3">
                        {['AI 활용 최적화 알고리즘', '신속한 유지보수 및 대응', '합리적인 비용의 SaaS 모델', '사용자 친화적 UI/UX'].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <input type="text" defaultValue={item} className="bg-transparent outline-none flex-1 text-sm" />
                            </div>
                        ))}
                        <button className="w-full py-2 border border-zinc-800 rounded-lg text-xs text-zinc-500 hover:bg-zinc-800 transition-colors">+ 강점 추가</button>
                    </div>
                </div>
            </section>

            {/* Team/Staff */}
            <section className="glass p-8 rounded-2xl space-y-8">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                    <h3 className="text-xl font-bold">회사 구성 및 직원 소개</h3>
                    <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs transition-colors">멤버 추가</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="text-center space-y-3">
                            <div className="w-20 h-20 mx-auto rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-zinc-600">
                                Member
                            </div>
                            <div>
                                <p className="font-bold text-sm">홍길동 {i}</p>
                                <p className="text-xs text-zinc-500">Lead Developer</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex justify-end">
                <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
                    회사 정보 업데이트
                </button>
            </div>
        </div>
    );
}
