# DaVal 포트폴리오 관리 사이트 개발 계획 (Updated)

이 문서는 DaVal의 포트폴리오 관리 및 파트너(위시켓, 프리모아 등) 지원을 위한 사이트 개발 계획을 담고 있습니다.

## 1. 개요
- **목표**: 특정 구글 계정으로만 접근 가능한 대시보드를 통해 포트폴리오를 관리하고, 외부 플랫폼 지원 시 활용할 수 있는 콘텐츠 관리 시스템 구축.
- **핵심 가치**: 프리미엄 디자인, 효율적인 데이터 관리, 외부 지원 프로세스 단축.

## 2. 기술 스택
- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **인증**: NextAuth.js (Google OAuth) + Email Whitelist
- **데이터베이스/스토리지**: Notion API (Data) + 외부 이미지 URL
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
- [ ] 네비게이션 구조 개선 및 반응형 사이드바 완성

### Phase 2-2: 포트폴리오 웹 등록 고도화
- [x] 이미지 URL 입력 및 미리보기 UI 구현
- [x] PortfolioForm 내 이미지 컴포넌트 연동

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
- [ ] Notion 데이터베이스 3개 생성 (Company Info, Services, Team)
- [ ] 환경변수 추가 (NOTION_COMPANY_DB_ID, NOTION_SERVICES_DB_ID, NOTION_TEAM_DB_ID)
- [ ] notion.ts에 각 DB CRUD 함수 추가
- [ ] 관리자 편집 페이지 구현
  - [ ] /admin/company - 회사 기본 정보 편집
  - [ ] /admin/company/services - 서비스 편집
  - [ ] /admin/company/team - 팀원 편집
- [ ] 공개 About 페이지 구현 (/about)
  - [ ] 회사 소개 섹션
  - [ ] 서비스/강점 섹션
  - [ ] 팀 소개 섹션

---

## 사용자 확인 사항
> [!IMPORTANT]
> 1. AI 지원서 생성 기능은 사용자 요청에 따라 제외되었습니다.
> 2. 이미지는 외부 URL 입력 방식으로 구현되었습니다 (Notion API 제한으로 직접 업로드 불가).
> 3. 회사 소개 관리를 위한 **Notion 데이터베이스 3개 생성 필요**:
>    - Company Info (회사 기본 정보)
>    - Services (서비스/강점)
>    - Team (팀원 소개)
