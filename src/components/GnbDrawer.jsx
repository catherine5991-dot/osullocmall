import { useState } from 'react'
import { Link } from 'react-router-dom'

const productItems = [
  { label: '티 제품', to: '/products' },
  { label: '티푸드', href: 'https://www.osulloc.com/kr/ko/shop/item/list?category=bakery' },
  { label: '라이프스타일', href: 'https://www.osulloc.com/kr/ko/shop/item/list?category=themashop' },
  { label: '차 취향 찾기', to: '/', isNew: true },
]

const utilityItems = ['매장찾기', '공지사항', '고객센터', '뷰티포인트 추후 적립']

function GnbDrawer({ open, onClose }) {
  const [productOpen, setProductOpen] = useState(true)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-30">
      <button
        type="button"
        aria-label="배경 닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-[420px] flex-col overflow-y-auto bg-white text-left">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-gray-600">
            로그인 <span aria-hidden>&gt;</span>
          </span>
          <button type="button" aria-label="메뉴 닫기" onClick={onClose} className="text-xl">
            ✕
          </button>
        </div>

        <div className="border-t border-gray-100">
          <button
            type="button"
            onClick={() => setProductOpen((v) => !v)}
            className={`flex w-full items-center justify-between px-5 py-4 text-base font-semibold ${
              productOpen ? 'text-primary' : 'text-gray-900'
            }`}
          >
            제품
            <span aria-hidden>{productOpen ? '︿' : '﹀'}</span>
          </button>
          {productOpen && (
            <ul className="bg-gray-50">
              {productItems.map((item) => {
                const content = (
                  <>
                    {item.label}
                    {item.isNew && (
                      <span className="rounded-full bg-sub px-2 py-0.5 text-[10px] font-semibold text-white">
                        NEW
                      </span>
                    )}
                  </>
                )

                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={onClose}
                        className="flex items-center gap-2 px-5 py-3 text-sm text-gray-800"
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className="flex items-center gap-2 px-5 py-3 text-sm text-gray-800"
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <a
          href="https://www.osulloc.com/kr/ko/shop/item/gift_new"
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="block border-t border-gray-100 px-5 py-4 text-base font-semibold text-gray-900"
        >
          기프트
        </a>
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-base font-semibold text-gray-900">
          티 라이프
          <span aria-hidden>﹀</span>
        </div>
        <div className="border-t border-gray-100 px-5 py-4 text-base font-semibold text-gray-900">
          단체 및 기업 구매
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-gray-100 p-4 text-sm text-gray-700">
          {utilityItems.map((label) => (
            <span key={label} className="rounded bg-gray-50 px-3 py-3 text-center">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GnbDrawer
