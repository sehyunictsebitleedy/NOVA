# NOVA 간결한 메인 페이지 시안

2026-11-14. 사용자의 추가 요청에 따라 페이지를 소개·제품 탐색·활용 안내 세 덩어리로 정리했다.

## 기획

방문자의 세 질문에만 답한다.
1. NOVA는 무엇인가: 업무 화면의 공통 언어.
2. 무엇을 제공하는가: UX는 화면을 만들고, Chart는 데이터를 읽고, Grid는 정보를 다룬다.
3. 어떻게 함께 쓰이는가: 통합 업무 포털 프로토타입으로 연결한다.

장식 키캡, 거대한 영어 헤드라인, 반복된 별도 제품 섹션, 자동 스크롤 모션을 메인에서 제외했다.
제품의 역할은 항상 보이는 세 탭으로 설명하고, 설명·실제 화면은 같은 자리에서 전환한다.
기존 NOVA 브랜드·퍼플·어두운 테마·라이트 전환·탐색 링크는 유지했다.
실제 라이브러리·API 출시나 성능을 약속하지 않는다. 상세 데모는 다음 단계다.

## 디자인 원칙

design-taste-frontend 적용. 절제된 B2B 편집 디자인. DESIGN_VARIANCE=5, MOTION_INTENSITY=3, VISUAL_DENSITY=3.
읽는 순서·한글 타이포그래피·여백으로 위계를 만든다. 인터랙션은 제품 탭·메뉴·테마만 둔다.
한글 서체는 Pretendard v1.3.9 공식 서브셋을 로컬에 제공한다. 파일은 변형하지 않고 이 페이지 글자를 포함하는 15개 서브셋만 선택했다(395,208 bytes). SIL OFL 라이선스를 함께 보존한다.
출처: https://github.com/orioncactus/pretendard.
현재 페이지에 없는 글자를 추후 추가할 때는 서브셋도 다시 선정하거나 시스템 서체 폴백을 확인한다.

## 파일

구현: site/design/index.html, style.css, main.js, assets/.
메인: npm.cmd run dev 후 http://127.0.0.1:4000/.
브라우저 캡처: design/nova-simple-desktop.png, design/nova-simple-mobile.png, design/nova-simple-light.png.
이전 소스 보존: design/archive/before-simplification/.
키캡 이미지가 있는 기존 생성 시안은 과거 참고안이며 현행 디자인을 나타내지 않는다.

## 최종 검증

제품 탭 전환, 좌우/Home/End 키보드 조작, 제품 해시 링크, 테마 저장, 모바일 메뉴·Escape, 내부 링크, 실제 화면 이미지, 이전 시안 경로를 확인했다. 360/390/768/1024/1280/1440px 가로 넘침 없음. 브라우저 오류 없음. Lighthouse 모바일 로컬 진단: 성능 90·접근성 100·권장사항 100·SEO 100, CLS 0. 실제 사용자 성능을 보증하는 수치는 아니다. PNG 시안은 이미지 생성물이 아닌 실제 브라우저 캡처다.

## Nuxt 전환

현재 실행 소스는 apps/portal/app의 Vue 컴포넌트이며, 스타일은 apps/portal/app/assets/css/site.css와 packages/tokens/css/nova.css로 분리했다. site/design은 기존 정적 시안 보존본이다. 사진·기획·시각은 유지하고 DOM 스크립트 대신 Vue 반응형 상태와 SSR 쿠키를 사용한다.
