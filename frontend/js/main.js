// ============================================
// CONFIGURAÇÕES GLOBAIS
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';
let currentUser = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Aplicar tema salvo
  applyTheme(currentTheme);
  
  // Verificar autenticação
  checkAuth();
  
  // Inicializar navegação
  initializeNavigation();
  
  // Inicializar modo escuro
  initializeThemeToggle();
  
  // Inicializar sidebar mobile
  initializeMobileSidebar();
}

// ============================================
// AUTENTICAÇÃO
// ============================================

async function checkAuth() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        currentUser = await response.json();
        updateUIForAuth(true);
      } else {
        localStorage.removeItem('token');
        updateUIForAuth(false);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      updateUIForAuth(false);
    }
  } else {
    updateUIForAuth(false);
  }
}

function updateUIForAuth(isAuthenticated) {
  const loginLinks = document.querySelectorAll('.login-link');
  const profileLinks = document.querySelectorAll('.profile-link');
  
  loginLinks.forEach(link => {
    link.style.display = isAuthenticated ? 'none' : 'block';
  });
  
  profileLinks.forEach(link => {
    link.style.display = isAuthenticated ? 'block' : 'none';
  });
}

// ============================================
// NAVEGAÇÃO
// ============================================

function initializeNavigation() {
  // Links de navegação
  const navLinks = document.querySelectorAll('.sidebar-nav-link, .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        navigateTo(href);
      }
    });
  });
  
  // Atualizar link ativo
  updateActiveNavLink();
}

function navigateTo(path) {
  window.location.href = path;
}

function updateActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.sidebar-nav-link, .nav-link');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ============================================
// TEMA (MODO ESCURO/CLARO)
// ============================================

function initializeThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
  localStorage.setItem('theme', currentTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  }
}

// ============================================
// SIDEBAR MOBILE
// ============================================

function initializeMobileSidebar() {
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    
    // Fechar sidebar ao clicar fora
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      }
    });
  }
}

// ============================================
// BUSCA
// ============================================

function initializeSearch() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length >= 2) {
        searchTimeout = setTimeout(() => {
          performSearch(query);
        }, 300);
      } else {
        clearSearchResults();
      }
    });
  }
  
  // Filtros de busca
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const query = document.querySelector('.search-input')?.value;
      if (query) {
        performSearch(query, chip.dataset.filter);
      }
    });
  });
}

async function performSearch(query, filter = 'all') {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&filter=${filter}`);
    const results = await response.json();
    displaySearchResults(results);
  } catch (error) {
    console.error('Erro na busca:', error);
    showNotification('Erro ao realizar busca', 'error');
  }
}

function displaySearchResults(results) {
  const resultsContainer = document.querySelector('.search-results');
  if (!resultsContainer) return;
  
  resultsContainer.innerHTML = '';
  
  if (results.songs && results.songs.length > 0) {
    const songsSection = createResultsSection('Músicas', results.songs, 'song');
    resultsContainer.appendChild(songsSection);
  }
  
  if (results.albums && results.albums.length > 0) {
    const albumsSection = createResultsSection('Álbuns', results.albums, 'album');
    resultsContainer.appendChild(albumsSection);
  }
  
  if (results.artists && results.artists.length > 0) {
    const artistsSection = createResultsSection('Artistas', results.artists, 'artist');
    resultsContainer.appendChild(artistsSection);
  }
  
  if (resultsContainer.children.length === 0) {
    resultsContainer.innerHTML = '<p class="no-results">Nenhum resultado encontrado</p>';
  }
}

function createResultsSection(title, items, type) {
  const section = document.createElement('div');
  section.className = 'results-section';
  
  const sectionTitle = document.createElement('h3');
  sectionTitle.textContent = title;
  section.appendChild(sectionTitle);
  
  const grid = document.createElement('div');
  grid.className = 'music-grid';
  
  items.forEach(item => {
    const card = createCard(item, type);
    grid.appendChild(card);
  });
  
  section.appendChild(grid);
  return section;
}

function createCard(item, type) {
  const card = document.createElement('div');
  card.className = 'card';
  card.onclick = () => {
    if (type === 'song') {
      playSong(item);
    } else if (type === 'album') {
      navigateTo(`album.html?id=${item._id}`);
    } else if (type === 'artist') {
      navigateTo(`artist.html?id=${item._id}`);
    }
  };
  
  card.innerHTML = `
    <img src="${item.image || 'https://via.placeholder.com/300'}" alt="${item.name}" class="card-image">
    <div class="card-title">${item.name}</div>
    <div class="card-subtitle">${item.artist || item.genre || ''}</div>
  `;
  
  return card;
}

function clearSearchResults() {
  const resultsContainer = document.querySelector('.search-results');
  if (resultsContainer) {
    resultsContainer.innerHTML = '';
  }
}

// ============================================
// NOTIFICAÇÕES
// ============================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// ============================================
// CARREGAMENTO LAZY
// ============================================

function initializeLazyLoading() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px'
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
  });
}

// ============================================
// UTILITÁRIOS
// ============================================

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Exportar funções globais
window.playSong = playSong;
window.navigateTo = navigateTo;
window.showNotification = showNotification;

