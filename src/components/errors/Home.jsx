import { useEffect, useState } from 'react';

export default function Home() {
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        const fetchNfts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/nfts');
                if (!response.ok) throw new Error('Error al obtener los NFTs');

                const data = await response.json();
                setNfts(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchNfts();
    }, []);

    return (
        <div className="min-h-scren bg-cyan-600">
            {/*Navbar*/}
            {/*NFTs*/}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {nfts.map((nft) => (
                    <div
                        key={nft.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center"
                    >
                        <img 
                            src={nft.imageUrls}
                            alt={nft.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 w-full flex flex-col items-center">
                            <h2 className="text-xl font-bold text-gray-900 text-center">{nft.title}</h2>
                            <p className="text-lg textgray-700 font-semibold mt-2 text-center">${nft.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

}