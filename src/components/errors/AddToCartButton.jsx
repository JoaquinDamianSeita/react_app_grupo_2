export function AddToCartButton({ nftId, physicalPieces, onAdded}) {
    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const cartId = localStorage.getItem("cartId");
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            };
            
            let response;

            if (!cartId) {
                //Si no hay carrito, se crea uno
                response = await fetch("http://localhost:8080/api/cart/items", {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ nftId, physicalPieces })
                });

                if (!response.ok) throw new Error("Error al crear el carrito");

                const data = await response.json();
                const newCartId = data.cartId;
                if (newCartId) {
                    localStorage.setItem("cartId", newCartId);
                } else {
                    throw new Error("Error al obtener el ID del carrito");
                }
            } else {
                //Si hay carrito, se agrega el NFT al carrito
                response = await fetch(`http://localhost:8080/api/cart/${cartId}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify([{ nftId, physicalPieces }]),
                });

                if (!response.ok) throw new Error("Error al agregar NFT al carrito");
            }

            alert("NFT agregado al carrito");
            onAdded && onAdded();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <button 
            className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition-colors"
            onClick={handleAddToCart}
        >
            Agregar al carrito
        </button>
    );
}