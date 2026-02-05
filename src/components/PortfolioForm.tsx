"use client";

import { useState } from 'react';

export default function PortfolioForm() {
    return (
        <div className="glass p-8 rounded-2xl max-w-4xl mx-auto space-y-8">
            <div className="border-b border-zinc-800 pb-4">
                <h3 className="text-xl font-bold">포트폴리오 등록</h3>
                <p className="text-sm text-zinc-500">지원서에 활용될 포트폴리오의 상세 정보를 입력해 주세요.</p>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-zinc-400">제목</label>
                    <input type="text" placeholder="프로젝트 명칭을 입력하세요" className="w-full glass px-4 py-3 rounded-xl outline-none border-zinc-800 focus:border-blue-500 transition-colors" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">수행 기간</label>
                    <div className="flex gap-2">
                        <input type="month" className="flex-1 glass px-4 py-2 rounded-xl outline-none border-zinc-800" />
                        <span className="flex items-center text-zinc-600">~</span>
                        <input type="month" className="flex-1 glass px-4 py-2 rounded-xl outline-none border-zinc-800" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">참여분야 / 참여율</label>
                    <div className="flex gap-2">
                        <input type="text" placeholder="예: Backend" className="flex-1 glass px-4 py-2 rounded-xl outline-none border-zinc-800" />
                        <input type="number" placeholder="100%" className="w-24 glass px-4 py-2 rounded-xl outline-none border-zinc-800" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">개발분류</label>
                    <select className="w-full glass px-4 py-2 rounded-xl outline-none border-zinc-800">
                        <option>웹 자동화</option>
                        <option>데이터 수집/분석</option>
                        <option>AI 솔루션</option>
                        <option>기타</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">카테고리</label>
                    <input type="text" placeholder="예: 이커머스, 핀테크" className="w-full glass px-4 py-2 rounded-xl outline-none border-zinc-800" />
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-zinc-400">내용 요약</label>
                    <textarea rows={4} placeholder="프로젝트의 주요 성과와 사용 기술을 요약해주세요." className="w-full glass px-4 py-3 rounded-xl outline-none border-zinc-800 focus:border-blue-500 transition-colors resize-none"></textarea>
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-zinc-400">포트폴리오 업로드 (이미지/영상)</label>
                    <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer">
                        <p className="text-sm text-zinc-500">파일을 드래그하거나 클릭하여 업로드하세요 (Max 50MB)</p>
                    </div>
                </div>

                <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-zinc-400">태그</label>
                    <input type="text" placeholder="엔터로 태그를 구분하세요 (#Python #Automation)" className="w-full glass px-4 py-2 rounded-xl outline-none border-zinc-800" />
                </div>

                <div className="col-span-2 pt-4 flex gap-4">
                    <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">저장하기</button>
                    <button type="button" className="px-8 py-4 glass border border-zinc-800 hover:bg-zinc-800 rounded-xl font-bold transition-all">취소</button>
                </div>
            </form>
        </div>
    );
}
