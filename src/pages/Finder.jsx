import { useEffect, useState } from 'react'
import arrowIcon from '../assets/icon-arrow.png'
import pureFermentedImg from '../assets/option-pure-fermented.jpg'
import pureGreenImg from '../assets/option-pure-green.png'
import pureMatchaImg from '../assets/option-pure-matcha.jpg'
import { supabase } from '../lib/supabaseClient'

const CARDS = [
  { key: 'time', title: 'Time Card', question: '언제 차를 마시고 싶은가요?' },
  { key: 'mood', title: 'Mood Card', question: '오늘 나에게 필요한 것은 무엇인가요?' },
  { key: 'flavor', title: 'Flavor Card', question: '어떤 맛과 향을 좋아하세요?' },
]

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f']

// 라벨명/설명은 여기 한 곳에서만 수정하면 전체 화면(확인 배너)에 반영됨
const CATEGORY_LABELS = {
  pure_tea: { name: '순수차', enName: 'Pure Tea', desc: '한 가지 재료 본연의 맛을 즐기는 차' },
  blended_tea: { name: '블렌디드', enName: 'Blended Tea', desc: '여러 재료가 어우러진 풍부한 맛과 향의 차' },
  drink_type: { name: '음료형', enName: 'Tea Drink', desc: '음료처럼 즐기는 차' },
  pure_herb: { name: '순수허브', enName: 'Pure Herb', desc: '한 가지 허브 본연의 향을 즐기는 차' },
  blended_herb: { name: '블렌디드 허브', enName: 'Blended Herb', desc: '여러 허브가 어우러진 풍성한 맛과 향의 차' },
  green_tea: { name: '녹차', desc: '제주 차밭의 햇살을 담은, 산뜻하고 가벼운 녹차' },
  matcha: { name: '말차', desc: '고소하고 진한 맛의 차' },
  fermented_tea: { name: '발효차·홍차', desc: '향이 깊고 진한 맛의 차' },
  citrus: { name: '시트러스', desc: '상큼한 향의 차' },
  floral: { name: '플로럴', desc: '화사한 꽃향의 차' },
  nutty: { name: '너티', desc: '구수하고 고소한 향의 차' },
  fruity: { name: '프루티', desc: '달콤한 향의 차' },
  herbal: { name: '허벌', desc: '은은하고 편안한 향의 차' },
  milk_style: { name: '밀크티', desc: '우유와 함께 즐기는 차' },
  cold_style: { name: '콜드', desc: '가볍고 시원하게 즐기는 차' },
  fruity_herb: { name: '과일향 허브', desc: '은은한 과일향이 느껴지는 허브차' },
  herbal_essence: { name: '허브 본연의 향', desc: '플로럴하고 풀향 같은 허브 본연의 향' },
  calming: { name: '마음이 편안해지는 기분', banner: '차분하게 긴장을 풀고 싶을 때' },
  refreshing: { name: '개운하고 산뜻한 기분', banner: '운동 후나 식사 후에 어울리는 티' },
  adventurous: { name: '새롭고 재미있는 경험', banner: '다채로운 맛과 향을 즐기고 싶을 때' },
  comforting: { name: '익숙하고 따뜻한 위안', banner: '찻잎 본연의 향과 맛을 즐길 수 있는 순수차' },
  fragrant: { name: '화사하고 향긋한 기분', banner: '향기롭게 기분전환' },
  reward: { name: '나를 위한 작은 보상', banner: '달달하게 당 충전' },
}

// A/B 비교용: true로 바꾸면 선택지 문장 아래 작은 회색 캡션으로 카테고리명이 보임
const SHOW_OPTION_CAPTION = false

const TIME_QUESTION = {
  title: 'Time',
  question: '언제 차를 마시고 싶은가요?',
  options: [
    { label: '아침, 활기차게 하루를 시작하고 싶을 때', value: 'caffeine' },
    { label: '낮 시간, 집중이 필요할 때', value: 'caffeine' },
    { label: '저녁 이후, 편안하게 마무리하고 싶을 때', value: 'decaf' },
    { label: '시간 상관없이 언제든', value: 'any' },
  ],
}

