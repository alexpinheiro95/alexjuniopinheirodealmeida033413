import axios from 'axios';

// Configuração base do Axios (apontando para o container do backend no Docker)
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Tipagem da resposta (baseado no DTO do Spring Boot)
export interface ArtistResponse {
  id: string;
  name: string;
  imageUrl: string;
}

export const artistService = {
  createArtist: async (name: string, imageFile: File | null): Promise<ArtistResponse> => {
    // 1. Criamos o objeto FormData nativo do navegador
    const formData = new FormData();
    
    // 2. Anexamos os campos exatamente com os mesmos nomes dos @RequestParam do Java
    formData.append('name', name);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // 3. Enviamos a requisição POST
    // O Axios automaticamente configura o header 'Content-Type': 'multipart/form-data'
    const response = await api.post<ArtistResponse>('/artists', formData);
    return response.data;
  },
  // Novo método para buscar todos os artistas
  getAllArtists: async (): Promise<ArtistResponse[]> => {
    const response = await api.get<ArtistResponse[]>('/artists');
    return response.data;
  },
};