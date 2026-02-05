import { api } from '../../../services/api';

export interface AlbumResponse {
  id: string;
  title: string;
  coverUrl: string;
  artistId: string;
}

export const albumService = {
  // Busca álbuns de um artista específico
  getAlbums: async (artistId: string): Promise<AlbumResponse[]> => {
    const response = await api.get<AlbumResponse[]>(`/albums?artistId=${artistId}`);
    return response.data;
  },

  // Cria um novo álbum (com upload de capa)
  createAlbum: async (artistId: string, title: string, imageFile: File | null): Promise<AlbumResponse> => {
    const formData = new FormData();
    formData.append('artistId', artistId);
    formData.append('title', title);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    const response = await api.post<AlbumResponse>('/albums', formData);
    return response.data;
  },

  // Deleta um álbum
  deleteAlbum: async (albumId: string): Promise<void> => {
    await api.delete(`/albums/${albumId}`);
  }
};