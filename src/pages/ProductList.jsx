import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import cartIcon from '../assets/icon-cart.png'
import FilterDrawer, { emptyFilters, hasActiveFilters, matchesFilters } from '../components/FilterDrawer.jsx'
import { supabase } from '../lib/supabaseClient'

const THUMB_COLORS = {
  '녹차/말차/호지차': 'bg-sub-light',
  '홍차/발효차': 'bg-amber-100',
  허브: 'bg-rose-100',
}

// Finder.jsx의 상품명 목록과 동일한 기준 (밀크티류 / 콤부차·콜드브루류)
const MILK_NAMES = [
  '제주 말차 밀크티', '얼그레이 밀크티', '제주 호지차 밀크티', '제주 호지샷 블렌드', '제주 말차샷 블렌드',
  '삼다연 오리지널 밀크티', '제주 말차 오트 블렌드', '가루녹차',
]
const COLD_KOMBUCHA_NAMES = [
  '찬물 녹차', '말차 콜드브루 티', '선샤인 머스캣 콜드브루 티', '선셋피치 콜드브루 티',
  '스윗 히비스커스 콜드브루 티', '달빛 꿀배 콜드브루 티', '콤부차 애플파인',
]

// 이름에 '말차'가 있어도 함께 녹차로도 보여주고 싶은 예외 상품
const GREEN_EXTRA_NAMES = ['말차 콜드브루 티']

// 이름순 정렬과 상관없이 항상 목록 맨 뒤로 보낼 상품
const SORT_LAST_NAMES = ['말차 콜드브루 티']

function hasFlavorAromaTag(p) {
  return (p.product_tags ?? []).some((pt) => pt.tags?.category === 'flavor_aroma')
}

// 이름에 "말차"가 없어도 실질적으로 말차류인 상품 (가루녹차 = 말차 가루)
const MATCHA_OVERRIDE_NAMES = ['가루녹차']

// 녹차/말차/호지차 베이스를 이름으로 세분화. 블렌디드티(맛과 향 태그)가 붙은 상품은 여기서 제외하고
// 블렌디드티 쪽에서만 보여줌 (허브티/홍차·발효차와 달리 녹차/말차/호지차엔 블렌디드류를 섞지 않음)
function isPureGMH(p, kind) {
  if (p.base !== '녹차/말차/호지차') return false
  if (hasFlavorAromaTag(p)) return false
  const isMatcha = p.name.includes('말차') || MATCHA_OVERRIDE_NAMES.includes(p.name)
  if (kind === 'matcha') return isMatcha
  if (kind === 'hoji') return p.name.includes('호지')
  return !isMatcha && !p.name.includes('호지')
}

const BASE_FILTERS = [
  { label: '녹차', test: (p) => isPureGMH(p, 'green') || GREEN_EXTRA_NAMES.includes(p.name) },
  { label: '말차', test: (p) => isPureGMH(p, 'matcha') },
  { label: '호지차', test: (p) => isPureGMH(p, 'hoji') },
  { label: '홍차 · 발효차', test: (p) => p.base === '홍차/발효차' },
  { label: '블렌디드티', test: (p) => hasFlavorAromaTag(p) },
  { label: '허브티', test: (p) => p.base === '허브' },
  { label: '밀크티', test: (p) => MILK_NAMES.includes(p.name) },
  { label: '콤부차 · 콜드브루티', test: (p) => COLD_KOMBUCHA_NAMES.includes(p.name) },
]

function matchesBaseFilter(p, label) {
  if (!label) return true
  const pill = BASE_FILTERS.find((f) => f.label === label)
  return pill ? pill.test(p) : true
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.5C12 20.5 3.5 15.5 3.5 9.5C3.5 6.5 5.8 4.5 8.5 4.5C10 4.5 11.3 5.2 12 6.3C12.7 5.2 14 4.5 15.5 4.5C18.2 4.5 20.5 6.5 20.5 9.5C20.5 15.5 12 20.5 12 20.5Z"
        stroke="black"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="1" fill="currentColor" />
    </svg>
  )
}

// 카드에 보여줄 베이스 텍스트. 녹차/말차/호지차는 세분화해서 표기
function getDisplayBase(p) {
  if (p.base !== '녹차/말차/호지차') return p.base
  if (GREEN_EXTRA_NAMES.includes(p.name)) return '녹차, 말차'
  if (p.name.includes('말차') || MATCHA_OVERRIDE_NAMES.includes(p.name)) return '말차'
  if (p.name.includes('호지')) return '호지차'
  return '녹차'
}