function getFlavorQuestion(caffeineGroup) {
  if (caffeineGroup === 'decaf') {
    return {
      title: 'Flavor',
      question: '어떤 맛과 향을 좋아하세요?',
      options: [
        { label: '한 가지 허브의 향이 좋아요', value: 'pure_herb' },
        { label: '여러 허브가 어우러진 풍성한 맛과 향이 좋아요', value: 'blended_herb' },
      ],
    }
  }

  // caffeineGroup === 'any'일 때도 아래 3개를 그대로 사용 (a는 pure_tea+pure_herb,
  // b는 blended_tea+blended_herb를 포괄하는 조건으로 추후 상품 매칭 단계에서 병합 처리)
  return {
    title: 'Flavor',
    question: '어떤 맛과 향을 좋아하세요?',
    options: [
      { label: '한 가지 재료가 주는 깊고 진한 맛과 향이 좋아요', value: 'pure_tea' },
      { label: '여러 재료가 어우러진 풍부한 맛과 향이 좋아요', value: 'blended_tea' },
      { label: '달콤하거나 상큼하게, 음료처럼 즐기고 싶어요', value: 'drink_type' },
    ],
  }
}

const PURE_TEA_SUBQUESTION = {
  title: 'Pure Tea Flavor',
  question: '어떤 느낌의 맛을 더 좋아하세요?',
  options: [
    {
      label: '산뜻하고 가벼운 맛이 좋아요',
      value: 'green_tea',
      image: pureGreenImg,
      imagePosition: 'center 100%',
    },
    { label: '고소하고 쌉싸름한 맛이 좋아요', value: 'matcha', image: pureMatchaImg },
    { label: '깊은 향과 묵직한 여운이 좋아요', value: 'fermented_tea', image: pureFermentedImg },
  ],
}

const BLENDED_TEA_SUBQUESTION = {
  title: 'Blended Tea Flavor',
  question: '어떤 맛과 향을 더 좋아하세요?',
  options: [
    { label: '상큼한 맛과 향이 좋아요', enLabel: 'Citrus', value: 'citrus' },
    { label: '화사한 꽃향과 맛이 좋아요', enLabel: 'Floral', value: 'floral' },
    { label: '구수하고 고소한 맛과 향이 좋아요', enLabel: 'Nutty', value: 'nutty' },
    { label: '달콤한 맛과 향이 좋아요', enLabel: 'Fruity', value: 'fruity' },
    { label: '은은하고 편안한 맛과 향이 좋아요', enLabel: 'Herbal', value: 'herbal' },
  ],
}

const DRINK_TYPE_SUBQUESTION = {
  title: 'Tea Drink Style',
  question: '어떤 스타일의 음료가 좋으세요?',
  options: [
    { label: '우유와 함께 즐기고 싶어요', value: 'milk_style' },
    { label: '가볍고 시원한 음료가 좋아요', value: 'cold_style' },
  ],
}

const HERB_BLEND_SUBQUESTION = {
  title: 'Herbal Tea Flavor',
  question: '과일향이 느껴지는 편이 좋으세요?',
  options: [
    { label: '은은한 과일향이 좋아요', value: 'fruity_herb' },
    { label: '플로럴, 풀향 같은 허브 본연의 향이 좋아요', value: 'herbal_essence' },
  ],
}

const MOOD_QUESTION = {
  title: 'Mood',
  question: '오늘 나에게 필요한 것은 무엇인가요?',
  options: [
    { label: '개운하고 산뜻한 기분', value: 'refreshing' },
    { label: '마음이 편안해지는 기분', value: 'calming' },
    { label: '새롭고 재미있는 경험', value: 'adventurous' },
    { label: '익숙하고 따뜻한 위안', value: 'comforting' },
    { label: '화사하고 향긋한 기분', value: 'fragrant' },
    { label: '나를 위한 작은 보상', value: 'reward' },
  ],
}

