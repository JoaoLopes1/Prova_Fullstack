import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { SearchResult } from '../context/SearchContext';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com', // API de exemplo
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratar respostas
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  // Simular autenticação
  async authenticate(): Promise<string> {
    try {
      // Simular uma chamada de autenticação
      const response = await this.api.post('/auth/login', {
        username: 'demo',
        password: 'demo123'
      });
      
      this.token = response.data.token || 'demo-token-123';
      return this.token!; // Usar non-null assertion pois sabemos que não será null
    } catch (error) {
      // Se a API de auth falhar, usar um token mock para demonstração
      this.token = 'demo-token-123';
      return this.token!; // Usar non-null assertion pois sabemos que não será null
    }
  }

  logout(): void {
    this.token = null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Buscar posts (simulando uma API de busca)
  async searchPosts(query: string): Promise<SearchResult[]> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      const response: AxiosResponse = await this.api.get('/posts');
      const posts = response.data;

      // Filtrar posts baseado na query
      const filteredPosts = posts.filter((post: any) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
      );

      // Transformar em SearchResult
      return filteredPosts.map((post: any): SearchResult => ({
        id: post.id.toString(),
        title: post.title,
        description: post.body,
        author: `User ${post.userId}`,
        publishedAt: new Date().toISOString(),
        url: `https://jsonplaceholder.typicode.com/posts/${post.id}`,
        category: 'posts'
      }));
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      throw new Error('Falha ao buscar dados. Tente novamente.');
    }
  }

  // Buscar usuários (funcionalidade bônus)
  async searchUsers(query: string): Promise<SearchResult[]> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      const response: AxiosResponse = await this.api.get('/users');
      const users = response.data;

      const filteredUsers = users.filter((user: any) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );

      return filteredUsers.map((user: any): SearchResult => ({
        id: user.id.toString(),
        title: user.name,
        description: `${user.email} - ${user.phone}`,
        author: user.username,
        publishedAt: new Date().toISOString(),
        url: `https://jsonplaceholder.typicode.com/users/${user.id}`,
        category: 'users'
      }));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw new Error('Falha ao buscar usuários. Tente novamente.');
    }
  }

  // Buscar álbuns (funcionalidade bônus)
  async searchAlbums(query: string): Promise<SearchResult[]> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      const response: AxiosResponse = await this.api.get('/albums');
      const albums = response.data;

      const filteredAlbums = albums.filter((album: any) =>
        album.title.toLowerCase().includes(query.toLowerCase())
      );

      return filteredAlbums.map((album: any): SearchResult => ({
        id: album.id.toString(),
        title: album.title,
        description: `Álbum do usuário ${album.userId}`,
        author: `User ${album.userId}`,
        publishedAt: new Date().toISOString(),
        url: `https://jsonplaceholder.typicode.com/albums/${album.id}`,
        category: 'albums'
      }));
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
      throw new Error('Falha ao buscar álbuns. Tente novamente.');
    }
  }

  // Busca unificada
  async search(query: string, category?: string): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      let results: SearchResult[] = [];

      if (!category || category === 'all') {
        const [posts, users, albums] = await Promise.all([
          this.searchPosts(query),
          this.searchUsers(query),
          this.searchAlbums(query)
        ]);
        results = [...posts, ...users, ...albums];
      } else {
        switch (category) {
          case 'posts':
            results = await this.searchPosts(query);
            break;
          case 'users':
            results = await this.searchUsers(query);
            break;
          case 'albums':
            results = await this.searchAlbums(query);
            break;
          default:
            results = await this.searchPosts(query);
        }
      }

      return results;
    } catch (error) {
      console.error('Erro na busca:', error);
      throw error;
    }
  }

  // Buscar item específico por ID
  async getItemById(id: string, category: string): Promise<SearchResult | null> {
    if (!this.isAuthenticated()) {
      await this.authenticate();
    }

    try {
      let response: AxiosResponse;
      
      switch (category) {
        case 'posts':
          response = await this.api.get(`/posts/${id}`);
          const post = response.data;
          return {
            id: post.id.toString(),
            title: post.title,
            description: post.body,
            author: `User ${post.userId}`,
            publishedAt: new Date().toISOString(),
            url: `https://jsonplaceholder.typicode.com/posts/${post.id}`,
            category: 'Post'
          };
        case 'users':
          response = await this.api.get(`/users/${id}`);
          const user = response.data;
          return {
            id: user.id.toString(),
            title: user.name,
            description: `${user.email} - ${user.phone}\n\nEndereço: ${user.address.street}, ${user.address.city}\nEmpresa: ${user.company.name}`,
            author: user.username,
            publishedAt: new Date().toISOString(),
            url: `https://jsonplaceholder.typicode.com/users/${user.id}`,
            category: 'User'
          };
        case 'albums':
          response = await this.api.get(`/albums/${id}`);
          const album = response.data;
          return {
            id: album.id.toString(),
            title: album.title,
            description: `Álbum do usuário ${album.userId}`,
            author: `User ${album.userId}`,
            publishedAt: new Date().toISOString(),
            url: `https://jsonplaceholder.typicode.com/albums/${album.id}`,
            category: 'Album'
          };
        default:
          return null;
      }
    } catch (error) {
      console.error('Erro ao buscar item:', error);
      return null;
    }
  }
}

const apiService = new ApiService();
export default apiService;
