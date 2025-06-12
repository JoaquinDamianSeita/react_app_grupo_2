import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const navigate = useNavigate();
    const [checkoutData, setCheckoutData] = useState(null);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [isProcessing, setIsProcessing] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR');
    };

    const handleCheckout = async () => {
        try {
            setIsProcessing(true);
            const token = localStorage.getItem('accessToken');
            const cartId = localStorage.getItem('cartId');
            
            if (!cartId) {
                throw new Error('No hay carrito activo');
            }

            const response = await fetch(`http://localhost:8080/api/cart/checkout/${cartId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "http://localhost:5173"
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al procesar el checkout');
            }

            const data = await response.json();
            setCheckoutData(data);
            
            // Limpiar el carrito después del checkout exitoso
            localStorage.removeItem('cartId');
        } catch (error) {
            console.error('Error en el checkout:', error);
            setError(error.message || 'Error al procesar el checkout');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-cyan-700 flex items-center justify-center py-12">
            <div className="flex gap-10 w-full max-w-6xl">
                <div className="bg-white rounded-lg shadow-lg flex-1 p-12 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold mb-10">Checkout</h2>
                    {error ? (
                        <div className="text-red-500 text-center font-semibold mb-6">
                            {error}
                            <button
                                onClick={() => navigate('/cart')}
                                className="w-full bg-cyan-700 text-white py-3 rounded text-lg hover:bg-cyan-800 transition mt-4"
                            >
                                Volver al Carrito
                            </button>
                        </div>
                    ) : checkoutData ? (
                        <div className="space-y-8">
                            <div className="text-gray-500 text-lg">
                                ID del carrito: <span className="text-black font-semibold">{checkoutData.cartId}</span>
                            </div>
                            <div className="text-gray-500 text-lg">
                                Fecha de compra: <span className="text-black font-semibold">{formatDate(checkoutData.confirmedAt)}</span>
                            </div>
                            <div className="text-center text-xl font-medium mt-16 mb-16">
                                Total pagado: <span className="font-bold">${checkoutData.salePrice}</span>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-cyan-700 text-white py-3 rounded text-lg hover:bg-cyan-800 transition"
                            >
                                Volver a Inicio
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex flex-col gap-4">
                                <label className="text-lg font-medium">Método de Pago</label>
                                <div className="flex gap-4">
                                    <button 
                                        className={`px-6 py-2 rounded ${paymentMethod === 'Efectivo' ? 'bg-cyan-600 text-white' : 'bg-gray-100'}`}
                                        onClick={() => setPaymentMethod('Efectivo')}
                                    >
                                        Efectivo
                                    </button>
                                    <button 
                                        className={`px-6 py-2 rounded ${paymentMethod === 'Tarjeta' ? 'bg-cyan-600 text-white' : 'bg-gray-100'}`}
                                        onClick={() => setPaymentMethod('Tarjeta')}
                                    >
                                        Tarjeta
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className={`w-full py-3 rounded text-lg transition ${
                                    isProcessing 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-cyan-700 hover:bg-cyan-800 text-white'
                                }`}
                            >
                                {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
                            </button>
                            <button
                                onClick={() => navigate('/cart')}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded text-lg hover:bg-gray-200 transition"
                            >
                                Volver al Carrito
                            </button>
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-lg shadow-lg flex-1 flex items-center justify-center p-8">
                    <img
                        src="/images/kitty-nfts.jpg"
                        alt="NFT comprado"
                        className="max-h-[420px] max-w-full object-contain rounded"
                    />
                </div>
            </div>
        </div>
    );
}