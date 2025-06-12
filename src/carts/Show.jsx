import { useState, useEffect } from 'react';

export default function ShowCart({ cartId }) {
    const [cart, setCart] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Usuario no autenticado');
            }

            const response = await fetch(`http://localhost:8080/api/cart/${cartId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al obtener el carrito.');

            const data = await response.json();
            setCart(data);
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        if (cartId) {
            fetchCart();
        }
    }, [cartId]);

    const handleRemoveNFT = async (nftId) => {
        try {
            const token = localStorage.getItem('accessToken');

            const response = await fetch(`http://localhost:8080/api/cart/items/${nftId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!response.ok) throw new Error('Error al eliminar el NFT.');
            await fetchCart();
        } catch (error) {
            alert(error.message);
        }
    }

    const handleDeleteCart = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8080/api/cart/${cartId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error al eliminar el carrito.');
            alert('Carrito eliminado correctamente.');
            navigate('/home');
        } catch (error) {
            alert(error.message);
        }
    }

    const handleCheckout = async () => {
        alert(`Compraste con el metodo de pago: ${paymentMethod}`);
        navigate(`/checkout/${cartId}`);
    }

    const subtotal = cart?.nftList.reduce((acc, nft) => acc + nft.price, 0) || 0;

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
                    {cart?.nftList?.length > 0 ? (
                        <div>
                            {cart.nftList.map((nft, idx) => (
                                <div key={nft.id}>
                                    <div className="flex items-center gap-6 justify-between py-6">
                                        <div className="flex items-center gap-6">
                                            <img src={nft.imageUrls} alt={nft.title} className="h-20 w-20 object-cover rounded" />
                                            <div>
                                                <div className="font-semibold text-lg">{nft.title}</div>
                                                <div className="text-gray-500 text-sm mb-2">Cantidad: {nft.physicalPieces}</div>
                                            </div>
                                        </div>
                                        <div className="text-lg font-medium">${nft.price}</div>
                                    </div>
                                    {idx < cart.nftList.length - 1 && (
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