const CALMING_SUBQUESTION = {
  title: '', // 확인 배너가 제목을 대신함
  question: '한 가지 재료의 맛과 향이 좋으세요, 여러 재료가 어우러진 맛과 향이 좋으세요?',
  options: [
    { label: '한 가지 재료 본연의 맛과 향이 좋아요', value: 'single' },
    { label: '여러 재료가 어우러진 풍성한 맛과 향이 좋아요', value: 'blended' },
  ],
}

const MILK_NAMES = [
  '제주말차 밀크티', '얼그레이 밀크티', '제주호지차 밀크티', '호지샷 블렌드', '말차샷 블렌드',
  '삼다연 오리지널 밀크티', '제주말차 오트블렌드', '가루녹차', '프리미엄말차 밀크용', '마스터즈말차 밀크용',
]

const COLD_NAMES = [
  '말차플러스 그린', '말차플러스 유자', '말차플러스 자몽', '콤부차 애플민트', '콤부차 베리',
  '콤부차 레몬', '콜드브루 녹차', '콜드브루 홍차', '콜드브루 자스민', '콜드브루 페퍼민트',
  '콜드브루 히비스커스', '찬물 녹차 스틱', '찬물 호지차 스틱',
]

const FRUITY_HERB_NAMES = [
  '피치 캐모마일', '캐모마일 블렌드', '스윗 히비스커스', '체리 루이보스', '캐모마일 로지피치',
  '멜로우 민트', '루이보스 문라이트', '루이보스 체리벨벳', '히비스커스 콜드브루',
]

const HERBAL_ESSENCE_NAMES = ['페퍼민트 브리즈', '캐모마일 라벤더', '바질 보타닉 가든']
const MATCHA_PLUS_NAMES = ['말차플러스 그린', '말차플러스 유자', '말차플러스 자몽']
const KOMBUCHA_NAMES = ['콤부차 애플민트', '콤부차 베리', '콤부차 레몬']

const AROMA_TAG_NAME = { citrus: '시트러스', floral: '플로럴', nutty: '너티', fruity: '프루티', herbal: '허벌' }

// ── 상품 매칭 판단 함수들 (각자 독립된 기준으로 조합해서 사용) ──
const GREEN_TEA_NAMES = ['세작', '제주 순수 녹차', '일로향', '우전']

function isPureTeaType(product, sub) {
  const isPureFormat = product.format !== '찬물스틱티백' && product.format !== '세트'
  if (sub === 'green_tea') {
    return GREEN_TEA_NAMES.includes(product.name)
  }
  if (sub === 'matcha') {
    return product.base === '녹차/말차/호지차' && product.name.includes('말차') && isPureFormat
  }
  if (sub === 'fermented_tea') {
    return product.base === '홍차/발효차' && isPureFormat
  }
  return false
}

function isPureTeaAny(product) {
  return isPureTeaType(product, 'green_tea') || isPureTeaType(product, 'matcha') || isPureTeaType(product, 'fermented_tea')
}

function hasAromaTag(product, sub) {
  const tagName = AROMA_TAG_NAME[sub]
  return (product.product_tags ?? []).some((pt) => pt.tags?.category === 'flavor_aroma' && pt.tags?.name === tagName)
}

function hasAnyAromaTag(product) {
  return (product.product_tags ?? []).some((pt) => pt.tags?.category === 'flavor_aroma')
}

const SUBQUESTION_BY_FLAVOR = {
  pure_tea: PURE_TEA_SUBQUESTION,
  blended_tea: BLENDED_TEA_SUBQUESTION,
  drink_type: DRINK_TYPE_SUBQUESTION,
  blended_herb: HERB_BLEND_SUBQUESTION,
}

