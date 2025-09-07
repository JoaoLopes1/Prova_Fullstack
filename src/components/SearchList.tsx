import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Loader2, RefreshCw, History } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import apiService from '../services/api';
import { SearchResult } from '../context/SearchContext';
import StatsCard from './StatsCard';

const SearchList: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
    error,
    setError
  } = useSearch();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'posts', label: 'Posts' },
    { value: 'users', label: 'Usuários' },
    { value: 'albums', label: 'Álbuns' }
  ];

  const handleSearch = async (query: string = searchInput) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchQuery(query);

    // Adicionar ao histórico
    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
    }

    try {
      const results = await apiService.search(query, selectedCategory);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    
    // Refazer busca se já há uma query
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Salvar resultados atuais no contexto para o botão voltar
    navigate(`/detail/${result.id}?category=${result.category?.toLowerCase()}`);
  };

  const handleRefresh = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  const handleHistoryClick = (query: string) => {
    setSearchInput(query);
    handleSearch(query);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    setShowHistory(false);
  };

  // Buscar automaticamente quando a categoria muda e há uma query
  useEffect(() => {
    if (searchQuery && !isLoading) {
      handleSearch(searchQuery);
    }
  }, [selectedCategory]);

  return (
    <div className="card">
      <h1 style={{ marginBottom: '24px', color: '#333', fontSize: '28px' }}>
        🔍 Busca de Dados via API
      </h1>
      
      <div className="search-container">
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            className="input search-input"
            placeholder="Digite sua pesquisa..."
            value={searchInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowHistory(searchHistory.length > 0)}
          />
          {searchHistory.length > 0 && showHistory && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              marginTop: '4px'
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                <span>Histórico</span>
                <button
                  onClick={clearHistory}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Limpar
                </button>
              </div>
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(query)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                    borderBottom: index < searchHistory.length - 1 ? '1px solid #f8f9fa' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {query}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          className="btn search-btn"
          onClick={() => handleSearch()}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          Buscar
        </button>
        {searchQuery && (
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={isLoading}
            title="Atualizar busca"
          >
            <RefreshCw size={20} />
          </button>
        )}
        {searchHistory.length > 0 && (
          <button
            className="btn btn-secondary"
            onClick={() => setShowHistory(!showHistory)}
            title="Ver histórico"
          >
            <History size={20} />
          </button>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
          <Filter size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Categoria:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="input"
          style={{ width: '200px' }}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <Loader2 size={24} className="animate-spin" style={{ marginRight: '12px' }} />
          Buscando dados...
        </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div>
          <StatsCard 
            results={searchResults} 
            query={searchQuery} 
            isLoading={isLoading} 
          />
          
          <h2 style={{ marginBottom: '16px', color: '#333' }}>
            Resultados ({searchResults.length})
          </h2>
          <div className="results-grid">
            {searchResults.map((result) => (
              <div
                key={`${result.category}-${result.id}`}
                className="result-card fade-in"
                onClick={() => handleResultClick(result)}
              >
                <div className="result-title">{result.title}</div>
                <div className="result-description">
                  {result.description.length > 150 
                    ? `${result.description.substring(0, 150)}...` 
                    : result.description
                  }
                </div>
                <div className="result-meta">
                  <span style={{ 
                    background: '#667eea', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px' 
                  }}>
                    {result.category}
                  </span>
                  {result.author && (
                    <span>Por: {result.author}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && searchQuery && searchResults.length === 0 && !error && (
        <div className="no-results">
          <Search size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>Nenhum resultado encontrado para "{searchQuery}"</p>
          <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
            Tente uma palavra-chave diferente ou mude a categoria
          </p>
        </div>
      )}

      {!searchQuery && !isLoading && (
        <div className="no-results">
          <Search size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>Digite algo para começar a buscar</p>
          <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
            Use a caixa de pesquisa acima para encontrar posts, usuários ou álbuns
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchList;
