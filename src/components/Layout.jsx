import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'

function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
