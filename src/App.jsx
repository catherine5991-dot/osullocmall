import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Finder from './pages/Finder.jsx'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import ProductList from './pages/ProductList.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/finder" element={<Finder />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Route>
    </Routes>
  )
}

export default App
