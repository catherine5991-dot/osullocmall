import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDisplayBase } from '../lib/productClassification.js'
import { supabase } from '../lib/supabaseClient'

const THUMB_COLORS = {
  '녹차/말차/호지차': 'bg-sub-light',
  '홍차/발효차': 'bg-amber-100',
  허브: 'bg-rose-100',
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.5C12 20.5 3.5 15.5 3.5 9.5C3.5 6.5 5.8 4.5 8.5 4.5C10 4.5 11.3 5.2 12 6.3C12.7 5.2 14 4.5 15.5 4.5C18.2 4.5 20.5 6.5 20.5 9.5C20.5 15.5 12 20.5 12 20.5Z"
        stroke="black"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [product, setProduct] = useState(null)
  const [recommended, setRecommended] = useState([])
  const [recoReason, setRecoReason] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0) // 0~1
  const recoScrollRef = useRef(null)
  const trackRef = useRef(null)
  const draggingRef = useRef(false)

  const handleRecoScroll = () => {
    const el = recoScrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0)
  }

  // 슬라이드바를 클릭/드래그하면 그 위치에 맞춰 추천 목록을 스크롤
  const scrollToFraction = (clientX) => {
    const track = trackRef.current
    const scrollEl = recoScrollRef.current
    if (!track || !scrollEl) return
    const rect = track.getBoundingClientRect()
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const max = scrollEl.scrollWidth - scrollEl.clientWidth
    scrollEl.scrollLeft = fraction * max
    setScrollProgress(fraction)
  }

  const handleTrackPointerDown = (e) => {
    draggingRef.current = true
    e.target.setPointerCapture?.(e.pointerId)
    scrollToFraction(e.clientX)
  }
  const handleTrackPointerMove = (e) => {
    if (!draggingRef.current) return
    scrollToFraction(e.clientX)
  }
  const handleTrackPointerUp = () => {
    draggingRef.current = false
  }

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setRecommended([])

    supabase
      .from('products')
      .select('id, name, description, heritage_copy, price, base, format, is_caffeine_free, is_organic, product_tags(tags(name, category))')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error(error)
          setStatus('error')
          return
        }
        setProduct(data)
        setStatus('ready')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  // 내 취향의 다른 제품 추천: 같은 향 태그 우선, 모자라면 같은 베이스로 채움
  useEffect(() => {
    if (!product) return undefined
    let cancelled = false

    supabase
      .from('products')
      .select('id, name, price, base, format, is_caffeine_free, product_tags(tags(name, category))')
      .neq('id', product.id)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return

        const myAromaTags = (product.product_tags ?? [])
          .map((pt) => pt.tags)
          .filter((t) => t?.category === 'flavor_aroma')
          .map((t) => t.name)

        const hasSharedAroma = (p) =>
          (p.product_tags ?? []).some(
            (pt) => pt.tags?.category === 'flavor_aroma' && myAromaTags.includes(pt.tags.name),
          )

        let picks = []
        let reason = ''
        if (myAromaTags.length > 0) {
          picks = data.filter(hasSharedAroma)
          if (picks.length > 0) reason = `비슷한 향(${myAromaTags.join(', ')})의 다른 상품이에요`
        }
        if (picks.length < 4) {
          const sameBase = data.filter((p) => p.base === product.base && !picks.includes(p))
          picks = [...picks, ...sameBase]
          if (!reason) reason = '같은 종류의 다른 상품이에요'
        }

        setRecommended(picks.slice(0, 6))
        setRecoReason(reason)
      })

    return () => {
      cancelled = true
    }
  }, [product])

  if (status === 'loading') {
    return <p className="px-6 pt-16 text-center text-sm text-gray-500">상품을 불러오는 중이에요...</p>
  }

  if (status === 'error' || !product) {
    return <p className="px-6 pt-16 text-center text-sm text-red-600">상품을 찾지 못했어요.</p>
  }

  const thumbColor = THUMB_COLORS[product.base] ?? 'bg-gray-100'
  const aromaTags = (product.product_tags ?? [])
    .map((pt) => pt.tags)
    .filter((t) => t?.category === 'flavor_aroma')
    .map((t) => t.name)
  const displayBase = getDisplayBase(product)

  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 px-6 pt-6">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          className="flex h-6 w-6 items-center justify-center text-lg"
        >
          ←
        </button>
      </div>

      {/* 1. 상품 이미지 (실제 사진 없는 프로토타입이라 카테고리 색상 블록으로 대체) */}
      <div className={`relative mx-6 mt-4 aspect-square rounded-[2px] ${thumbColor}`}>
        <button
          type="button"
          aria-label="찜하기"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90"
        >
          <HeartIcon />
        </button>
      </div>

      {/* 2. 상품명 + 3. 가격정보 */}
      <div className="px-6 pt-5 text-left">
        <h1 className="flex items-center gap-1.5 text-lg font-bold">
          {product.name}
          {product.is_caffeine_free && (
            <span className="shrink-0 rounded-[2px] bg-sub-light px-1.5 py-0.5 text-[10px] font-normal text-gray-700">
              무카페인
            </span>
          )}
          {product.is_organic && (
            <span className="shrink-0 rounded-[2px] bg-sub-light px-1.5 py-0.5 text-[10px] font-normal text-gray-700">
              유기농
            </span>
          )}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {displayBase} | {product.format}
          {aromaTags.length > 0 && !displayBase.includes('블렌디드티') ? ' · 블렌디드티' : ''}
        </p>
        <p className="mt-3 text-xl font-bold">{product.price.toLocaleString()}원</p>
      </div>

      {/* 4. 구매옵션 및 액션 */}
      <div className="mt-5 flex gap-2 px-6">
        <button
          type="button"
          className="flex-1 rounded-[2px] border border-black bg-white py-3 text-sm font-semibold"
        >
          장바구니
        </button>
        <button type="button" className="flex-1 rounded-[2px] bg-primary py-3 text-sm font-semibold text-white">
          구매하기
        </button>
      </div>

      {/* 5. 배송안내 */}
      <p className="mt-4 px-6 text-xs text-gray-400">낮 12시까지 주문 시 1~3일 내 수령 가능 (제주 발송)</p>

      <div className="mt-8 border-t border-gray-100" />

      {/* 6. 상품설명 */}
      <div className="px-6 pt-6 text-left">
        <h2 className="text-sm font-semibold text-gray-500">Key Points</h2>
        <p className="mt-2 text-base leading-relaxed">
          {product.heritage_copy ?? product.description}
        </p>

        {product.description && product.heritage_copy && (
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{product.description}</p>
        )}

        <div className="mt-6 flex flex-col gap-3 rounded-[2px] border border-gray-100 bg-gray-50 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">베이스</span>
            <span className="font-medium">{displayBase}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">제형</span>
            <span className="font-medium">{product.format}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">카페인</span>
            <span className="font-medium">{product.is_caffeine_free ? '없음' : '있음'}</span>
          </div>
          {aromaTags.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Tasting Notes</span>
              <span className="font-medium">{aromaTags.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {recommended.length > 0 && (
        <>
          <div className="mt-8 border-t border-gray-100" />

          {/* 7. 내 취향의 다른 제품 추천 */}
          <div className="pt-6 text-left">
            <div className="px-6">
              <h2 className="text-sm font-semibold text-gray-500">내 취향의 다른 제품</h2>
              {recoReason && <p className="mt-1 text-xs text-gray-400">{recoReason}</p>}
            </div>

            <div
              ref={recoScrollRef}
              onScroll={handleRecoScroll}
              className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ msOverflowStyle: 'none' }}
            >
              {recommended.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/products/${rp.id}`}
                  className="w-28 shrink-0 snap-start text-left"
                >
                  <div className={`aspect-square w-full rounded-[2px] ${THUMB_COLORS[rp.base] ?? 'bg-gray-100'}`} />
                  <p className="mt-2 line-clamp-2 text-xs leading-snug font-semibold">{rp.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{rp.price.toLocaleString()}원</p>
                </Link>
              ))}
            </div>

            {recommended.length > 3 && (
              <div
                ref={trackRef}
                onPointerDown={handleTrackPointerDown}
                onPointerMove={handleTrackPointerMove}
                onPointerUp={handleTrackPointerUp}
                onPointerCancel={handleTrackPointerUp}
                className="mt-2 flex h-4 w-full cursor-pointer items-center px-6 touch-none select-none"
              >
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full w-1/4 rounded-full bg-primary transition-transform"
                    style={{ transform: `translateX(${scrollProgress * 300}%)` }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-8 border-t border-gray-100" />

      {/* 10. 배송/교환/반품 안내 */}
      <div className="px-6 pt-6 text-left">
        <h2 className="text-sm font-semibold text-gray-500">배송 · 교환 · 반품 안내</h2>
        <p className="mt-2 text-xs leading-relaxed text-gray-500">
          제주에서 전국으로 배송돼요. 배송비는 2,500원이며 3만원 이상 구매 시 무료예요. 단순 변심에 의한 교환·반품은
          상품 수령 후 7일 이내 가능해요.
        </p>
      </div>
    </div>
  )
}

export default ProductDetail
