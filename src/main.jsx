import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CreateNFT from './nfts/CreateNFT';
import EditNFT from "./nfts/EditNft.jsx";
import ShowNFT from "./nfts/ShowNft.jsx";  // ruta correcta de tu componente

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/crear-nft" element={<CreateNFT />} />
                <Route path="/editar-nft" element={<EditNFT />} />
                <Route path="/mostrar-nft" element={<ShowNFT />} />
                <Route path="/*" element={<App />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

