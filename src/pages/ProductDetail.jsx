import { useParams } from 'react-router-dom'

function ProductDetail() {
  const { id } = useParams()

  return (
    <div className="px-6 pt-16 text-center">
      <h1 className="text-xl font-semibold">상품 상세</h1>
      <p className="mt-2 text-sm text-gray-600">상품 ID: {id} (준비중)</p>
    </div>
  )
}

export default ProductDetail
