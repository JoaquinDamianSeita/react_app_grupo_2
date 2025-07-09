import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, syncCart, setError, setLoading } from '../Redux/cartSlice';

export default function ShowCart() {
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);
    const cartId = useSelector(state => state.cart.cartId);
    const cartItems = useSelector(state => state.cart.items);
    const error = useSelector(state => state.cart.error);
    const loading = useSelector(state => state.cart.loading);

    const fetchCart = async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            console.log("CARRITO: " + cartId);

            if (!cartId) {
                dispatch(setError('No hay carrito activo'));
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

            // Sincroniza el carrito con Redux
            dispatch(syncCart({
                cartId: cartId,
                items: data.nfts || []
            }));
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            dispatch(setError(error.message || 'Error al cargar el carrito'));
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchCart();
    }, [cartId]);

    const removeFromCart = async (nftId) => {
        try {
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
            await fetchCart();
            toast.success('NFT eliminado del carrito');
        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
            toast.error(error.message || 'Error al eliminar del carrito');
        }
    };

    const updateQuantity = async (nftId, newQuantity) => {
        try {
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
            await fetchCart();
            toast.success('Cantidad actualizada');
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
            toast.error(error.message || 'Error al actualizar la cantidad');
        }
    };

    const handleDeleteCart = async () => {
        try {
            if (!cartId) {
                toast.error('No hay carrito para eliminar');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/cart/${cartId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar el carrito.');

            // Limpia el store
            dispatch(clearCart());
            setLocalCart(null);

            toast.success('Carrito eliminado correctamente.');
            navigate('/');
        } catch (error) {
            toast.error(error.message);
            console.error("Error al eliminar el carrito:", error);
        }
    };

    const handleCheckout = async () => {
        if (!cartId) {
            toast.error('No hay carrito activo');
            return;
        }
        navigate(`/cart/checkout/${cartId}`);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-cyan-700 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-900"></div>
                <h2 className="text-3xl font-bold text-center mb-8">Cargando...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cyan-700 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <p className="text-red-500 mb-4">Error al cargar el carrito</p>
                    <button onClick={() => navigate('/')} className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800">Volver al inicio</button>
                </div>
                <h2 className="">{error}</h2>
            </div>
        );
    }

    const subtotal = cart?.nfts.reduce((acc, nft) => acc + nft.price, 0) || 0;

    return (
        <>
            <ToastContainer />
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
                            {/* Subtotal y botón Comprar dentro del container blanco */}
                            <div className="flex justify-end items-center w-full mt-10">
                                <span className="mr-6 text-gray-700 text-lg">Subtotal: <span className="font-semibold">${subtotal}</span></span>
                                <button className="bg-cyan-700 text-white px-8 py-2 rounded hover:bg-cyan-800 transition text-lg" onClick={handleCheckout}>Comprar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">El carrito está vacío</div>
                    )}
                </div>
            </div>
        </>
    );
}