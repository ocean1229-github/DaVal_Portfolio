# DaVal 포트폴리오 관리 사이트 개발 계획 (Updated)

이 문서는 DaVal의 포트폴리오 관리 및 파트너(위시켓, 프리모아 등) 지원을 위한 사이트 개발 계획을 담고 있습니다.

## 1. 개요
- **목표**: 특정 구글 계정으로만 접근 가능한 대시보드를 통해 포트폴리오를 관리하고, 외부 플랫폼 지원 시 활용할 수 있는 콘텐츠 관리 시스템 구축.
- **핵심 가치**: 프리미엄 디자인, 효율적인 데이터 관리, 외부 지원 프로세스 단축.

## 2. 기술 스택
- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **인증**: NextAuth.js (Google OAuth) + Email Whitelist
- **데이터베이스**: Notion API (Data)
- **이미지 스토리지**: Supabase Storage (Public Bucket)
- **스타일링**: Vanilla CSS (CSS Modules & Variables)
- **아이콘**: Lucide React
- **배포**: Vercel

## 3. 주요 기능 계획

### 3.1. 인증 및 권한 (Auth)
- 구글 로그인을 통한 인증 필수.
- 사전에 지정된 이메일 계정만 대시보드 접근 가능 (화이트리스트 방식).

### 3.2. 대시보드 (Portfolio Admin)
- 포트폴리오 등록, 수정, 삭제 기능 (Notion API 연동).
- **포트폴리오 필드**: 제목, 기간, 참여분야, 참여율, 개발 분류, 카테고리, 태그, 요약, 상세 설명, 미디어 URL 등.

### 3.3. 파트너 지원 최적화 (Copy-Paste Helper)
- 등록된 포트폴리오 데이터를 외부 사이트에 복사/붙여넣기 하기 쉬운 형태로 가공해서 보여주는 UI 제공.

### 3.4. 사용자 UI (Public View)
- DaVal 회사 소개 및 포트폴리오 목록을 보여주는 프리미엄 랜딩 페이지.
- 인터랙티브한 요소와 세련된 애니메이션 적용.

## 4. 단계별 진행 계획 (Phase 2)

### Phase 2-1: UI 개선
- [x] Left Sidebar 레이아웃 구현
- [x] 네비게이션 구조 개선 및 반응형 사이드바 완성
- [x] Admin 테이블 레이아웃 수정
- [x] About 페이지 텍스트 렌더링 개선

### Phase 2-2: 포트폴리오 웹 등록 고도화
- [x] 이미지 URL 입력 및 미리보기 UI 구현
- [x] PortfolioForm 내 이미지 컴포넌트 연동
- [x] Supabase Storage 연동 (이미지 직접 업로드 기능)
- [x] 이미지 드래그앤드롭 및 다중 업로드 지원

### Phase 2-3: 회사 소개 관리 (Company Profile)

#### Notion 데이터베이스 구조
Company 정보를 위한 **3개의 Notion 데이터베이스** 필요:

**1. Company Info (회사 기본 정보)**
| 속성 | 타입 | 설명 |
|------|------|------|
| Section | Select | hero, about, vision, history |
| Title | Title | 섹션 제목 |
| Content | Rich Text | 본문 내용 |
| Image | Files | 이미지 URL |
| Order | Number | 표시 순서 |

**2. Services (주요 업무 분야 및 강점)**
| 속성 | 타입 | 설명 |
|------|------|------|
| Title | Title | 서비스명 |
| Description | Rich Text | 서비스 설명 |
| Icon | Select | 아이콘 종류 (code, brain, rocket 등) |
| Highlights | Multi-select | 강점 태그 |
| Order | Number | 표시 순서 |

**3. Team (회사 구성 및 직원 소개)**
| 속성 | 타입 | 설명 |
|------|------|------|
| Name | Title | 이름 |
| Role | Select | 직책/역할 |
| Bio | Rich Text | 소개글 |
| Photo | Files | 프로필 사진 URL |
| Skills | Multi-select | 보유 기술 |
| Order | Number | 표시 순서 |

