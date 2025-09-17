import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import apiService from '../services/api';
import { SearchResult } from '../context/SearchContext';

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'posts';

  const [item, setItem] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setError('ID não fornecido');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await apiService.getItemById(id, category);
        if (result) {
          setItem(result);
        } else {
          setError('Item não encontrado');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id, category]);

  const handleGoBack = () => {
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data não disponível';
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="loading">
          <Loader2 size={24} className="animate-spin" style={{ marginRight: '12px' }} />
          Carregando detalhes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="detail-header">
          <button className="btn btn-secondary" onClick={handleGoBack}>
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>
        <div className="error">
          {error}
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="card">
        <div className="detail-header">
          <button className="btn btn-secondary" onClick={handleGoBack}>
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>
        <div className="no-results">
          <p>Item não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="detail-header">
        <button className="btn btn-secondary" onClick={handleGoBack}>
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Tag size={20} style={{ color: '#667eea' }} />
          <span style={{ 
            background: '#667eea', 
            color: 'white', 
            padding: '6px 12px', 
            borderRadius: '6px', 
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {item.category}
          </span>
        </div>
      </div>

      <div className="detail-content">
        <h1 style={{ 
          fontSize: '32px', 
          marginBottom: '16px', 
          color: '#333',
          lineHeight: '1.2'
        }}>
          {item.title}
        </h1>

        {item.author && (
          <div className="detail-section">
            <h3>
              <User size={18} style={{ display: 'inline', marginRight: '8px' }} />
              Autor
            </h3>
            <p>{item.author}</p>
          </div>
        )}

        {item.publishedAt && (
          <div className="detail-section">
            <h3>
              <Calendar size={18} style={{ display: 'inline', marginRight: '8px' }} />
              Data de Publicação
            </h3>
            <p>{formatDate(item.publishedAt)}</p>
          </div>
        )}

        <div className="detail-section">
          <h3>Descrição</h3>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            lineHeight: '1.6'
          }}>
            {item.description.split('\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: paragraph ? '12px' : '0' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {item.url && (
          <div className="detail-section">
            <h3>Links</h3>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '8px 16px',
                border: '2px solid #667eea',
                borderRadius: '6px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#667eea';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#667eea';
              }}
            >
              <ExternalLink size={16} />
              Ver na API original
            </a>
          </div>
        )}

        <div style={{ 
          marginTop: '32px', 
          padding: '20px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white'
        }}>
          <h3 style={{ marginBottom: '12px', color: 'white' }}>
            ℹ️ Informações Técnicas
          </h3>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            <p><strong>ID:</strong> {item.id}</p>
            <p><strong>Categoria:</strong> {item.category}</p>
            <p><strong>Fonte:</strong> JSONPlaceholder API</p>
            <p><strong>Autenticação:</strong> Bearer Token</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
