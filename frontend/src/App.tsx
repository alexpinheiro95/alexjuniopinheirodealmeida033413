import React, { useState } from 'react';
import { ArtistList } from './features/artists/components/ArtistList';
import { ArtistForm } from './features/artists/components/ArtistForm';

function App() {
  // Estado para controlar a visibilidade do formulário
  const [showForm, setShowForm] = useState<boolean>(false);

  // Estado "hack" para forçar a atualização da lista
  // Sempre que este número mudar, o React desmonta e remonta a lista, buscando os dados novamente
  const [listRefreshKey, setListRefreshKey] = useState<number>(0);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleArtistCreated = () => {
    // 1. Fecha o formulário
    setShowForm(false);
    // 2. Incrementa a chave para forçar o recarregamento da lista de artistas
    setListRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* --- Cabeçalho (Header) --- */}
      <header className="bg-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎵</span>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Music Manager <span className="text-indigo-200 text-sm font-normal">| Painel de Controlo</span>
            </h1>
          </div>
          
          <div className="text-indigo-200 text-sm">
            Admin Seringue
          </div>
        </div>
      </header>

      {/* --- Conteúdo Principal --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Barra de Ações */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Os seus Artistas</h2>
            <p className="text-gray-500 mt-1">Gerencie a discografia e o catálogo musical.</p>
          </div>
          
          <button
            onClick={toggleForm}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-md
              ${showForm 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
              }
            `}
          >
            {showForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Cancelar
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Novo Artista
              </>
            )}
          </button>
        </div>

        {/* Área Condicional: Formulário de Criação */}
        {/* Usamos uma transição simples de opacidade/visibilidade */}
        {showForm && (
          <div className="mb-12 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-down">
            <div className="p-6 bg-indigo-50 border-b border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-900">Adicionar Novo Talento</h3>
            </div>
            <div className="p-6">
                {/* Agora passamos a função diretamente para o componente */}
                <ArtistForm onSuccess={handleArtistCreated} />
            </div>
          </div>
        )}

        {/* Lista de Artistas */}
        <div className="bg-white/50 rounded-2xl min-h-[400px]">
          {/* A prop 'key' força o React a recriar o componente quando o valor muda */}
          <ArtistList key={listRefreshKey} />
        </div>

      </main>

      {/* --- Rodapé --- */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Music Manager Corp. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

export default App;