import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

export default function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [checkoutData, setCheckoutData] = useState(null);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCCV, setCardCCV] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const token = useSelector(state => state.auth.token);
    const cartId = useSelector(state => state.cart.cartId);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR');
    };

    const handleCheckout = async () => {
        try {
            setIsProcessing(true);
            
            if (!cartId) {
                throw new Error('No hay carrito activo');
            }

            // 1. Checkout del carrito
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

            // 2. Crear la venta
            const saleResponse = await fetch('http://localhost:8080/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cartId: data.cartId // Usa el cartId que devuelve el checkout
                })
            });

            if (!saleResponse.ok) {
                const errorData = await saleResponse.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al registrar la venta');
            }

            // Si todo sale bien, muestra el resumen y limpia el store
            setCheckoutData(data);
            dispatch(clearCart());
        } catch (error) {
            console.error('Error en el checkout:', error);
            setError(error.message || 'Error al procesar el checkout');
        } finally {
            setIsProcessing(false);
        }
    };

    // Formateo visual para número de tarjeta
    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Solo dígitos
        value = value.slice(0, 16); // Máximo 16 dígitos
        let formatted = value.replace(/(.{4})/g, '$1 ').trim();
        setCardNumber(formatted);
    };

    // Formateo visual para vencimiento MM/AA
    const handleCardExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Solo dígitos
        value = value.slice(0, 4); // Máximo 4 dígitos
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        setCardExpiry(value);
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
                                {paymentMethod === 'Tarjeta' && (
                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <label className="block text-md font-medium mb-1">Número de Tarjeta</label>
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={handleCardNumberChange}
                                                placeholder="1234 5678 9012 3456"
                                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-600 text-lg"
                                                maxLength={19}
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-md font-medium mb-1">Vencimiento</label>
                                                <input
                                                    type="text"
                                                    value={cardExpiry}
                                                    onChange={handleCardExpiryChange}
                                                    placeholder="MM/AA"
                                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-600 text-lg"
                                                    maxLength={5}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-md font-medium mb-1">CCV</label>
                                                <input
                                                    type="password"
                                                    value={cardCCV}
                                                    onChange={e => setCardCCV(e.target.value)}
                                                    placeholder="123"
                                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-600 text-lg"
                                                    maxLength={4}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
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