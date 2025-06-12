import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { cartId } = useParams();
    const navigate = useNavigate();
    const [checkoutData, setCheckoutData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const confirmedCheckout = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/api/cart/checkout/${cartId}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Error al confirmar la compra');

                const data = await response.json();
                setCheckoutData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        confirmedCheckout();
    }, [cartId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR');
    };

    return (
        <div className="min-h-screen bg-cyan-700 flex items-center justify-center py-12">
            <div className="flex gap-10 w-full max-w-6xl">
                <div className="bg-white rounded-lg shadow-lg flex-1 p-12 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold mb-10">Checkout</h2>
                    {error ? (
                        <div className="text-red-500 text-center font-semibold">{error}</div>
                    ) : checkoutData ? (
                        <div className="space-y-8">
                            <div className="text-gray-500 text-lg">
                                ID del carrito <span className="text-black font-semibold">{checkoutData.cartId}</span>
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
                        <div className="text-center text-gray-500">Procesando la compra...</div>
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