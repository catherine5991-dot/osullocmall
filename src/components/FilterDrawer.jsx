import { useEffect, useState } from 'react'
import { RAW_MATERIAL_DETAIL_TAGS } from '../lib/productClassification.js'

// 베이스/제형은 DB check 제약과 동일한 고정 옵션 (products.base / products.format)
const BASE_OPTIONS = [
  { value: '녹차/말차/호지차', label: '녹차 · 말차 · 호지차' },
  { value: '홍차/발효차', label: '홍차 · 발효차' },
  { value: '허브', label: '허브' },
]

const FORMAT_OPTIONS = [
  { value: '잎차', label: '잎차', desc: '찻잎을 그대로 우려 마시는 가장 기본적인 형태예요.' },
  { value: '피라미드티백', label: '피라미드티백', desc: '찻잎이 충분히 펼쳐지도록 피라미드 모양으로 만든 티백이에요.' },
  { value: '종이티백', label: '종이티백', desc: '간편하게 우려 마실 수 있는 일반 티백이에요.' },
  { value: '찬물스틱티백', label: '찬물스틱티백', desc: '찬물에 넣기만 해도 빠르게 우러나는 스틱형 티백이에요.' },
  { value: '가루차', label: '가루차', desc: '물이나 우유에 타 마시는 가루 형태의 차예요.' },
  { value: '세트', label: '세트', desc: '여러 종류를 함께 구성한 선물용 세트예요.' },
]

export function emptyFilters() {
  return {
    flavorAroma: new Set(),
    rawMaterial: new Set(),
    base: new Set(),
    format: new Set(),
    caffeineFree: false,
    decaf: false, // 아직 상품 데이터에 디카페인 구분 필드가 없어 필터링에는 쓰이지 않음 (UI만)
    organic: false,
  }
}

export function hasActiveFilters(filters) {
  return (
    filters.flavorAroma.size > 0 ||
    filters.rawMaterial.size > 0 ||
    filters.base.size > 0 ||
    filters.format.size > 0 ||
    filters.caffeineFree ||
    filters.organic
  )
}

// 검색결과 위에 보여줄 '선택한 필터' 칩 목록 (라벨 + 제거용 category/value)
export function getActiveFilterChips(filters) {
  const chips = []
  filters.flavorAroma.forEach((v) => chips.push({ category: 'flavorAroma', value: v, label: v }))
  filters.rawMaterial.forEach((v) => chips.push({ category: 'rawMaterial', value: v, label: v }))
  filters.base.forEach((v) => {
    const opt = BASE_OPTIONS.find((o) => o.value === v)
    chips.push({ category: 'base', value: v, label: opt ? opt.label : v })
  })
  filters.format.forEach((v) => chips.push({ category: 'format', value: v, label: v }))
  if (filters.caffeineFree) chips.push({ category: 'caffeineFree', value: true, label: '무카페인' })
  if (filters.decaf) chips.push({ category: 'decaf', value: true, label: '디카페인' })
  if (filters.organic) chips.push({ category: 'organic', value: true, label: '유기농' })
  return chips
}

// 칩의 × 버튼을 눌렀을 때 그 필터 하나만 제거한 새 filters 객체를 반환
export function removeFilterChip(filters, chip) {
  if (chip.category === 'caffeineFree' || chip.category === 'decaf' || chip.category === 'organic') {
    return { ...filters, [chip.category]: false }
  }
  const next = new Set(filters[chip.category])
  next.delete(chip.value)
  return { ...filters, [chip.category]: next }
}

export function matchesFilters(product, filters) {
  const namesOf = (category) =>
    (product.product_tags ?? [])
      .map((pt) => pt.tags)
      .filter((t) => t?.category === category)
      .map((t) => t.name)

  const flavor = namesOf('flavor_aroma')

  if (filters.flavorAroma.size > 0 && !flavor.some((n) => filters.flavorAroma.has(n))) return false
  if (
    filters.rawMaterial.size > 0 &&
    ![...filters.rawMaterial].some((tag) => RAW_MATERIAL_DETAIL_TAGS[tag]?.includes(product.name))
  ) {
    return false
  }
  if (filters.base.size > 0 && !filters.base.has(product.base)) return false
  if (filters.format.size > 0 && !filters.format.has(product.format)) return false
  if (filters.caffeineFree && !product.is_caffeine_free) return false
  if (filters.organic && !product.is_organic) return false
  return true
}

