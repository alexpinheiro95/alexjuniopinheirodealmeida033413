import React, { useEffect, useState } from 'react';
import { artistService } from '../../../services/artistService';
import type { ArtistResponse } from '../../../services/artistService';
import { AlbumModal } from '../../albums/components/AlbumModal'; // Importe o Modal

export const ArtistList: React.FC = () => {
  const [artists, setArtists] = useState<ArtistResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Estados para controlar o Modal
  const [selectedArtist, setSelectedArtist] = useState<ArtistResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const data = await artistService.getAllArtists();
      setArtists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para abrir o modal
  const openAlbums = (artist: ArtistResponse) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="text-center mt-10">Carregando artistas...</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="aspect-w-3 aspect-h-2 bg-gray-100">
              {artist.imageUrl ? (
                <img src={artist.imageUrl} alt={artist.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-400">Sem Foto</div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 truncate">{artist.name}</h3>
              
              <button
                onClick={() => openAlbums(artist)}
                className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Ver Álbuns
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* O Modal fica "escondido" aqui, só aparece quando isModalOpen for true */}
      {selectedArtist && (
        <AlbumModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          artistId={selectedArtist.id}
          artistName={selectedArtist.name}
        />
      )}
    </>
  );
};