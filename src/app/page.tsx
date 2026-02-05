export default function DashboardPage() {
  return (
    <div className="fade-in space-y-8">
      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-2">대시보드</h2>
        <p className="text-zinc-400">DaVal의 포트폴리오 현황과 지원서 생성 상태를 한눈에 확인하세요.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-xl space-y-2">
          <h3 className="text-sm font-medium text-zinc-500">등록된 포트폴리오</h3>
          <p className="text-4xl font-bold">24</p>
          <p className="text-xs text-blue-400">지난 달 대비 +3</p>
        </div>
        <div className="glass p-6 rounded-xl space-y-2">
          <h3 className="text-sm font-medium text-zinc-500">생성된 지원서</h3>
          <p className="text-4xl font-bold">156</p>
          <p className="text-xs text-green-400">성공률 82%</p>
        </div>
        <div className="glass p-6 rounded-xl space-y-2">
          <h3 className="text-sm font-medium text-zinc-500">활성 파트너십</h3>
          <p className="text-4xl font-bold">8</p>
          <p className="text-xs text-zinc-500">위시켓, 프리모아 등</p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">최근 등록된 포트폴리오</h3>
          <button className="text-sm text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">전체 보기</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass glass-hover p-4 rounded-xl flex gap-4 cursor-pointer">
              <div className="w-24 h-24 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600">
                Media
              </div>
              <div className="flex-1">
                <h4 className="font-bold mb-1">AI 기반 매장 자동화 시스템 {i}</h4>
                <p className="text-sm text-zinc-400 line-clamp-2">소상공인을 위한 재고 관리 및 고객 분석 자동화 솔루션입니다.</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-0.5 text-[10px] bg-blue-900/30 text-blue-400 rounded-full border border-blue-500/20">#AI</span>
                  <span className="px-2 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">#Automation</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
