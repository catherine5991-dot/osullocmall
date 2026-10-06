import { useState } from 'react'
import cartIcon from '../assets/icon-cart.png'
import menuIcon from '../assets/icon-menu.png'
import searchIcon from '../assets/icon-search.png'
import logo from '../assets/osulloc-logo.png'
import GnbDrawer from './GnbDrawer.jsx'

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 relative">
        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={() => setOpen(true)}
          className="flex h-6 w-6 items-center justify-center"
        >
          <img src={menuIcon} alt="" className="h-6 w-6" />
        </button>

        <img
          src={logo}
          alt="OSULLOC"
          className="absolute left-1/2 h-[18px] w-auto -translate-x-1/2"
        />

        <div className="flex items-center gap-4">
          <button type="button" aria-label="검색" className="flex h-6 w-6 items-center justify-center">
            <img src={searchIcon} alt="" className="h-6 w-6" />
          </button>
          <button type="button" aria-label="장바구니" className="flex h-6 w-6 items-center justify-center">
            <img src={cartIcon} alt="" className="h-6 w-6" />
          </button>
        </div>
      </header>

      <GnbDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default Header
