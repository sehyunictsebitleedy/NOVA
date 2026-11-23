import type { NovaProduct } from '../types/product'

// Public product descriptions, not a substitute for upstream business data.
export const NOVA_PRODUCTS: NovaProduct[] = [
  { id: 'ux', name: 'UX', tagline: '화면을 만들다', headline: ['어느 화면에서나', '익숙한 사용 경험.'],
    description: ['메뉴, 탭, 버튼, 입력 폼.', '자주 쓰는 조작에 같은 기준을 적용합니다.'],
    features: ['화면을 오가는 멀티탭', '명확한 입력과 피드백', '조합해서 쓰는 컴포넌트'],
    image: '/concept/assets/ux.webp', alt: 'NOVA 프로토타입의 입력 폼, 버튼, 탭 컴포넌트 팔레트', caption: '컴포넌트 팔레트 · 프로토타입 화면' },
  { id: 'chart', name: 'Chart', tagline: '데이터를 읽다', headline: ['숫자 속의 흐름을', '한눈에 이해하다.'],
    description: ['추이와 비율, 비교와 분포.', '데이터의 관계를 알맞은 차트로 보여줍니다.'],
    features: ['기간에 따른 변화', '항목 간 비교와 구성', '현황에서 상세 정보로'],
    image: '/concept/assets/chart.webp', alt: 'NOVA 프로토타입의 라인, 막대, 도넛 차트 갤러리', caption: '차트 갤러리 · 예시 데이터' },
  { id: 'grid', name: 'Grid', tagline: '정보를 다루다', headline: ['많은 정보도', '다루기 쉬운 목록으로.'],
    description: ['찾고, 정렬하고, 수정하는 업무.', '행과 열 안에서 필요한 작업을 이어갑니다.'],
    features: ['조건에 맞는 정보 검색', '정렬과 데이터 비교', '목록 안에서 이어지는 편집'],
    image: '/concept/assets/grid.webp', alt: 'NOVA 프로토타입의 검색, 정렬, 행 편집 그리드', caption: '조회·편집 그리드 · 예시 데이터' },
]
