import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { artistService } from '../../../services/artistService';

// Interface para comunicação com o componente Pai (App.tsx)
interface ArtistFormProps {
  onSuccess?: () => void;
}

export const ArtistForm: React.FC<ArtistFormProps> = ({ onSuccess }) => {
  // Estados do formulário
  const [name, setName] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Estado para UX (Experiência do Usuário)
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Limpeza de memória: Revoga a URL do objeto quando o componente desmonta ou a imagem muda
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Manipulador de input de arquivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Gera URL temporária para mostrar a foto antes do upload
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Envio do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Chama o serviço (que usa o Axios configurado)
      await artistService.createArtist(name, imageFile);

      // 2. Limpa o formulário
      setName('');
      setImageFile(null);
      setImagePreview(null);

      // 3. Notifica o componente pai (App.tsx) para atualizar a lista
      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      console.error(err);
      setError('Erro ao salvar artista. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Exibição de Erro */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Lado Esquerdo: Upload de Imagem (Circular) */}
        <div className="flex-shrink-0 flex flex-col items-center space-y-3">
          <div className="relative group">
            <div className={`
              w-32 h-32 rounded-full overflow-hidden border-4 
              ${imagePreview ? 'border-indigo-500' : 'border-gray-200 dashed'}
              flex items-center justify-center bg-gray-50
            `}>
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-xs">Foto</span>
                </div>
              )}
            </div>
            
            {/* Input file invisível sobreposto ou botão abaixo */}
            <label 
              htmlFor="artist-photo" 
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg transition-colors"
              title="Escolher foto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </label>
            <input 
              id="artist-photo" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>
          <span className="text-xs text-gray-500">
            {imageFile ? 'Arquivo selecionado' : 'Sem foto definida'}
          </span>
        </div>

        {/* Lado Direito: Campos de Texto */}
        <div className="flex-1 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome do Artista <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
              placeholder="Ex: Guns N' Roses"
            />
            <p className="mt-1 text-xs text-gray-400">
              O nome deve ser único no sistema.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className={`
                w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                transition-all duration-200
                ${isLoading || !name.trim() 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Salvando...
                </span>
              ) : (
                'Cadastrar Artista'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};