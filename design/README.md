# NOVA 메인 사이트 시안

2026-11-14. 사용자 요청에 따라 설명 페이지 중심의 이전 안을 브랜드 사이트 구성으로 변경했다.

- nova-main-visual-proposal.png: 내장 image_gen으로 제작한 전체 메인 페이지 비주얼 제안. 화면 안의 UI와 문구는 시각 방향을 위한 예시이며 실제 제품 출시나 구현 상태를 증명하지 않는다.
- nova-browser-desktop.png: 실제 구현한 사이트의 데스크톱 브라우저 캡처.
- nova-browser-mobile.png: 실제 구현한 사이트의 모바일 브라우저 캡처.

실제 실행: npm.cmd run dev 후 http://127.0.0.1:4000/.
소스: site/design/. 기존 밝은 안은 /classic/, 이전 다크 안은 /concept/에 보존했다.

주요 구성: 브랜드 히어로 → 소개 → 독립 UX/Chart/Grid 제품 섹션 → 통합 활용 화면 → 마무리 CTA.
디자인: 큰 타이포그래피, 입체 비주얼, NOVA 퍼플, 어두운 단일 테마. 라이트 전환과 모바일 레이아웃도 제공한다.
제품 화면은 기존 프로토타입의 실제 캡처다. 기능별 상세 데모는 아직 다음 단계다.

이미지 생성 프롬프트 요지: off-black 배경과 ivory/violet 타이포그래피의 premium full-page NOVA website mockup; Make work / feel simple. 히어로, UX/CHART/GRID 입체 키캡, 서로 다른 제품 섹션과 간결한 CTA, 기기 프레임·가짜 실적·균일한 카드 나열 없음. 내장 image_gen 사용.

검증: 360/390/768/1024/1280/1440px 가로 넘침 없음. 메뉴·Escape·테마 저장·앵커·이미지·이전 경로 동작과 브라우저 오류 없음을 확인했다. 성능 수치는 로컬 진단이며 실제 서비스 성능 보장이 아니다.

Lighthouse 모바일 진단: 성능 92, 접근성 100, 권장사항 100, SEO 100 (로컬 시뮬레이션).