function Section({ title, extra, children }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border-b border-gray-100 py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-base text-gray-900"
      >
        {title}
        <span aria-hidden className="text-gray-400">
          {open ? '︿' : '﹀'}
        </span>
      </button>
      {open && (
        <div className="mt-3">
          {extra}
          {children}
        </div>
      )}
    </div>
  )
}

function Pill({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
        checked ? 'border-primary bg-primary text-white' : 'border-gray-300 text-gray-700'
      }`}
    >
      {label}
    </button>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 py-2 text-sm text-gray-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded-[4px] border-gray-300 accent-black"
      />
      {label}
    </label>
  )
}

function FilterDrawer({ open, onClose, tags, products, appliedFilters, onApply }) {
  const [draft, setDraft] = useState(appliedFilters)
  const [showFormatInfo, setShowFormatInfo] = useState(false)

  // 드로어를 열 때마다 현재 적용된 필터로 다시 맞춰줌 (닫았다 다시 열었을 때 초기화 방지)
  useEffect(() => {
    if (open) setDraft(appliedFilters)
  }, [open, appliedFilters])

  if (!open) return null

  const toggle = (key, value) => {
    setDraft((prev) => {
      const next = new Set(prev[key])
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return { ...prev, [key]: next }
    })
  }

  const matchCount = products.filter((p) => matchesFilters(p, draft)).length

  return (
    <div className="fixed inset-0 z-40">
      <button type="button" aria-label="배경 닫기" onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-[420px] flex-col bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold">Filter</h2>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setDraft(emptyFilters())} className="text-xs text-gray-400 underline">
              초기화
            </button>
            <button type="button" aria-label="닫기" onClick={onClose} className="text-xl leading-none">
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <Section title="빠른 필터">
            <Checkbox
              label="무카페인"
              checked={draft.caffeineFree}
              onChange={() => setDraft((prev) => ({ ...prev, caffeineFree: !prev.caffeineFree }))}
            />
            <Checkbox
              label="디카페인"
              checked={draft.decaf}
              onChange={() => setDraft((prev) => ({ ...prev, decaf: !prev.decaf }))}
            />
            <Checkbox
              label="유기농"
              checked={draft.organic}
              onChange={() => setDraft((prev) => ({ ...prev, organic: !prev.organic }))}
            />
          </Section>

          <Section title="베이스">
            {BASE_OPTIONS.map((opt) => (
              <Checkbox
                key={opt.value}
                label={opt.label}
                checked={draft.base.has(opt.value)}
                onChange={() => toggle('base', opt.value)}
              />
            ))}
          </Section>

          <Section title="맛과 향">
            {tags.flavor_aroma.map((name) => (
              <Checkbox
                key={name}
                label={name}
                checked={draft.flavorAroma.has(name)}
                onChange={() => toggle('flavorAroma', name)}
              />
            ))}
          </Section>

          <Section title="원물">
            <div className="flex flex-wrap gap-2">
              {Object.keys(RAW_MATERIAL_DETAIL_TAGS).map((name) => (
                <Pill
                  key={name}
                  label={name}
                  checked={draft.rawMaterial.has(name)}
                  onChange={() => toggle('rawMaterial', name)}
                />
              ))}
            </div>
          </Section>

          <Section
            title="제형"
            extra={
              <button
                type="button"
                onClick={() => setShowFormatInfo((v) => !v)}
                className="mb-2 text-xs text-gray-400 underline"
              >
                {showFormatInfo ? '설명 닫기' : '제형 비교 더보기'}
              </button>
            }
          >
            {showFormatInfo && (
              <ul className="mb-2 flex flex-col gap-1.5 rounded-[2px] bg-gray-50 p-3 text-xs text-gray-500">
                {FORMAT_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <span className="font-medium text-gray-600">{opt.label}</span> — {opt.desc}
                  </li>
                ))}
              </ul>
            )}
            {FORMAT_OPTIONS.map((opt) => (
              <Checkbox
                key={opt.value}
                label={opt.label}
                checked={draft.format.has(opt.value)}
                onChange={() => toggle('format', opt.value)}
              />
            ))}
          </Section>
        </div>

        <div className="border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
            className="w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white"
          >
            {matchCount}개 보기
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterDrawer
