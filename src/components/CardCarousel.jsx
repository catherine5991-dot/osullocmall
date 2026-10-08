import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// 모션 관련 수치를 한 곳에 모아 조정 가능하게 함
const TUNING = {
  perspective: 1200, // px, 부모에 걸리는 3D 원근감 강도
  rotateAngle: 62, // deg, 바로 옆 카드가 꺾이는 각도
  farRotateExtra: 14, // deg, 그 너머 카드가 추가로 더 꺾이는 정도
  cardGap: 58, // %, 바로 옆 카드의 translateX (카드 자신의 폭 기준)
  farGapExtra: 20, // %, 그 너머 카드의 추가 이동
  translateZSide: -110, // px, 옆 카드가 뒤로 밀려나는 깊이
  translateZFar: -170, // px, 그 너머 카드가 밀려나는 깊이
  scaleSide: 0.86,
  scaleFar: 0.76,
  opacityFarDrop: 1.4, // 옆 카드는 거의 그대로 보이고, 그 너머부터 빠르게 사라짐
  zIndexSpread: 40,
  duration: 420, // ms, 한 칸 이동(스냅) 시간
  reducedDuration: 150,
  easing: [0.65, 0, 0.35, 1], // ease-in-out, 바운스/오버슈트 없음
  flickVelocity: 0.5, // px/ms
  tapThreshold: 6, // px
  autoRotateMs: 3500,
  textFadeRate: 2.2, // 질문 문구가 사라지는 속도
  labelShift: 8, // %, 옆 카드 라벨이 바깥으로 밀리는 정도
}

function mod3(x) {
  return ((x % 3) + 3) % 3
}

// 3칸짜리 순환에서 가장 짧은 경로로 가는 차이값
function shortestDiff(target, start) {
  let diff = target - start
  diff -= 3 * Math.round(diff / 3)
  return diff
}

// i번 카드의 현재 시각 상태를, 중앙과의 연속 거리(p)로부터 계산
// near: 0(중앙)~1(바로 옆), far: 그 너머로 더 꺾여 사라지는 구간
function computeCardStyle(i, p) {
  const d = mod3(i - p + 1.5) - 1.5
  const t = Math.abs(d)
  const s = Math.sign(d)
  const near = Math.min(t, 1)
  const far = Math.max(t - 1, 0)

  const rotateY = -s * (near * TUNING.rotateAngle + far * TUNING.farRotateExtra)
  const x = s * (near * TUNING.cardGap + far * TUNING.farGapExtra)
  const translateZ = near * TUNING.translateZSide + far * (TUNING.translateZFar - TUNING.translateZSide)
  const scale = 1 - near * (1 - TUNING.scaleSide) - far * (TUNING.scaleSide - TUNING.scaleFar)
  const opacity = Math.min(1, Math.max(0, 1 - far * TUNING.opacityFarDrop))
  const zIndex = Math.round(100 - t * TUNING.zIndexSpread)
  const textOpacity = Math.min(1, Math.max(0, 1 - t * TUNING.textFadeRate))
  const labelShift = s * near * TUNING.labelShift

  return { x, translateZ, scale, opacity, zIndex, rotateY, textOpacity, labelShift }
}

// CSS cubic-bezier(x1,y1,x2,y2)를 JS에서 근사 계산 (Newton-Raphson)
function bezierEase(t, x1, y1, x2, y2) {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const sampleX = (u) => ((ax * u + bx) * u + cx) * u
  const sampleY = (u) => ((ay * u + by) * u + cy) * u
  const sampleDerivX = (u) => (3 * ax * u + 2 * bx) * u + cx
  let u = t
  for (let i = 0; i < 8; i++) {
    const x = sampleX(u) - t
    if (Math.abs(x) < 1e-5) break
    const d = sampleDerivX(u)
    if (Math.abs(d) < 1e-6) break
    u -= x / d
  }
  return sampleY(u)
}

