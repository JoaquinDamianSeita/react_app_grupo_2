import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ShowNFT() {
    const { id } = useParams();
    const [nft, setNft] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchNFT = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/api/nfts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al cargar el NFT');
                }
                const data = await response.json();
                setNft(data);
            } catch (error) {
                console.error('Error fetching NFT:', error);
            }
        };

        if (id) {
            fetchNFT();
        }
    }, [id]);

    if (!nft) return (
        <div className="min-h-screen bg-cyan-700 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
    );

    return (
        <div className="bg-cyan-700 min-h-screen flex items-center justify-center">
            <div className="flex gap-10 max-w-7xl mx-auto px-6">
                {/* Imagen */}
                <div className="bg-white p-4 rounded-xl shadow w-[730px] h-[764px]">
                    <img
                        src={nft.imageUrls[0]}
                        alt={nft.title}
                        className="rounded-xl w-full h-full object-cover"
                    />
                </div>

                {/* Detalles */}
                <div className="bg-white p-6 rounded-xl shadow w-full max-w-xl">
                    <h1 className="text-2xl font-bold mb-2">{nft.title}</h1>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-yellow-500 text-sm">
                            {'★'.repeat(5)} <span className="text-black ml-2">5.00 Rating</span>
                        </div>
                        <span className="text-green-600 font-semibold">✔ Stock Disponible</span>
                    </div>

                    <p className="text-gray-600 mb-4">{nft.description}</p>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <button
                                className="border px-3 py-1"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >-</button>
                            <span>{quantity}</span>
                            <button
                                className="border px-3 py-1"
                                onClick={() => setQuantity(quantity + 1)}
                            >+</button>
                        </div>
                        <span className="text-xl font-bold">${nft.price.toFixed(2)}</span>
                    </div>

                    <button className="w-full bg-cyan-800 text-white py-3 rounded mb-6 hover:bg-cyan-900">
                        Agregar al carrito
                    </button>

                    <div className="border-t pt-4 text-sm">
                        <h2 className="text-lg font-semibold mb-2">Detalle del producto</h2>
                        <div className="mb-2">
                            <strong>Tamaño:</strong> Pequeño, Mediano, Grande
                        </div>
                        <div className="mb-2">
                            <strong>Color:</strong> Blanco, Negro, Gris
                        </div>
                        <div className="mb-4">
                            <strong>Marca:</strong> Shirt Flex
                        </div>

                        <h2 className="text-lg font-semibold mb-2">Seleccionar tipo</h2>
                        <div className="flex gap-4">
                            <button
                                className={`px-4 py-2 rounded border ${nft.artType === 'FISICO' ? 'bg-white text-black border-cyan-700' : 'bg-cyan-700 text-white'}`}
                            >
                                Físico
                            </button>
                            <button
                                className={`px-4 py-2 rounded border ${nft.artType === 'DIGITAL' ? 'bg-white text-black border-cyan-700' : 'bg-cyan-700 text-white'}`}
                            >
                                Digital
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
