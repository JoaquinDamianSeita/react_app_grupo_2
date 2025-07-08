import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { setCartId } from '../../Redux/cartSlice';

export function AddToCartButton({ nftId, physicalPieces = 0, onAdded}) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const cartId = useSelector(state => state.cart.cartId);

    const handleAddToCart = async () => {
        try {
            if (!token) {
                throw new Error("Debes iniciar sesión para agregar al carrito");
            }

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                "Access-Control-Allow-Origin": "http://localhost:5173"
            };
            
            let response;
    
            if (cartId === null || !cartId) {
                // Si no hay carrito, se crea uno con el primer item
                response = await fetch("http://localhost:8080/api/cart/items", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        nftId,
                        physicalPieces
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Error al crear el carrito");
                }

                const data = await response.json();
                dispatch(setCartId(data.cartId));
            } else {
                // Si hay carrito, se actualiza con el nuevo item
                response = await fetch(`http://localhost:8080/api/cart/${cartId}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify([
                        {
                            nftId,
                            physicalPieces
                        }
                    ])
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || "Error al agregar NFT al carrito");
                }
            }

            toast.success("NFT agregado al carrito");
            onAdded && onAdded();
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            toast.error(error.message || "Error al procesar la operación");
        }
    };

    return (
        <>
            {/* <ToastContainer /> */}
            <button 
                className="w-full bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition-colors"
                onClick={handleAddToCart}
            >
                Agregar al carrito
            </button>
        </>
    );
} 