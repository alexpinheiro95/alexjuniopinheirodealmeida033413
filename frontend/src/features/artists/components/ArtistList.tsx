import React, { useEffect, useState } from 'react';
import { artistService, ArtistResponse } from '../../../services/artistService';

export const ArtistList: React.FC = () => {
  const [artists, setArtists] = useState<ArtistResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Busca os dados assim que o componente é montado
  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await artistService.getAllArtists();
      setArtists(data);
    } catch (err) {
      console.error('Erro ao buscar artistas:', err);
      setError('Não foi possível carregar a lista de artistas. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
//
  // 1. Estado de Carregamento (Loading Skeleton)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 2. Estado de Erro
  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md shadow-sm max-w-lg mx-auto mt-10 text-center">
        <p>{error}</p>
        <button onClick={fetchArtists} className="mt-4 underline font-medium">
          Tentar novamente
        </button>
      </div>
    );
  }

  // 3. Estado Vazio (Sem dados)
  if (artists.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Nenhum artista cadastrado ainda. Use o formulário para adicionar o primeiro!
      </div>
    );
  }

  // 4. Estado de Sucesso (Grid de Artistas)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Artistas Cadastrados</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Imagem do Artista */}
            <div className="aspect-w-3 aspect-h-2 bg-gray-200">
              {artist.imageUrl ? (
                // A URL aqui é a "Presigned URL" gerada pelo MinIO no back-end
                <img 
                  src={artist.imageUrl} 
                  alt={`Foto de ${artist.name}`} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                // Fallback caso o artista não tenha foto
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Informações do Artista */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {artist.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {/* Placeholder para a contagem de álbuns que faremos depois */}
                Ver Álbuns &rarr;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};