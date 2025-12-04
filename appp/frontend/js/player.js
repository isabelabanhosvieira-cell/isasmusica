// ============================================
// PLAYER DE MÚSICA
// ============================================

class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.currentSong = null;
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffled = false;
    this.repeatMode = 'none'; // 'none', 'one', 'all'
    this.currentTime = 0;
    this.duration = 0;
    
    this.initializePlayer();
    this.setupEventListeners();
  }
  
  initializePlayer() {
    // Elementos do DOM
    this.elements = {
      playPauseBtn: document.querySelector('.player-button.play-pause'),
      prevBtn: document.querySelector('.player-button.prev'),
      nextBtn: document.querySelector('.player-button.next'),
      shuffleBtn: document.querySelector('.player-button.shuffle'),
      repeatBtn: document.querySelector('.player-button.repeat'),
      progressBar: document.querySelector('.progress-bar'),
      progressFill: document.querySelector('.progress-fill'),
      currentTimeEl: document.querySelector('.current-time'),
      durationEl: document.querySelector('.duration'),
      trackImage: document.querySelector('.player-track-image'),
      trackName: document.querySelector('.player-track-name'),
      trackArtist: document.querySelector('.player-track-artist'),
      volumeBtn: document.querySelector('.player-button.volume'),
      likeBtn: document.querySelector('.player-button.like'),
      lyricsBtn: document.querySelector('.player-button.lyrics')
    };
    
    // Configurar volume inicial
    this.audio.volume = 0.7;
    this.volume = 0.7;
  }
  
  setupEventListeners() {
    // Controles do player
    if (this.elements.playPauseBtn) {
      this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    }
    
    if (this.elements.prevBtn) {
      this.elements.prevBtn.addEventListener('click', () => this.previous());
    }
    
    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener('click', () => this.next());
    }
    
    if (this.elements.shuffleBtn) {
      this.elements.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
    }
    
    if (this.elements.repeatBtn) {
      this.elements.repeatBtn.addEventListener('click', () => this.toggleRepeat());
    }
    
    // Barra de progresso
    if (this.elements.progressBar) {
      this.elements.progressBar.addEventListener('click', (e) => this.seek(e));
    }
    
    // Eventos do áudio
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      this.updateDuration();
    });
    
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.updateProgress();
    });
    
    this.audio.addEventListener('ended', () => {
      this.handleSongEnd();
    });
    
    this.audio.addEventListener('error', (e) => {
      console.error('Erro ao carregar áudio:', e);
      showNotification('Erro ao reproduzir música', 'error');
    });
    
    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          this.togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.seekRelative(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.seekRelative(10);
          break;
      }
    });
  }
  
  async loadSong(song) {
    try {
      this.currentSong = song;
      this.audio.src = song.url || song.audioUrl;
      
      // Atualizar UI
      this.updateTrackInfo();
      
      // Carregar áudio
      await this.audio.load();
      
      // Se estava tocando, continuar
      if (this.isPlaying) {
        await this.audio.play();
      }
      
      // Carregar letras se disponível
      if (song.lyrics) {
        this.loadLyrics(song.lyrics);
      }
      
    } catch (error) {
      console.error('Erro ao carregar música:', error);
      showNotification('Erro ao carregar música', 'error');
    }
  }
  
  async playSong(song, playlist = null) {
    if (playlist) {
      this.playlist = playlist;
      this.currentIndex = playlist.findIndex(s => s._id === song._id);
    }
    
    await this.loadSong(song);
    await this.play();
  }
  
  async play() {
    try {
      await this.audio.play();
      this.isPlaying = true;
      this.updatePlayPauseButton();
    } catch (error) {
      console.error('Erro ao reproduzir:', error);
      showNotification('Erro ao reproduzir música', 'error');
    }
  }
  
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayPauseButton();
  }
  
  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  previous() {
    if (this.playlist.length === 0) return;
    
    if (this.currentTime > 3) {
      // Se já passou 3 segundos, voltar ao início
      this.audio.currentTime = 0;
    } else {
      // Ir para música anterior
      if (this.isShuffled) {
        this.currentIndex = Math.floor(Math.random() * this.playlist.length);
      } else {
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
      }
      this.loadSong(this.playlist[this.currentIndex]);
      if (this.isPlaying) {
        this.play();
      }
    }
  }
  
  next() {
    if (this.playlist.length === 0) return;
    
    if (this.isShuffled) {
      this.currentIndex = Math.floor(Math.random() * this.playlist.length);
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    }
    
    this.loadSong(this.playlist[this.currentIndex]);
    if (this.isPlaying) {
      this.play();
    }
  }
  
  handleSongEnd() {
    if (this.repeatMode === 'one') {
      this.audio.currentTime = 0;
      this.play();
    } else if (this.repeatMode === 'all' || this.playlist.length > 0) {
      this.next();
    } else {
      this.pause();
      this.audio.currentTime = 0;
    }
  }
  
  toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    if (this.elements.shuffleBtn) {
      this.elements.shuffleBtn.classList.toggle('active', this.isShuffled);
    }
  }
  
  toggleRepeat() {
    const modes = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(this.repeatMode);
    this.repeatMode = modes[(currentModeIndex + 1) % modes.length];
    
    if (this.elements.repeatBtn) {
      this.elements.repeatBtn.classList.remove('repeat-none', 'repeat-all', 'repeat-one');
      this.elements.repeatBtn.classList.add(`repeat-${this.repeatMode}`);
    }
  }
  
  seek(e) {
    const rect = this.elements.progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * this.duration;
    this.audio.currentTime = newTime;
  }
  
  seekRelative(seconds) {
    this.audio.currentTime = Math.max(0, Math.min(this.duration, this.audio.currentTime + seconds));
  }
  
  updateProgress() {
    if (this.duration > 0 && this.elements.progressFill) {
      const percentage = (this.currentTime / this.duration) * 100;
      this.elements.progressFill.style.width = `${percentage}%`;
    }
    
    if (this.elements.currentTimeEl) {
      this.elements.currentTimeEl.textContent = formatTime(this.currentTime);
    }
  }
  
  updateDuration() {
    if (this.elements.durationEl) {
      this.elements.durationEl.textContent = formatTime(this.duration);
    }
  }
  
  updatePlayPauseButton() {
    if (this.elements.playPauseBtn) {
      const icon = this.isPlaying ? 'fa-pause' : 'fa-play';
      this.elements.playPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;
    }
  }
  
  updateTrackInfo() {
    if (!this.currentSong) return;
    
    if (this.elements.trackImage) {
      this.elements.trackImage.src = this.currentSong.image || this.currentSong.album?.image || 'https://via.placeholder.com/300';
    }
    
    if (this.elements.trackName) {
      this.elements.trackName.textContent = this.currentSong.name || this.currentSong.title || 'Música Desconhecida';
    }
    
    if (this.elements.trackArtist) {
      this.elements.trackArtist.textContent = this.currentSong.artist || this.currentSong.artistName || 'Artista Desconhecido';
    }
  }
  
  loadLyrics(lyrics) {
    // Implementar carregamento de letras
    if (typeof window.displayLyrics === 'function') {
      window.displayLyrics(lyrics);
    }
  }
  
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = this.volume;
  }
  
  toggleMute() {
    if (this.audio.volume > 0) {
      this.previousVolume = this.audio.volume;
      this.audio.volume = 0;
    } else {
      this.audio.volume = this.previousVolume || 0.7;
    }
  }
}

// ============================================
// INICIALIZAÇÃO GLOBAL
// ============================================

let player;

function initializePlayer() {
  player = new MusicPlayer();
  window.player = player;
}

// Função global para tocar música
async function playSong(song, playlist = null) {
  if (!player) {
    initializePlayer();
  }
  await player.playSong(song, playlist);
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePlayer);
} else {
  initializePlayer();
}