#### 구현 작업
- [x] Notion 데이터베이스 3개 생성 (Company Info, Services, Team)
- [x] 환경변수 추가 (NOTION_COMPANY_DB_ID, NOTION_SERVICES_DB_ID, NOTION_TEAM_DB_ID)
- [x] notion.ts에 각 DB CRUD 함수 추가
- [x] 관리자 편집 페이지 구현
  - [x] /admin/company - 회사 기본 정보 편집
  - [x] /admin/company/services - 서비스 편집
  - [x] /admin/company/team - 팀원 편집
- [x] 공개 About 페이지 구현 (/about)
  - [x] 회사 소개 섹션
  - [x] 서비스/강점 섹션
  - [x] 팀 소개 섹션
- [x] 초기 데이터 시드 스크립트 작성 (scripts/seed-company-data.mjs)

### Phase 3: 외주 플랫폼 연동 도구

#### 3-1: 프리모아 포트폴리오 자동 등록 (완료)
- **목표**: 등록된 포트폴리오 데이터를 프리모아(Freemoa)에 자동으로 입력
- **구현된 스크립트**:
  - [x] `scripts/freemoa-console.js` - 브라우저 콘솔에서 실행하는 폼 자동 입력 스크립트
  - [x] `scripts/freemoa-fill.mjs` - Puppeteer 기반 반자동 입력 도구
  - [x] `scripts/freemoa-simple.mjs` - 간소화된 자동화 스크립트
  - [x] `scripts/freemoa-auto-register.mjs` - 전체 자동화 스크립트
- **사용법**:
  1. 프리모아 포트폴리오 등록 페이지에서 로그인
  2. 브라우저 개발자 도구(F12) → Console 탭 열기
  3. `freemoa-console.js` 내용을 복사하여 붙여넣기 후 Enter
  4. 폼 확인 후 "등록" 버튼 클릭
  5. 다음 포트폴리오 등록 시 같은 과정 반복

#### 3-2: 프로젝트 수집기 (완료)
- **목표**: 위시켓(Wishket) 및 프리모아(Freemoa)에서 현재 '지원 가능한' 프로젝트를 한눈에 확인하고 즉시 지원 프로세스로 연결.
- **주요 기능**:
  - [x] 위시켓/프리모아 프로젝트 리스트 크롤링 및 필터링.
  - [x] 대시보드 내 통합 리스트 뷰 제공 (제목, 금액, 기간, 마감임박 등).
  - [x] '신청하기' 클릭 시 원본 사이트의 상세/지원 페이지로 리다이렉트.
- **구현 계획**:
  - [x] 프로젝트 수집 서버 로직 구현 (Scraping/API Proxy)
  - [x] 관리자 페이지 내 '프로젝트 탐색' 메뉴 추가 (/admin/support/projects)
  - [x] 필터링 기능 (플랫폼별)
  - [ ] 상세 필터링 (분야별, 금액별) - 향후 고도화 예정

---

## 사용자 확인 사항
> [!IMPORTANT]
> 1. AI 지원서 생성 기능은 사용자 요청에 따라 제외되었습니다.
> 2. 이미지 업로드는 **Supabase Storage**를 통해 구현되었습니다.
>    - Notion API 제한으로 직접 업로드 불가하여 Supabase 사용
>    - 드래그앤드롭 및 다중 이미지 업로드 지원
> 3. 회사 소개 관리를 위한 **Notion 데이터베이스 3개** 구성 완료:
>    - Company Info (회사 기본 정보) ✅
>    - Services (서비스/강점) ✅
>    - Team (팀원 소개) ✅

## 환경변수 설정
```env
# Notion
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_portfolio_db_id
NOTION_COMPANY_DB_ID=your_company_info_db_id
NOTION_SERVICES_DB_ID=your_services_db_id
NOTION_TEAM_DB_ID=your_team_db_id

# Supabase (이미지 스토리지)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth
NEXTAUTH_URL=your_site_url
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ALLOWED_EMAILS=email1@example.com,email2@example.com
```
