import { useDispatch, useSelector } from 'react-redux';
import { addNft, setError } from '../../Redux/nftSlice';
import { toast } from 'react-toastify';

export default function AddNftButton({ nft }) {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);

    const handleAddNft = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/nfts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(nft)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al agregar el NFT');
            }

            const newNft = await response.json();
            dispatch(addNft(newNft));
            toast.success('NFT agregado exitosamente');
        } catch (error) {
            console.error('Error al agregar NFT:', error);
            dispatch(setError(error.message));
            toast.error(error.message || 'Error al agregar el NFT');
        }
    };

    return (
        <button
            onClick={handleAddNft}
            className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800 transition"
        >
            Agregar NFT
        </button>
    );
} 