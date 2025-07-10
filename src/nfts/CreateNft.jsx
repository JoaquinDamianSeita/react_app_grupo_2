import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

export default function CreateNFT() {
    const [artType, setArtType] = useState('PHYSICAL');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [physicalPieces, setPhysicalPieces] = useState('');
    const token = useSelector(state => state.auth.token);

    const handleCreate = async () => {
        const nftData = {
            title,
            description,
            price: parseFloat(price),
            artType,
            physicalPieces: parseInt(physicalPieces),
            available: true,
            imageUrls: [imageUrl]
        };

        try {
            const response = await fetch('http://localhost:8080/api/nfts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(nftData)
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('NFT creado con éxito');
                console.log(result);
            } else {
                const errorText = await response.text();
                toast.error('Error: ' + errorText);
            }
        } catch (err) {
            toast.error('Error al conectar con el servidor');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-cyan-700 flex items-center justify-center">
            {/* <ToastContainer /> */}
            <div className="flex gap-8 max-w-7xl mx-auto">
                {/* Imagen */}
                <div className="bg-white p-4 rounded-xl shadow w-730px] h-[764px]">
                    <img
                        src="/images/nftCreateEdit.jpg"
                        alt="NFT"
                        className="rounded-xl w-full h-full object-cover"
                    />
                </div>

                {/* Formulario */}
                <div className="bg-white p-6 rounded-xl shadow w-full" style={{ maxWidth: '720px' }}>
                    <h2 className="text-2xl font-semibold mb-6">Creá tu NFT completando el formulario</h2>

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
                                    onClick={() => setArtType('PHYSICAL')}
                                    className={`px-6 py-4 rounded ${artType === 'PHYSICAL' ? 'bg-cyan-700 text-white font-bold' : 'bg-cyan-700 text-white'}`}
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

                    <button
                        onClick={handleCreate}
                        className="w-full bg-cyan-800 text-white py-4 rounded hover:bg-cyan-900"
                    >
                        Crear
                    </button>
                </div>
            </div>
        </div>
    );
}