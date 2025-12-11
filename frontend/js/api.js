// ============================================
// API CLIENT
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }
      
      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }
  
  // Autenticação
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }
  
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
  
  async getCurrentUser() {
    return this.request('/auth/me');
  }
  
  // Músicas
  async getSongs(page = 1, limit = 20) {
    return this.request(`/songs?page=${page}&limit=${limit}`);
  }
  
  async getSong(id) {
    return this.request(`/songs/${id}`);
  }
  
  async searchSongs(query, page = 1, limit = 20) {
    return this.request(`/songs/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }
  
  // Álbuns
  async getAlbums(page = 1, limit = 20) {
    return this.request(`/albums?page=${page}&limit=${limit}`);
  }
  
  async getAlbum(id) {
    return this.request(`/albums/${id}`);
  }
  
  async getAlbumSongs(albumId) {
    return this.request(`/albums/${albumId}/songs`);
  }
  
  // Artistas
  async getArtists(page = 1, limit = 20) {
    return this.request(`/artists?page=${page}&limit=${limit}`);
  }
  
  async getArtist(id) {
    return this.request(`/artists/${id}`);
  }
  
  // Playlists
  async getPlaylists() {
    return this.request('/playlists');
  }
  
  async getPlaylist(id) {
    return this.request(`/playlists/${id}`);
  }
  
  async createPlaylist(name, description = '') {
    return this.request('/playlists', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    });
  }
  
  async addSongToPlaylist(playlistId, songId) {
    return this.request(`/playlists/${playlistId}/songs`, {
      method: 'POST',
      body: JSON.stringify({ songId })
    });
  }
  
  async removeSongFromPlaylist(playlistId, songId) {
    return this.request(`/playlists/${playlistId}/songs/${songId}`, {
      method: 'DELETE'
    });
  }
  
  // Biblioteca
  async getLibrary() {
    return this.request('/library');
  }
  
  async addToLibrary(type, id) {
    return this.request('/library', {
      method: 'POST',
      body: JSON.stringify({ type, id })
    });
  }
  
  async removeFromLibrary(type, id) {
    return this.request(`/library/${type}/${id}`, {
      method: 'DELETE'
    });
  }
  
  // Podcasts
  async getPodcasts(page = 1, limit = 20) {
    return this.request(`/podcasts?page=${page}&limit=${limit}`);
  }
  
  async getPodcast(id) {
    return this.request(`/podcasts/${id}`);
  }
  
  async followPodcast(podcastId) {
    return this.request(`/podcasts/${podcastId}/follow`, {
      method: 'POST'
    });
  }
  
  // Busca
  async search(query, filter = 'all') {
    return this.request(`/search?q=${encodeURIComponent(query)}&filter=${filter}`);
  }
  
  // Recomendações
  async getRecommendations() {
    return this.request('/recommendations');
  }
  
  // Histórico
  async getHistory() {
    return this.request('/history');
  }
  
  async addToHistory(songId) {
    return this.request('/history', {
      method: 'POST',
      body: JSON.stringify({ songId })
    });
  }
}

// Instância global
const api = new ApiClient();
window.api = api;

