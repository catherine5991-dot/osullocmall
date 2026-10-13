import { useState } from 'react'
import { Link } from 'react-router-dom'
import homeIntroBg from '../assets/home-intro-bg.png'
import menuIcon from '../assets/icon-menu.png'
import GnbDrawer from '../components/GnbDrawer.jsx'

// 홈 화면 문구는 여기 한 곳에서만 관리
const HOME_COPY = {
  title: 'Find Your Taste',
  descriptionLines: ['마음에 드는 카드를 고르다 보면', '오늘 마시고 싶은 차를 만날 수 있어요.'],
  button: '시작하기',
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-cover px-6 text-center"
      style={{ backgroundImage: `url(${homeIntroBg})`, backgroundPosition: '30% center' }}
    >
      <button
        type="button"
        aria-label="메뉴 열기"
        onClick={() => setMenuOpen(true)}
        className="absolute top-6 left-6 flex h-6 w-6 items-center justify-center"
      >
        <img src={menuIcon} alt="" className="h-6 w-6" />
      </button>

      <GnbDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      <h1 className="text-3xl font-bold tracking-[0.1em] text-white uppercase drop-shadow">{HOME_COPY.title}</h1>
      <p className="text-sm leading-relaxed text-white/90 drop-shadow">
        {HOME_COPY.descriptionLines[0]}
        <br />
        {HOME_COPY.descriptionLines[1]}
      </p>
      <Link
        to="/finder"
        className="rounded-full bg-white/90 px-10 py-3 text-sm font-semibold text-gray-900"
      >
        {HOME_COPY.button}
      </Link>
    </div>
  )
}

export default Home
