import React, { useEffect, useState } from 'react';
import { albumService } from '../services/albumService';
import { AlbumResponse } from '../services/AlbumResponse';


interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId: string | null;
  artistName: string;
}

export const AlbumModal: React.FC<AlbumModalProps> = ({ isOpen, onClose, artistId, artistName }) => {
  const [albums, setAlbums] = useState<AlbumResponse[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para o formulário de novo álbum
  const [newTitle, setNewTitle] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Busca os álbuns sempre que o modal abrir ou o ID do artista mudar
  useEffect(() => {
    if (isOpen && artistId) {
      loadAlbums();
    }
  }, [isOpen, artistId]);

  const loadAlbums = async () => {
    if (!artistId) return;
    setLoading(true);
    try {
      const data = await albumService.getAlbums(artistId);
      setAlbums(data);
    } catch (error) {
      console.error('Erro ao carregar álbuns', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistId || !newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await albumService.createAlbum(artistId, newTitle, newFile);
      setNewTitle('');
      setNewFile(null);
      loadAlbums(); // Recarrega a lista para mostrar o novo álbum
    } catch (error) {
      alert('Erro ao criar álbum');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este álbum?')) return;
    try {
      await albumService.deleteAlbum(id);
      setAlbums(albums.filter(a => a.id !== id));
    } catch (error) {
      alert('Erro ao excluir álbum');
    }
  };

  if (!isOpen) return null;

  return (
    // Overlay Escuro
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      
      {/* Container do Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="bg-indigo-700 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Discografia: {artistName}</h2>
          <button onClick={onClose} className="hover:bg-indigo-600 p-1 rounded">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Corpo com Scroll (Lista de Álbuns) */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
          ) : albums.length === 0 ? (
            <div className="text-center text-gray-500 py-10 italic">Nenhum álbum encontrado para este artista.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {albums.map((album) => (
                <div key={album.id} className="bg-white rounded-lg shadow border border-gray-100 group relative">
                  <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-t-lg overflow-hidden h-32">
                    {album.coverUrl ? (
                      <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">Sem capa</div>
                    )}
                  </div>
                  
                  {/* Botão de Deletar (aparece no hover) */}
                  <button 
                    onClick={() => handleDeleteAlbum(album.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    title="Excluir Álbum"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>

                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-800 truncate" title={album.title}>{album.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé (Formulário de Adicionar) */}
        <div className="bg-white p-4 border-t border-gray-200">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Adicionar Novo Álbum</h4>
          <form onSubmit={handleCreateAlbum} className="flex gap-2 items-end">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Nome do Álbum"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-xs text-gray-500 mb-1">Capa (Opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-indigo-50 file:text-indigo-700"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !newTitle}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition-colors h-[38px]"
            >
              {isSubmitting ? '+' : 'Adicionar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};