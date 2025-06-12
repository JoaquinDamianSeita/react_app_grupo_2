import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Snackbar from '../utils/Snackbar'

export default function Products() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)
  const [filters, setFilters] = useState({
    title: '',
    minPrice: '',
    maxPrice: '',
    artType: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, products])

  const fetchProducts = async () => {
    const token = localStorage.getItem('accessToken')
      
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch('http://localhost:8080/api/nfts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login')
          return
        }
        throw new Error('Error al obtener los productos')
      }

      const data = await response.json()
      // Filtrar solo productos disponibles antes de guardarlos en el estado
      const availableProducts = data.filter(product => product.available)
      setProducts(availableProducts)
      setFilteredProducts(availableProducts)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setShowError(true)
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProductClick = (productId) => {
    // TODO: Implementar navegación al detalle del producto
    // navigate(`/products/${productId}`)
    alert(`Navegando al detalle del producto ${productId}`)
  }

  const applyFilters = () => {
    let filtered = [...products]

    if (filters.title) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(filters.title.toLowerCase())
      )
    }

    if (filters.minPrice) {
      filtered = filtered.filter(product => 
        product.price >= parseFloat(filters.minPrice)
      )
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => 
        product.price <= parseFloat(filters.maxPrice)
      )
    }

    if (filters.artType) {
      filtered = filtered.filter(product => 
        product.artType === filters.artType
      )
    }

    setFilteredProducts(filtered)
  }

  const handleCloseError = () => {
    setShowError(false)
    setError('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl font-reem text-gray-600">Cargando productos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyan-600 py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={filters.title}
                onChange={handleFilterChange}
                className="block w-full rounded-md px-3 py-2 text-gray-900 bg-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
                placeholder="Buscar por título"
              />
            </div>

            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio mínimo
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="block w-full rounded-md px-3 py-2 text-gray-900 bg-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio máximo
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="block w-full rounded-md px-3 py-2 text-gray-900 bg-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
                placeholder="999999"
              />
            </div>

            <div>
              <label htmlFor="artType" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de arte
              </label>
              <select
                id="artType"
                name="artType"
                value={filters.artType}
                onChange={handleFilterChange}
                className="block w-full rounded-md px-3 py-2 text-gray-900 bg-white outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600"
              >
                <option value="">Todos</option>
                <option value="DIGITAL">Digital</option>
                <option value="PHYSICAL">Físico</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No se encontraron productos con los filtros seleccionados</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-gray-50 rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:bg-gray-100 cursor-pointer" 
                onClick={() => handleProductClick(product.id)}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={product.imageUrls[0]} 
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
                          <p className="text-gray-600 mb-4">{product.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                              {product.artType === 'DIGITAL' ? 'Digital' : 'Físico'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Snackbar
        show={showError}
        message={error}
        variant="error"
        onClose={handleCloseError}
        position="bottom-right"
      />
    </div>
  )
} 