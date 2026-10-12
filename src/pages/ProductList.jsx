import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import cartIcon from '../assets/icon-cart.png'
import FilterDrawer, {
  emptyFilters,
  getActiveFilterChips,
  hasActiveFilters,
  matchesFilters,
  removeFilterChip,
} from '../components/FilterDrawer.jsx'
import { supabase } from '../lib/supabaseClient'
import {
  BASE_FILTERS,
  MATCHA_OVERRIDE_NAMES,
  SORT_LAST_NAMES,
  getDisplayBase,
  hasFlavorAromaTag,
  matchesBaseFilter,
} from '../lib/productClassification.js'

const THUMB_COLORS = {
  '녹차/말차/호지차': 'bg-sub-light',
  '홍차/발효차': 'bg-amber-100',
  허브: 'bg-rose-100',
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

function ProductCard({ product: p }) {
  const thumbColor = THUMB_COLORS[p.base] ?? 'bg-gray-100'
  const aromaTags = (p.product_tags ?? [])
    .map((pt) => pt.tags)
    .filter((t) => t?.category === 'flavor_aroma')
    .map((t) => t.name)
  const displayBase = getDisplayBase(p)

  return (
    <Link to={`/products/${p.id}`} className="block text-left">
      <div className={`relative aspect-square w-full rounded-[2px] ${thumbColor}`}>
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
        <p className="flex items-center gap-1 text-sm font-semibold">
          {p.name}
          {p.is_caffeine_free && (
            <span className="shrink-0 rounded-[2px] bg-sub-light px-1 py-0.5 text-[9px] font-normal text-gray-700">
              무카페인
            </span>
          )}
          {p.is_organic && (
            <span className="shrink-0 rounded-[2px] bg-sub-light px-1 py-0.5 text-[9px] font-normal text-gray-700">
              유기농
            </span>
          )}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {displayBase} | {p.format}
          {aromaTags.length > 0 && !displayBase.includes('블렌디드티') ? ' · 블렌디드티' : ''}
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
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState(emptyFilters())
  const [tags, setTags] = useState({ flavor_aroma: [] })
  const [sortBy, setSortBy] = useState('popular')
  const dragRef = useRef({ down: false, startX: 0, startScroll: 0, moved: false })

  useEffect(() => {
    supabase
      .from('products')
      .select(
        'id, name, price, base, format, is_caffeine_free, is_organic, created_at, product_tags(tags(name, category))',
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
        })
      })
  }, [])

  const filtered = products
    .filter((p) => matchesBaseFilter(p, activeBase))
    .filter((p) => matchesFilters(p, filters))

  const sortedFiltered = [...filtered]
  if (sortBy === 'newest') {
    sortedFiltered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortBy === 'price_asc') {
    sortedFiltered.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price_desc') {
    sortedFiltered.sort((a, b) => b.price - a.price)
  }
  // 'popular'은 별도 인기 데이터가 없어 기본 노출 순서를 그대로 사용

  return (
    <div className="px-6 pt-8">
      <div className="flex items-baseline gap-2">
        {status === 'ready' && (
          <span className="text-xl font-semibold">총 {filtered.length}개 상품</span>
        )}
      </div>

      {status === 'loading' && <p className="mt-4 text-sm text-gray-500">불러오는 중...</p>}
      {status === 'error' && (
        <p className="mt-4 text-sm text-red-600">상품을 불러오지 못했어요. Supabase 연결을 확인해주세요.</p>
      )}

      {!hasActiveFilters(filters) && (
        <div
          onWheel={(e) => {
            if (e.deltaY === 0) return
            e.currentTarget.scrollLeft += e.deltaY
          }}
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse') return
            dragRef.current = { down: true, startX: e.clientX, startScroll: e.currentTarget.scrollLeft, moved: false }
          }}
          onPointerMove={(e) => {
            if (!dragRef.current.down) return
            const dx = e.clientX - dragRef.current.startX
            if (Math.abs(dx) > 3) dragRef.current.moved = true
            e.currentTarget.scrollLeft = dragRef.current.startScroll - dx
          }}
          onPointerUp={() => {
            dragRef.current.down = false
          }}
          onPointerLeave={() => {
            dragRef.current.down = false
          }}
          onClickCapture={(e) => {
            if (dragRef.current.moved) {
              e.preventDefault()
              e.stopPropagation()
              dragRef.current.moved = false
            }
          }}
          className="mt-5 flex cursor-grab gap-2 overflow-x-auto select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
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
      )}

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
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="정렬"
          className="rounded-[2px] border border-gray-200 bg-white py-1 pl-2 pr-6 text-xs text-gray-700"
        >
          <option value="popular">인기순</option>
          <option value="newest">신제품순</option>
          <option value="price_asc">낮은가격순</option>
          <option value="price_desc">높은가격순</option>
        </select>
      </div>

      {hasActiveFilters(filters) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {getActiveFilterChips(filters).map((chip) => (
            <button
              key={`${chip.category}-${chip.value}`}
              type="button"
              onClick={() => setFilters(removeFilterChip(filters, chip))}
              className="flex items-center gap-1 rounded-full bg-sub-light px-3 py-1.5 text-xs text-gray-700"
            >
              {chip.label}
              <span aria-hidden="true">✕</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6">
        {sortedFiltered.map((p) => (
          <ProductCard key={p.id} product={p} />
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