function ProductCard({ product: p, layout }) {
  const thumbColor = THUMB_COLORS[p.base] ?? 'bg-gray-100'
  const aromaTags = (p.product_tags ?? [])
    .map((pt) => pt.tags)
    .filter((t) => t?.category === 'flavor_aroma')
    .map((t) => t.name)
  const displayBase = getDisplayBase(p)

  return (
    <Link to={`/products/${p.id}`} className={layout === 'list' ? 'flex gap-3 text-left' : 'block text-left'}>
      <div className={`relative aspect-square ${layout === 'list' ? 'w-28 shrink-0' : 'w-full'} rounded-[2px] ${thumbColor}`}>
        <button
          type="button"
          aria-label="찜하기"
          onClick={(e) => e.preventDefault()}
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90"
        >
          <HeartIcon />
        </button>
        <span
          aria-hidden="true"
          className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
        >
          <img src={cartIcon} alt="" className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-2">
        <p className="text-sm font-semibold">{p.name}</p>
        <p className="mt-1 text-xs text-gray-500">
          {displayBase} | {p.format}
          {aromaTags.length > 0 ? ' · 블렌디드티' : ''}
        </p>
        <p className="mt-1 text-sm font-semibold">{p.price.toLocaleString()}원</p>
      </div>
    </Link>
  )
}

function ProductList() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [activeBase, setActiveBase] = useState(null)
  const [layout, setLayout] = useState('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState(emptyFilters())
  const [tags, setTags] = useState({ flavor_aroma: [], raw_material: [], situation: [] })

  useEffect(() => {
    supabase
      .from('products')
      .select(
        'id, name, price, base, format, is_caffeine_free, is_organic, product_tags(tags(name, category))',
      )
      .order('name')
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
          setStatus('error')
          return
        }
        // 이름 기준 정렬 상관없이 항상 맨 뒤로 보낼 상품
        const sorted = [...data].sort(
          (a, b) => SORT_LAST_NAMES.includes(a.name) - SORT_LAST_NAMES.includes(b.name),
        )
        setProducts(sorted)
        setStatus('ready')
      })

    supabase
      .from('tags')
      .select('category, name')
      .order('name')
      .then(({ data, error }) => {
        if (error || !data) return
        setTags({
          flavor_aroma: data.filter((t) => t.category === 'flavor_aroma').map((t) => t.name),
          raw_material: data.filter((t) => t.category === 'raw_material').map((t) => t.name),
          situation: data.filter((t) => t.category === 'situation').map((t) => t.name),
        })
      })
  }, [])

  const filtered = products
    .filter((p) => matchesBaseFilter(p, activeBase))
    .filter((p) => matchesFilters(p, filters))

  return (
    <div className="px-6 pt-8">
      <div className="flex items-baseline gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveBase(null)
            setFilters(emptyFilters())
          }}
          className="text-xl font-semibold"
        >
          전체 상품
        </button>
        {status === 'ready' && (
          <span className="text-sm text-gray-600">총 {filtered.length}개 상품</span>
        )}
      </div>

      {status === 'loading' && <p className="mt-4 text-sm text-gray-500">불러오는 중...</p>}
      {status === 'error' && (
        <p className="mt-4 text-sm text-red-600">상품을 불러오지 못했어요. Supabase 연결을 확인해주세요.</p>
      )}

      <div
        onWheel={(e) => {
          if (e.deltaY === 0) return
          e.currentTarget.scrollLeft += e.deltaY
        }}
        className="mt-5 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {BASE_FILTERS.map((f) => {
          const selected = activeBase === f.label
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => setActiveBase(selected ? null : f.label)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                selected ? 'border-primary bg-primary text-white' : 'border-gray-300 text-gray-700'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-y border-gray-100 py-3">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className={`flex items-center gap-1.5 text-sm ${
            hasActiveFilters(filters) ? 'font-semibold text-primary' : 'text-gray-700'
          }`}
        >
          <FilterIcon />
          필터
        </button>
        <div className="flex items-center gap-2 text-gray-700">
          <button
            type="button"
            aria-label="격자형 보기"
            onClick={() => setLayout('grid')}
            className={layout === 'grid' ? 'text-black' : 'text-gray-300'}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            aria-label="목록형 보기"
            onClick={() => setLayout('list')}
            className={layout === 'list' ? 'text-black' : 'text-gray-300'}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      <div className={layout === 'grid' ? 'mt-5 grid grid-cols-2 gap-x-3 gap-y-6' : 'mt-5 flex flex-col gap-4'}>
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} layout={layout} />
        ))}
      </div>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        tags={tags}
        products={products.filter((p) => matchesBaseFilter(p, activeBase))}
        appliedFilters={filters}
        onApply={setFilters}
      />
    </div>
  )
}

export default ProductList