function CardCarousel({ cards, onSelect }) {
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const textRefs = useRef([])
  const labelRefs = useRef([])
  const pRef = useRef(0)
  const animRef = useRef(null)
  const dragRef = useRef(null)
  const justDraggedRef = useRef(false)
  const autoTimerRef = useRef(null)
  const autoStoppedRef = useRef(false)
  const wheelLastRef = useRef(0)

  const [activeIndex, setActiveIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  const applyStyles = (p) => {
    cards.forEach((_, i) => {
      const { x, translateZ, scale, opacity, zIndex, rotateY, textOpacity, labelShift } = computeCardStyle(i, p)
      const el = cardRefs.current[i]
      if (el) {
        const rotate = reducedMotion ? 0 : rotateY
        const tz = reducedMotion ? 0 : translateZ
        el.style.transform = `translateX(calc(-50% + ${x}%)) translateZ(${tz}px) rotateY(${rotate}deg) scale(${scale})`
        el.style.opacity = String(opacity)
        el.style.zIndex = String(zIndex)
      }
      const textEl = textRefs.current[i]
      if (textEl) textEl.style.opacity = String(textOpacity)
      const labelEl = labelRefs.current[i]
      if (labelEl) labelEl.style.transform = `translateX(${labelShift}%)`
    })
  }

  useLayoutEffect(() => {
    applyStyles(pRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stopAutoRotate = () => {
    autoStoppedRef.current = true
    clearTimeout(autoTimerRef.current)
  }

  const animateTo = (target) => {
    cancelAnimationFrame(animRef.current)
    const start = pRef.current
    const diff = shortestDiff(target, start)
    const duration = reducedMotion ? TUNING.reducedDuration : TUNING.duration
    const startTime = performance.now()

    const step = (now) => {
      const elapsed = now - startTime
      const tRaw = Math.min(1, elapsed / duration)
      const eased = reducedMotion ? tRaw : bezierEase(tRaw, ...TUNING.easing)
      const p = mod3(start + diff * eased)
      pRef.current = p
      applyStyles(p)
      if (tRaw < 1) {
        animRef.current = requestAnimationFrame(step)
      } else {
        pRef.current = mod3(start + diff)
        applyStyles(pRef.current)
        setActiveIndex(mod3(Math.round(pRef.current)))
      }
    }
    animRef.current = requestAnimationFrame(step)
  }

  // 사용자가 조작하기 전까지 계속 자동으로 한 칸씩 회전
  useEffect(() => {
    if (reducedMotion) return undefined

    const tick = () => {
      if (autoStoppedRef.current) return
      animateTo(Math.round(pRef.current) + 1)
      autoTimerRef.current = setTimeout(tick, TUNING.autoRotateMs)
    }
    autoTimerRef.current = setTimeout(tick, TUNING.autoRotateMs)
    return () => clearTimeout(autoTimerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  const selectCard = (i) => {
    stopAutoRotate()
    cancelAnimationFrame(animRef.current)
    const duration = reducedMotion ? 200 : 400
    cards.forEach((_, idx) => {
      const el = cardRefs.current[idx]
      if (!el) return
      el.style.transition = `transform ${duration}ms cubic-bezier(0.22,1,0.36,1), opacity ${duration}ms ease`
      if (idx === i) {
        el.style.transform = 'translateX(-50%) translateZ(0px) rotateY(0deg) scale(1.12)'
        el.style.zIndex = '200'
      } else {
        el.style.transform = `${el.style.transform} translateY(24px) scale(0.8)`
        el.style.opacity = '0'
      }
    })
    setTimeout(() => onSelect(cards[i].key), duration)
  }

  const handlePointerDown = (e) => {
    stopAutoRotate()
    cancelAnimationFrame(animRef.current)
    const cardWidth = cardRefs.current[0]?.offsetWidth || 200
    dragRef.current = {
      startX: e.clientX,
      startP: pRef.current,
      moved: 0,
      cardWidth,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
    }
  }

  const handlePointerMove = (e) => {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    d.moved = Math.max(d.moved, Math.abs(dx))
    const now = performance.now()
    const dt = now - d.lastT
    if (dt > 0) d.velocity = (e.clientX - d.lastX) / dt
    d.lastX = e.clientX
    d.lastT = now

    const newP = mod3(d.startP - dx / (d.cardWidth * (TUNING.cardGap / 100)))
    pRef.current = newP
    applyStyles(newP)
  }

  const handlePointerUp = () => {
    const d = dragRef.current
    if (!d) return
    dragRef.current = null
    if (d.moved >= TUNING.tapThreshold) {
      justDraggedRef.current = true
      const nearest = Math.round(pRef.current)
      const target = Math.abs(d.velocity) > TUNING.flickVelocity ? nearest + (d.velocity < 0 ? 1 : -1) : nearest
      animateTo(target)
    }
  }

  const handleCardClick = (i) => () => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false
      return
    }
    const nearest = mod3(Math.round(pRef.current))
    if (nearest === i) {
      selectCard(i)
    } else {
      stopAutoRotate()
      animateTo(i)
    }
  }

  const handleKeyDown = (e) => {
    const nearest = Math.round(pRef.current)
    if (e.key === 'ArrowLeft') {
      stopAutoRotate()
      animateTo(nearest - 1)
    } else if (e.key === 'ArrowRight') {
      stopAutoRotate()
      animateTo(nearest + 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      selectCard(mod3(nearest))
    }
  }

  // 트랙패드/마우스 휠 가로 스크롤 지원 (passive:false로 등록해야 preventDefault가 먹힘)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined

    const onWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 4) return
      e.preventDefault()
      const now = performance.now()
      if (now - wheelLastRef.current < 350) return
      wheelLastRef.current = now
      stopAutoRotate()
      const nearest = Math.round(pRef.current)
      animateTo(nearest + (delta > 0 ? 1 : -1))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div
        ref={trackRef}
        className="relative mt-6 h-[330px] touch-pan-y select-none outline-none"
        style={{ perspective: reducedMotion ? 'none' : `${TUNING.perspective}px` }}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        {cards.map((card, i) => (
          <div
            key={card.key}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            onClick={handleCardClick(i)}
            className="absolute top-0 left-1/2 h-[330px] w-[200px] cursor-pointer rounded-[8px] border border-black bg-white px-3 pt-8 text-center"
            style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
          >
            <span
              ref={(el) => {
                labelRefs.current[i] = el
              }}
              className="block text-sm font-bold"
            >
              {card.title}
            </span>
            <div
              ref={(el) => {
                textRefs.current[i] = el
              }}
              className="mt-2 text-xs leading-relaxed text-gray-700"
            >
              {card.question}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {cards.map((card, i) => (
          <button
            key={card.key}
            type="button"
            aria-label={card.title}
            onClick={() => {
              stopAutoRotate()
              animateTo(i)
            }}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === activeIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default CardCarousel
