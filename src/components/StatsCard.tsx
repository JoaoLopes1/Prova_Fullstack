import React from 'react';
import { BarChart3, Users, FileText, Image, Search } from 'lucide-react';
import { SearchResult } from '../context/SearchContext';

interface StatsCardProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ results, query, isLoading }) => {
  if (isLoading || !query) {
    return null;
  }

  const stats = {
    total: results.length,
    posts: results.filter(r => r.category === 'Post').length,
    users: results.filter(r => r.category === 'User').length,
    albums: results.filter(r => r.category === 'Album').length,
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Post': return <FileText size={16} />;
      case 'User': return <Users size={16} />;
      case 'Album': return <Image size={16} />;
      default: return <Search size={16} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Post': return '#667eea';
      case 'User': return '#28a745';
      case 'Album': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <h3 style={{ 
        marginBottom: '16px', 
        color: '#333', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px' 
      }}>
        <BarChart3 size={20} />
        Estatísticas da Busca
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '16px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total</div>
        </div>
        
        {Object.entries(stats).filter(([key]) => key !== 'total').map(([category, count]) => (
          <div key={category} style={{ 
            textAlign: 'center', 
            padding: '16px', 
            background: '#f8f9fa',
            borderRadius: '8px',
            border: `2px solid ${getCategoryColor(category === 'posts' ? 'Post' : category === 'users' ? 'User' : 'Album')}`
          }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: getCategoryColor(category === 'posts' ? 'Post' : category === 'users' ? 'User' : 'Album'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              marginBottom: '4px'
            }}>
              {getCategoryIcon(category === 'posts' ? 'Post' : category === 'users' ? 'User' : 'Album')}
              {count}
            </div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'capitalize' }}>
              {category === 'posts' ? 'Posts' : category === 'users' ? 'Usuários' : 'Álbuns'}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        fontSize: '14px', 
        color: '#666', 
        textAlign: 'center',
        padding: '12px',
        background: '#f8f9fa',
        borderRadius: '6px'
      }}>
        Busca por "<strong>{query}</strong>" retornou {stats.total} resultado{stats.total !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default StatsCard;
