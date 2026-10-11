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

// 상품의 베이스 분류로 필터 버튼 구성 (실제 DB 베이스 값 기준)
// '블렌디드티'는 베이스 값이 아니라 맛과 향(flavor_aroma) 태그가 붙은 상품을 모아 보여주는 특수 필터
const BASE_FILTERS = [
  { label: '녹차 · 말차 · 호지차', value: '녹차/말차/호지차' },
  { label: '홍차 · 발효차', value: '홍차/발효차' },
  { label: '블렌디드티', value: 'blended' },
  { label: '허브티', value: '허브' },
]

function hasFlavorAromaTag(p) {
  return (p.product_tags ?? []).some((pt) => pt.tags?.category === 'flavor_aroma')
}

function matchesBaseFilter(p, value) {
  if (!value) return true
  if (value === 'blended') return hasFlavorAromaTag(p)
  return p.base === value
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

function ProductCard({ product: p, layout }) {
  const thumbColor = THUMB_COLORS[p.base] ?? 'bg-gray-100'
  const aromaTags = (p.product_tags ?? [])
    .map((pt) => pt.tags)
    .filter((t) => t?.category === 'flavor_aroma')
    .map((t) => t.name)

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
          {aromaTags.length > 0 ? aromaTags.join(' | ') : `${p.base} | ${p.format}`}
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
        setProducts(data)
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
      <h1 className="text-xl font-semibold">전체 상품</h1>

      {status === 'loading' && <p className="mt-4 text-sm text-gray-500">불러오는 중...</p>}
      {status === 'error' && (
        <p className="mt-4 text-sm text-red-600">상품을 불러오지 못했어요. Supabase 연결을 확인해주세요.</p>
      )}
      {status === 'ready' && (
        <p className="mt-2 text-sm text-gray-600">총 {filtered.length}개 상품</p>
      )}

      <div className="mt-5 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {BASE_FILTERS.map((f) => {
          const selected = activeBase === f.value
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => setActiveBase(selected ? null : f.value)}
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
