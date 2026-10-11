// 상품 목록/상세 페이지, 파인더에서 공통으로 쓰는 분류 기준.
// 여기를 고치면 전체 상품 목록·상세페이지 표기가 같이 바뀜 (따로따로 수정해서 어긋나지 않도록 한 곳에 모아둠)

// 밀크티류 / 콤부차·콜드브루류 상품명
export const MILK_NAMES = [
  '제주 말차 밀크티', '얼그레이 밀크티', '제주 호지차 밀크티', '제주 호지샷 블렌드', '제주 말차샷 블렌드',
  '삼다연 오리지널 밀크티', '제주 말차 오트 블렌드', '가루녹차',
]
export const COLD_KOMBUCHA_NAMES = [
  '찬물 녹차', '말차 콜드브루 티', '선샤인 머스캣 콜드브루 티', '선셋피치 콜드브루 티',
  '스윗 히비스커스 콜드브루 티', '달빛 꿀배 콜드브루 티', '콤부차 애플파인',
]

// 이름에 '말차'가 있어도 함께 녹차로도 보여주고 싶은 예외 상품
export const GREEN_EXTRA_NAMES = ['말차 콜드브루 티']

// 이름순 정렬과 상관없이 항상 목록 맨 뒤로 보낼 상품
export const SORT_LAST_NAMES = ['말차 콜드브루 티']

// 이름에 "말차"가 없어도 실질적으로 말차류인 상품 (가루녹차 = 말차 가루)
export const MATCHA_OVERRIDE_NAMES = ['가루녹차']

// 맛과 향(블렌디드) 태그가 있어도 '말차' 분류에서 빼지 않을 예외 상품
export const MATCHA_KEEP_IN_MATCHA_NAMES = ['말차플러스 콜라겐', '말차플러스 테아닌', '말차플러스 프로바이오틱스']

export function hasFlavorAromaTag(p) {
  return (p.product_tags ?? []).some((pt) => pt.tags?.category === 'flavor_aroma')
}

// 녹차/말차/호지차 베이스를 이름으로 세분화. 블렌디드티(맛과 향 태그)가 붙은 상품은 여기서 제외하고
// 블렌디드티 쪽에서만 보여줌 (허브티/홍차·발효차와 달리 녹차/말차/호지차엔 블렌디드류를 섞지 않음) —
// 단, MATCHA_KEEP_IN_MATCHA_NAMES에 있는 상품은 블렌디드티여도 말차 분류에 같이 보여줌
export function isPureGMH(p, kind) {
  if (p.base !== '녹차/말차/호지차') return false
  const isMatcha = p.name.includes('말차') || MATCHA_OVERRIDE_NAMES.includes(p.name)
  if (hasFlavorAromaTag(p) && !(isMatcha && MATCHA_KEEP_IN_MATCHA_NAMES.includes(p.name))) return false
  if (kind === 'matcha') return isMatcha
  if (kind === 'hoji') return p.name.includes('호지')
  return !isMatcha && !p.name.includes('호지')
}

export const BASE_FILTERS = [
  { label: '녹차', test: (p) => isPureGMH(p, 'green') || GREEN_EXTRA_NAMES.includes(p.name) },
  { label: '말차', test: (p) => isPureGMH(p, 'matcha') },
  { label: '호지차', test: (p) => isPureGMH(p, 'hoji') },
  { label: '홍차 · 발효차', test: (p) => p.base === '홍차/발효차' && !hasFlavorAromaTag(p) },
  { label: '블렌디드티', test: (p) => hasFlavorAromaTag(p) },
  { label: '허브티', test: (p) => p.base === '허브' },
  { label: '밀크티', test: (p) => MILK_NAMES.includes(p.name) },
  { label: '콤부차 · 콜드브루티', test: (p) => COLD_KOMBUCHA_NAMES.includes(p.name) },
]

export function matchesBaseFilter(p, label) {
  if (!label) return true
  const pill = BASE_FILTERS.find((f) => f.label === label)
  return pill ? pill.test(p) : true
}

// 카드/상세페이지에 보여줄 베이스 텍스트. 녹차/말차/호지차는 세분화하고,
// 밀크티·블렌디드티·허브티에도 같이 해당하면 같이 표기
export function getDisplayBase(p) {
  const blended = hasFlavorAromaTag(p)

  // 콤부차는 허브 베이스여도 '콤부차'로 따로 표기
  if (COLD_KOMBUCHA_NAMES.includes(p.name) && p.name.startsWith('콤부차')) return '콤부차'

  // 허브 블렌디드류는 '블렌디드티, 허브티'로 둘 다 표기, 순수 허브티는 '허브티'로 표기
  if (p.base === '허브') return blended ? '블렌디드티, 허브티' : '허브티'

  // 홍차/발효차 블렌디드류는 베이스를 따로 안 보여주고 '블렌디드티'로만 표기.
  // 순수차는 필터 태그와 표기를 맞춰서 '홍차 · 발효차'로 통일
  if (p.base === '홍차/발효차') return blended ? '블렌디드티' : '홍차 · 발효차'

  if (p.base !== '녹차/말차/호지차') return p.base

  if (GREEN_EXTRA_NAMES.includes(p.name)) return '녹차, 말차'
  const isMatcha = p.name.includes('말차') || MATCHA_OVERRIDE_NAMES.includes(p.name)
  if (isMatcha && MILK_NAMES.includes(p.name)) return '말차, 밀크티'
  if (isMatcha && MATCHA_KEEP_IN_MATCHA_NAMES.includes(p.name) && blended) return '말차, 블렌디드티'
  // 말차가 아닌 녹차/호지차 베이스의 블렌디드류는 '블렌디드티'로만 표기
  if (blended) return '블렌디드티'
  if (isMatcha) return '말차'
  if (p.name.includes('호지')) return '호지차'
  return '녹차'
}