// 지금까지의 답변 경로(path)를 바탕으로 다음에 보여줄 화면을 계산 (질문 또는 결과)
function resolveScreen(selectedCard, path) {
  if (selectedCard === 'time') {
    const [timeAns, flavorAns, subAns] = path
    if (timeAns === undefined) return { type: 'question', q: TIME_QUESTION }
    if (flavorAns === undefined) return { type: 'question', q: getFlavorQuestion(timeAns) }
    if (flavorAns === 'pure_herb') {
      return { type: 'result', matcher: (p) => p.name === '루이보스 퓨어' }
    }
    if (subAns === undefined) {
      const q = SUBQUESTION_BY_FLAVOR[flavorAns]
      return q ? { type: 'question', q } : null
    }
    return { type: 'result', matcher: (p) => productMatchesFlavor(p, flavorAns, subAns) }
  }

  if (selectedCard === 'mood') {
    const [moodAns, subAns] = path
    if (moodAns === undefined) return { type: 'question', q: MOOD_QUESTION }

    if (moodAns === 'refreshing') return { type: 'result', matcher: (p) => COLD_NAMES.includes(p.name) }
    if (moodAns === 'reward') return { type: 'result', matcher: (p) => MILK_NAMES.includes(p.name) }
    if (moodAns === 'adventurous') {
      return {
        type: 'result',
        matcher: (p) => hasAnyAromaTag(p) || MATCHA_PLUS_NAMES.includes(p.name) || KOMBUCHA_NAMES.includes(p.name),
      }
    }
    if (moodAns === 'comforting') {
      if (subAns === undefined) return { type: 'question', q: PURE_TEA_SUBQUESTION }
      return { type: 'result', matcher: (p) => isPureTeaType(p, subAns) }
    }
    if (moodAns === 'fragrant') {
      if (subAns === undefined) return { type: 'question', q: BLENDED_TEA_SUBQUESTION }
      return { type: 'result', matcher: (p) => hasAromaTag(p, subAns) }
    }
    if (moodAns === 'calming') {
      if (subAns === undefined) return { type: 'question', q: CALMING_SUBQUESTION }
      const intro = '차분하게 쉬고 싶은 기분에 어울리는 차를 모아봤어요'
      if (subAns === 'single') {
        return { type: 'result', intro, matcher: (p) => isPureTeaAny(p) || p.name === '루이보스 퓨어' }
      }
      return {
        type: 'result',
        intro,
        matcher: (p) => hasAnyAromaTag(p) || FRUITY_HERB_NAMES.includes(p.name) || HERBAL_ESSENCE_NAMES.includes(p.name),
      }
    }
  }

  if (selectedCard === 'flavor') {
    const [flavorAns, subAns] = path
    // Time 답변 없이 바로 시작하는 경우라 caffeine/decaf 구분이 없음 → 'any'와 동일하게 3지선다
    if (flavorAns === undefined) return { type: 'question', q: getFlavorQuestion('any') }
    if (subAns === undefined) {
      const q = SUBQUESTION_BY_FLAVOR[flavorAns]
      return q ? { type: 'question', q } : null
    }
    return { type: 'result', matcher: (p) => productMatchesFlavor(p, flavorAns, subAns) }
  }

  return null
}

function productMatchesFlavor(product, flavor, sub) {
  if (flavor === 'pure_tea') return isPureTeaType(product, sub)
  if (flavor === 'blended_tea') return hasAromaTag(product, sub)
  if (flavor === 'drink_type') {
    if (sub === 'milk_style') return MILK_NAMES.includes(product.name)
    if (sub === 'cold_style') return COLD_NAMES.includes(product.name)
  }
  if (flavor === 'blended_herb') {
    if (sub === 'fruity_herb') return FRUITY_HERB_NAMES.includes(product.name)
    if (sub === 'herbal_essence') return HERBAL_ESSENCE_NAMES.includes(product.name)
  }
  return false
}

// 상단 진행바 단계 이름. 카드/답변에 따라 단계 수와 이름이 달라짐
function getStepLabels(selectedCard, path) {
  if (selectedCard === 'time') {
    const [, flavorAns] = path
    const hasSub = flavorAns && flavorAns !== 'pure_herb'
    if (!hasSub) return ['Time', 'Flavor', 'Result']
    const subLabel = CATEGORY_LABELS[flavorAns]?.enName ?? 'Flavor'
    return ['Time', 'Flavor', subLabel, 'Result']
  }

  if (selectedCard === 'mood') {
    const [moodAns] = path
    if (['comforting', 'fragrant', 'calming'].includes(moodAns)) {
      const subLabel = { comforting: 'Pure Tea', fragrant: 'Blended Tea', calming: 'Flavor' }[moodAns]
      return ['Mood', subLabel, 'Result']
    }
    return ['Mood', 'Result']
  }

  if (selectedCard === 'flavor') {
    const [flavorAns] = path
    if (!flavorAns) return ['Flavor', 'Result']
    const subLabel = CATEGORY_LABELS[flavorAns]?.enName ?? 'Flavor'
    return ['Flavor', subLabel, 'Result']
  }

  return []
}

