import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedNft, setError, setLoading } from '../Redux/nftSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ShowNft() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const token = useSelector(state => state.auth.token);
    const { selectedNft, loading, error } = useSelector(state => state.nft);

    useEffect(() => {
        const fetchNft = async () => {
            try {
                dispatch(setLoading(true));
                
                const response = await fetch(`http://localhost:8080/api/nfts/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Error al obtener el NFT');
                }

                const data = await response.json();
                dispatch(setSelectedNft(data));
            } catch (error) {
                console.error('Error al cargar el NFT:', error);
                dispatch(setError(error.message));
                toast.error(error.message || 'Error al cargar el NFT');
            }
        };

        fetchNft();
    }, [id, dispatch, token]);

    if (loading) {
        return <div className="min-h-screen bg-cyan-700 flex items-center justify-center">
            <div className="text-white text-2xl">Cargando...</div>
        </div>;
    }

    if (error) {
        return <div className="min-h-screen bg-cyan-700 flex items-center justify-center">
            <div className="text-white text-2xl">{error}</div>
        </div>;
    }

    if (!selectedNft) {
        return <div className="min-h-screen bg-cyan-700 flex items-center justify-center">
            <div className="text-white text-2xl">NFT no encontrado</div>
        </div>;
    }

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen bg-cyan-700 flex flex-col items-center justify-start py-12">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-10">
                    <h2 className="text-3xl font-bold text-center mb-8">{selectedNft.title}</h2>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <img 
                                src={selectedNft.imageUrls[0]} 
                                alt={selectedNft.title} 
                                className="w-full h-auto rounded-lg shadow-md"
                            />
                        </div>
                        
                        <div className="flex-1">
                            <div className="space-y-4">
                                <p className="text-gray-700"><span className="font-semibold">Descripción:</span> {selectedNft.description}</p>
                                <p className="text-gray-700"><span className="font-semibold">Precio:</span> ${selectedNft.price}</p>
                                <p className="text-gray-700"><span className="font-semibold">Categoría:</span> {selectedNft.category}</p>
                            </div>

                            <div className="mt-8 space-x-4">
                                <button
                                    onClick={() => navigate(`/nfts/edit/${selectedNft.id}`)}
                                    className="bg-cyan-700 text-white px-6 py-2 rounded hover:bg-cyan-800 transition"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => navigate('/nfts')}
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition"
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
