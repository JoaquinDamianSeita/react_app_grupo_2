import { useEffect, useState } from 'react';
import { AddToCartButton } from './cart/AddToCartButton';

export default function Home() {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNfts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/nfts');
                if (!response.ok) throw new Error('Error al obtener los NFTs');

                const data = await response.json();
                console.log('NFTs recibidos:', data); // Para debug
                setNfts(data);
            } catch (error) {
                console.error('Error al cargar NFTs:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNfts();
    }, []);

    const handleImageError = (e) => {
        e.target.src = '/images/placeholder-nft.jpg'; // Imagen de fallback
        console.log('Imagen no cargada, usando fallback para:', e.target.alt);
    };

    const getImageUrl = (nft) => {
        if (!nft.imageUrls) return '/images/placeholder-nft.jpg';
        if (Array.isArray(nft.imageUrls)) {
            return nft.imageUrls[0] || '/images/placeholder-nft.jpg';
        }
        return nft.imageUrls;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cyan-600 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cyan-600 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cyan-600">
            {/*Navbar*/}
            {/*NFTs*/}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {nfts.map((nft) => (
                    <div
                        key={nft.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center"
                    >
                        <div className="w-full h-48 relative">
                            <img 
                                src={getImageUrl(nft)}
                                alt={nft.title}
                                onError={handleImageError}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4 w-full flex flex-col items-center">
                            <h2 className="text-xl font-bold text-gray-900 text-center">{nft.title}</h2>
                            <p className="text-lg text-gray-700 font-semibold mt-2 text-center">
                                ${typeof nft.price === 'number' ? nft.price.toFixed(2) : nft.price}
                            </p>
                            <div className="mt-4">
                                <AddToCartButton nftId={nft.id} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}