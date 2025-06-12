import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const API_BASE_URL = 'http://localhost:8080';

export default function EditNFT() {
    const [nfts, setNfts] = useState([]);
    const [selectedId, setSelectedId] = useState('');

    const [artType, setArtType] = useState('FISICO');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [physicalPieces, setPhysicalPieces] = useState('');
    const [available, setAvailable] = useState(true);

    useEffect(() => {
        async function fetchNFTs() {
            try {
                const token = authService.getToken();
                if (!token) {
                    console.error('No access token found');
                    return;
                }

                // Primero obtenemos los datos del usuario
                const userResponse = await fetch(`${API_BASE_URL}/api/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!userResponse.ok) {
                    throw new Error('Error al obtener datos del usuario');
                }

                const userData = await userResponse.json();
                const currentUserId = userData.userId;

                // Luego obtenemos los NFTs
                const nftsResponse = await fetch(`${API_BASE_URL}/api/nfts`);
                const nftsData = await nftsResponse.json();
                
                // Filtramos por el userId obtenido del endpoint /me
                const userNfts = nftsData.filter(nft => nft.userId === currentUserId);
                setNfts(userNfts);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchNFTs();
    }, []);

    useEffect(() => {
        if (!selectedId) return;
        const nft = nfts.find(n => n.id === parseInt(selectedId));
        if (nft) {
            setTitle(nft.title);
            setDescription(nft.description);
            setPrice(nft.price.toString());
            setArtType(nft.artType);
            setPhysicalPieces(nft.physicalPieces.toString());
            setImageUrl(nft.imageUrls && nft.imageUrls.length > 0 ? nft.imageUrls[0] : '');
            setAvailable(nft.available);
        }
    }, [selectedId, nfts]);

    const handleEdit = async () => {
        const nftData = {
            title,
            description,
            price: parseFloat(price),
            artType,
            physicalPieces: parseInt(physicalPieces),
            available,
            imageUrls: [imageUrl]
        };

        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8080/api/nfts/${selectedId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(nftData)
            });

            if (response.ok) {
                alert('NFT editado con éxito');
            } else {
                const errorText = await response.text();
                alert('Error: ' + errorText);
            }
        } catch (err) {
            alert('Error al conectar con el servidor');
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;

        const confirmDelete = window.confirm('¿Estás seguro de que querés borrar este NFT?');
        if (!confirmDelete) return;

        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8080/api/nfts/${selectedId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                alert('NFT borrado con éxito');

                setSelectedId('');
                setTitle('');
                setDescription('');
                setPrice('');
                setArtType('FISICO');
                setPhysicalPieces('');
                setImageUrl('');
                setAvailable(true);

                setNfts(prev => prev.filter(nft => nft.id !== parseInt(selectedId)));
            } else {
                const errorText = await response.text();
                console.error('Error al borrar:', errorText);
                alert('Error al borrar el NFT: ' + errorText);
            }
        } catch (err) {
            alert('Error al conectar con el servidor');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-cyan-700 flex items-center justify-center">
            <div className="flex gap-8 max-w-7xl mx-auto">
                {/* Imagen */}
                <div className="bg-white p-4 rounded-xl shadow w-730px] h-[764px]">
                    {
                        selectedId && nfts.length > 0 && (
                            <img
                                src={nfts.find(n => n.id === parseInt(selectedId)).imageUrls[0]}
                                alt="NFT"
                                className="rounded-xl w-full h-full object-cover"
                            />
                        )
                    }{
                    !selectedId && (
                        <img
                            src="/images/nftCreateEdit.jpg"
                            alt="NFT"
                            className="rounded-xl w-full h-full object-cover"
                        />
                    )
                }
                </div>

                {/* Formulario */}
                <div className="bg-white p-6 rounded-xl shadow w-full" style={{maxWidth: '720px'}}>
                    <h2 className="text-2xl font-semibold mb-6">Editá tu NFT completando el formulario</h2>

                    <div className="mb-4">
                        <select
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)}
                            className="w-full border border-cyan-700 rounded px-4 py-4 text-black"
                        >
                            <option value="">Elegí un NFT para editar</option>
                            {nfts.map(nft => (
                                <option key={nft.id} value={nft.id}>
                                    {nft.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-1/2 border border-cyan-700 rounded px-4 py-8"
                        />
                        <input
                            type="number"
                            placeholder="Precio"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-1/2 border border-cyan-700 rounded px-4 py-8"
                        />
                    </div>

                    <textarea
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-cyan-700 rounded px-4 py-24 mb-4"
                    />

                    <div className="flex gap-6 mb-4">
                        <div className="flex flex-col flex-1 gap-8">
                            <input
                                type="text"
                                placeholder="Ingrese la URL de su Imagen"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="border border-cyan-700 rounded px-8 py-4"
                            />
                            <input
                                type="number"
                                placeholder="Cantidad de piezas físicas"
                                value={physicalPieces}
                                onChange={(e) => setPhysicalPieces(e.target.value)}
                                className="border border-cyan-700 rounded px-8 py-4"
                            />
                        </div>

                        <div className="flex-1 ml-10">
                            <p className="text-xl font-semibold mb-8">Tipo de arte:</p>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setArtType('FISICO')}
                                    className={`px-6 py-4 rounded ${artType === 'FISICO' ? 'bg-cyan-700 text-white font-bold' : 'bg-cyan-700 text-white'}`}
                                >
                                    Físico
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setArtType('DIGITAL')}
                                    className={`px-6 py-4 rounded ${artType === 'DIGITAL' ? 'bg-cyan-700 text-white font-bold' : 'bg-cyan-700 text-white'}`}
                                >
                                    Digital
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleEdit}
                            className="w-1/2 bg-cyan-800 text-white py-4 rounded hover:bg-cyan-900"
                            disabled={!selectedId}
                        >
                            Editar
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-1/2 bg-red-600 text-white py-4 rounded hover:bg-red-700"
                            disabled={!selectedId}
                        >
                            Borrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