function ResultList({ matcher, depsKey, intro }) {
  const [status, setStatus] = useState('loading')
  const [products, setProducts] = useState([])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    supabase
      .from('products')
      .select('id, name, price, base, format, is_caffeine_free, product_tags(tags(name, category))')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error(error)
          setStatus('error')
          return
        }
        setProducts(data.filter((p) => matcher(p)))
        setStatus('ready')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey])

  return (
    <div className="pt-2 text-left">
      <h2 className="text-sm font-semibold text-gray-500">추천 결과</h2>
      {intro && <p className="mt-2 text-sm text-gray-600">{intro}</p>}

      {status === 'loading' && <p className="mt-4 text-sm text-gray-500">상품을 찾고 있어요...</p>}
      {status === 'error' && <p className="mt-4 text-sm text-red-600">상품을 불러오지 못했어요.</p>}
      {status === 'ready' && products.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">조건에 맞는 상품을 찾지 못했어요.</p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {products.map((p) => (
          <div key={p.id} className="rounded-[2px] border border-black px-4 py-4">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold">{p.name}</p>
              {p.is_caffeine_free && (
                <span className="rounded-[2px] bg-sub-light px-1.5 py-0.5 text-[10px] text-gray-700">
                  무카페인
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {p.base} · {p.format} · {p.price.toLocaleString()}원
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// 선택지 카드 하나. opt.image를 넣으면 위에 이미지가 뜨고, 없으면 지금처럼 텍스트만 나옴
function OptionButton({ opt, letter, onSelect }) {
  if (opt.image) {
    return (
      <button
        type="button"
        onClick={() => onSelect(opt.value)}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] text-left transition active:scale-[0.98]"
      >
        <img
          src={opt.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: opt.imagePosition ?? 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
        <span className="absolute top-3 left-1/2 -translate-x-1/2 text-sm font-normal text-white drop-shadow">
          {letter}
        </span>
        <div className="relative flex h-full flex-col items-center justify-end px-2 pb-4 text-center text-xs tracking-tight whitespace-nowrap text-white">
          <span className="font-normal drop-shadow">
            {opt.enLabel && <span>{opt.enLabel} </span>}
            {opt.label}
          </span>
          {SHOW_OPTION_CAPTION && CATEGORY_LABELS[opt.value] && (
            <span className="mt-1 text-xs text-white/80">{CATEGORY_LABELS[opt.value].name}</span>
          )}
        </div>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(opt.value)}
      className="flex flex-col items-start gap-2 overflow-hidden rounded-[2px] border border-black text-left text-sm transition active:scale-[0.98]"
    >
      <div className="flex flex-col items-start gap-1 px-4 pb-4 pt-4">
        <span>
          <span className="font-bold">{letter}.</span>{' '}
          {opt.enLabel && <span className="font-bold">{opt.enLabel} </span>}
          {opt.label}
        </span>
        {SHOW_OPTION_CAPTION && CATEGORY_LABELS[opt.value] && (
          <span className="text-xs text-gray-400">{CATEGORY_LABELS[opt.value].name}</span>
        )}
      </div>
    </button>
  )
}

function Finder() {
  // step 0: 카드 선택 화면, step 1~: 질문/결과 화면
  const [step, setStep] = useState(0)
  const [selectedCard, setSelectedCard] = useState(null)
  // 답한 값을 순서대로 저장 (카드마다 슬롯의 의미가 다름 — resolveScreen에서 해석)
  const [path, setPath] = useState([])

  const handleSelectCard = (key) => {
    setSelectedCard(key)
    setStep(1)
  }

  const handleAnswer = (value) => {
    setPath((prev) => [...prev.slice(0, step - 1), value])
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step === 1) {
      setSelectedCard(null)
      setPath([])
    } else {
      setPath((prev) => prev.slice(0, step - 2))
    }
    setStep((s) => Math.max(0, s - 1))
  }

  const screen = resolveScreen(selectedCard, path)
  const stepLabels = getStepLabels(selectedCard, path)

  // 바로 전 단계에서 고른 값이 카테고리면, 확인 배너로 보여줌
  const lastValue = path[step - 2]
  const bannerCategory = lastValue ? CATEGORY_LABELS[lastValue] : null

  return (
    <div>
      {step > 0 && (
        <div className="flex items-center gap-3 px-6 pt-6">
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={handleBack}
            className="flex h-6 w-6 shrink-0 items-center justify-center"
          >
            <img src={arrowIcon} alt="" className="h-6 w-6 rotate-180" />
          </button>

          <div className="flex flex-1 gap-1.5">
            {stepLabels.map((label, i) => {
              const stepNum = i + 1
              const isCurrent = step === stepNum
              const isDone = step > stepNum
              // 뒤로 갈수록 점점 진해지는 그라데이션 (최소 40% ~ 최대 100%)
              const shade = Math.round(20 + (80 * (i + 1)) / stepLabels.length)
              const fillStyle = isCurrent || isDone ? { opacity: shade / 100 } : undefined
              return (
                <div key={`${label}-${stepNum}`} className="flex flex-1 flex-col items-start gap-1">
                  <div className="flex items-center gap-1">
                    <span
                      style={fillStyle}
                      className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full text-[7px] font-semibold ${
                        isCurrent || isDone
                          ? 'bg-primary text-white'
                          : 'border border-gray-300 text-gray-400'
                      }`}
                    >
                      {stepNum}
                    </span>
                    <span
                      className={`text-[10px] whitespace-nowrap ${
                        isCurrent ? 'font-semibold text-primary' : 'text-gray-400'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  <span
                    style={i < step ? { opacity: shade / 100 } : undefined}
                    className={`h-1 w-full rounded-full ${i < step ? 'bg-primary' : 'bg-gray-200'}`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className={step > 0 ? 'px-6 pt-5' : 'px-6 pt-6'}>
        {step === 0 && (
          <div className="pt-4 text-center">
            <h1 className="text-xl font-bold">Find Your Taste</h1>
            <p className="mt-2 text-sm text-gray-600">먼저 답하고 싶은 질문의 카드를 골라주세요.</p>

            <div className="mt-6 flex gap-3">
              {CARDS.map((card) => (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => handleSelectCard(card.key)}
                  className="flex h-56 flex-1 flex-col items-center justify-center rounded-[2px] border border-black px-2 text-center transition active:scale-[0.98]"
                >
                  <span className="text-sm font-bold">{card.title}</span>
                  <span className="mt-2 text-xs leading-relaxed tracking-tight break-keep text-gray-700">
                    {card.question}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step > 0 && bannerCategory && (
          <div className="mb-4 rounded-[2px] bg-gray-50 px-3 py-3 text-center text-base font-semibold text-gray-800">
            {bannerCategory.banner ?? bannerCategory.desc ?? bannerCategory.name}
          </div>
        )}

        {screen?.type === 'question' && (
          <div className="text-left">
            {screen.q.title && <h2 className="text-xs font-semibold text-gray-400">{screen.q.title}</h2>}
            <p className={screen.q.title ? 'mt-2 text-base' : 'text-base'}>{screen.q.question}</p>

            <div
              className={
                screen.q.options.some((o) => o.image)
                  ? 'mt-6 grid grid-cols-2 gap-3'
                  : 'mt-6 flex flex-col gap-3'
              }
            >
              {screen.q.options.map((opt, i) => (
                <OptionButton key={opt.label} opt={opt} letter={LETTERS[i]} onSelect={handleAnswer} />
              ))}
            </div>
          </div>
        )}

        {screen?.type === 'result' && (
          <ResultList
            matcher={screen.matcher}
            intro={screen.intro}
            depsKey={`${selectedCard}-${path.join('|')}`}
          />
        )}
      </div>
    </div>
  )
}

export default Finder
