import { Link } from 'react-router-dom'

// 홈 화면 문구는 여기 한 곳에서만 관리
const HOME_COPY = {
  title: 'Find Your Taste',
  descriptionLines: ['마음에 드는 카드를 고르다 보면', '오늘 마시고 싶은 차를 만날 수 있어요.'],
  button: '차 취향 찾기 시작',
}

function Home() {
  return (
    <div className="flex flex-col items-center gap-6 px-6 pt-16 text-center">
      <h1 className="text-2xl font-semibold">{HOME_COPY.title}</h1>
      <p className="text-sm text-gray-600">
        {HOME_COPY.descriptionLines[0]}
        <br />
        {HOME_COPY.descriptionLines[1]}
      </p>
      <Link
        to="/finder"
        className="flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
      >
        {HOME_COPY.button}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M13 6L19 12L13 18"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  )
}

export default Home
