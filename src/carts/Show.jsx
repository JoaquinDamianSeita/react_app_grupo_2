import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ShowCart({ cartId }) {
    const [cart, setCart] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const cartId = localStorage.getItem('cartId');

            console.log("CARRITO: " + cartId);

            if (!cartId) {
                setError('No hay carrito activo');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/cart/${cartId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al obtener el carrito');
            }

            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            setError(error.message || 'Error al cargar el carrito');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cartId !== null) {
            fetchCart();
        }
    }, [cartId]);

    const removeFromCart = async (nftId) => {
        try {
            const token = localStorage.getItem('accessToken');
            const cartId = localStorage.getItem('cartId');

            const response = await fetch(`http://localhost:8080/api/cart/${cartId}/items/${nftId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al eliminar el NFT del carrito');
            }

            // Actualizar el carrito después de eliminar
            fetchCart();
        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
            setError(error.message || 'Error al eliminar del carrito');
        }
    };

    const updateQuantity = async (nftId, newQuantity) => {
        try {
            const token = localStorage.getItem('accessToken');
            const cartId = localStorage.getItem('cartId');

            const response = await fetch(`http://localhost:8080/api/cart/${cartId}/items/${nftId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ physicalPieces: newQuantity })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar la cantidad');
            }

            // Actualizar el carrito después de modificar
            fetchCart();
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
            setError(error.message || 'Error al actualizar la cantidad');
        }
    };

    const handleDeleteCart = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const id = cartId || localStorage.getItem('cartId');

            if (!id) {
                alert('No hay carrito para eliminar');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/cart/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar el carrito.');

            // Limpia el localStorage
            localStorage.removeItem('cartId');

            alert('Carrito eliminado correctamente.');
            navigate('/');
        } catch (error) {
            alert(error.message);
            console.error("Error al eliminar el carrito:", error);
        }
    };


    const handleCheckout = async () => {
        navigate(`/cart/checkout/${cartId}`);
    }

    const subtotal = cart?.nfts.reduce((acc, nft) => acc + nft.price, 0) || 0;

    return (
        <>
            <div className="min-h-screen bg-cyan-700 flex flex-col items-center justify-start py-12">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-10">
                    <h2 className="text-3xl font-bold text-center mb-8">Carrito de Compras</h2>
                    <div className="flex justify-end mb-4">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            onClick={handleDeleteCart}
                        >
                            Eliminar Carrito
                        </button>
                    </div>
                    {cart?.nfts ? (
                        <div>
                            {cart.nfts.map((nft, idx) => (
                                <div key={nft.id}>
                                    <div className="flex items-center gap-6 justify-between py-6">
                                        <div className="flex items-center gap-6">
                                            <img src={nft.imageUrls[0]} alt={nft.title} className="h-20 w-20 object-cover rounded" />
                                            <div>
                                                <div className="font-semibold text-lg">{nft.title}</div>
                                                <div className="text-gray-500 text-sm mb-2">Cantidad: 1</div>
                                            </div>
                                        </div>
                                        <div className="text-lg font-medium">${nft.price}</div>
                                    </div>
                                    {idx < cart.nfts.length - 1 && (
                                        <hr className="border-t border-gray-200 my-6" />
                                    )}
                                </div>
                            ))}
                            {/*Metodos de pago*/}
                            <div className="flex items-center gap-4 mt-10">
                                <span className="font-medium">Metodo de pago:</span>
                                <button
                                    className={`px-4 py-1 rounded ${paymentMethod === 'Efectivo' ? 'bg-cyan-500 text-white' : 'bg-white text-cyan-700 border border-cyan-500'}`}
                                    onClick={() => setPaymentMethod('Efectivo')}>Efectivo</button>
                                <button
                                    className={`px-4 py-1 rounded ${paymentMethod === 'Tarjeta' ? 'bg-cyan-500 text-white' : 'bg-white text-cyan-700 border border-cyan-500'}`}
                                    onClick={() => setPaymentMethod('Tarjeta')}>Tarjeta</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">El carrito está vacío</div>
                    )}
                </div>
                <div className="flex justify-end items-center w-full max-w-5xl mt-4">
                    <span className="mr-6 text-gray-700 text-lg">Subtotal: <span className="font-semibold">${subtotal}</span></span>
                    <button className="bg-cyan-700 text-white px-8 py-2 rounded hover:bg-cyan-800 transition text-lg" onClick={handleCheckout}>Comprar</button>
                </div>
            </div>
        </>
    );
}