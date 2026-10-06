import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function ProductList() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, price, base, format')
      .order('name')
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
          setStatus('error')
          return
        }
        setProducts(data)
        setStatus('ready')
      })
  }, [])

  return (
    <div className="px-6 pt-8">
      <h1 className="text-xl font-semibold">전체 상품</h1>

      {status === 'loading' && <p className="mt-4 text-sm text-gray-500">불러오는 중...</p>}
      {status === 'error' && (
        <p className="mt-4 text-sm text-red-600">상품을 불러오지 못했어요. Supabase 연결을 확인해주세요.</p>
      )}
      {status === 'ready' && (
        <p className="mt-2 text-sm text-gray-600">총 {products.length}개 상품</p>
      )}

      <ul className="mt-4 flex flex-col gap-3">
        {products.map((p) => (
          <li key={p.id} className="rounded-lg border border-gray-100 p-3">
            <p className="text-sm font-medium">{p.name}</p>
            <p className="mt-1 text-xs text-gray-500">
              {p.base} · {p.format} · {p.price.toLocaleString()}원
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductList
