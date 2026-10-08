import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'

function Layout() {
  const { pathname } = useLocation()
  const hideHeader = pathname.startsWith('/finder')

  return (
    <div className="flex min-h-svh flex-col">
      {!hideHeader && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
