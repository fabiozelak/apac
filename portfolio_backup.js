// Portfolio JavaScript
class PortfolioManager {
    constructor() {
        this.athletes = [];
        this.filteredAthletes = [];
        this.currentSort = 'name-asc';
        this.currentSearch = '';
        
        this.init();
    }

    async init() {
        await this.loadAthletes();
        this.setupEventListeners();
        this.renderAthletes();
        this.hideLoader();
    }

    async loadAthletes() {
        try {
            const response = await fetch('atletas.json');
            if (!response.ok) {
                throw new Error('Erro ao carregar dados das atletas');
            }
            this.athletes = await response.json();
            this.filteredAthletes = [...this.athletes];
            this.sortAthletes();
        } catch (error) {
            console.error('Erro ao carregar atletas:', error);
            this.showError('Erro ao carregar dados das atletas. Tente novamente mais tarde.');
        }
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase();
                this.filterAndRender();
            });
        }

        // Sort select
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortAthletes();
                this.renderAthletes();
            });
        }

        // Modal close
        const modalClose = document.getElementById('modal-close');
        const modal = document.getElementById('athlete-modal');
        
        if (modalClose && modal) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    filterAndRender() {
        this.filteredAthletes = this.athletes.filter(athlete => {
            const searchTerm = this.currentSearch;
            const name = athlete.Nome.toLowerCase();
            const description = athlete['Quem sou.'].toLowerCase();
            const achievements = athlete['Últimas conquistas.'].toLowerCase();
            
            return name.includes(searchTerm) || 
                   description.includes(searchTerm) || 
                   achievements.includes(searchTerm);
        });

        this.sortAthletes();
        this.renderAthletes();
    }

    sortAthletes() {
        this.filteredAthletes.sort((a, b) => {
            switch (this.currentSort) {
                case 'name-asc':
                    return a.Nome.localeCompare(b.Nome, 'pt-BR');
                case 'name-desc':
                    return b.Nome.localeCompare(a.Nome, 'pt-BR');
                case 'date-desc':
                    return new Date(this.parseDate(b['Carimbo de data/hora'])) - 
                           new Date(this.parseDate(a['Carimbo de data/hora']));
                case 'date-asc':
                    return new Date(this.parseDate(a['Carimbo de data/hora'])) - 
                           new Date(this.parseDate(b['Carimbo de data/hora']));
                default:
                    return 0;
            }
        });
    }

    parseDate(dateString) {
        // Convert "12/10/2025 23:30:36" to proper date format
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        return `${year}-${month}-${day}T${timePart}`;
    }

    renderAthletes() {
        const grid = document.getElementById('athletes-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (!grid) return;

        if (this.filteredAthletes.length === 0) {
            grid.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        grid.innerHTML = this.filteredAthletes.map(athlete => this.createAthleteCard(athlete)).join('');
        
        // Add click listeners to cards
        grid.querySelectorAll('.athlete-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.openModal(this.filteredAthletes[index]);
            });
            
            // Add keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openModal(this.filteredAthletes[index]);
                }
            });
        });
    }

    createAthleteCard(athlete) {
        const photoUrl = this.getPhotoUrl(athlete['Foto para o perfil']);
        const description = this.truncateText(athlete['Quem sou.'], 150);
        const achievements = this.truncateText(athlete['Últimas conquistas.'], 200);
        
        return `
            <div class="athlete-card" tabindex="0" role="button" aria-label="Ver detalhes de ${athlete.Nome}">
                <div class="athlete-photo">
                    ${photoUrl ? 
                        `<img src="${photoUrl}" alt="Foto de ${athlete.Nome}" loading="lazy">` :
                        `<div class="athlete-photo-placeholder">
                            <i class="fas fa-user"></i>
                        </div>`
                    }
                </div>
                <div class="athlete-info">
                    <h3 class="athlete-name">${athlete.Nome}</h3>
                    <div class="athlete-description">
                        ${description}
                    </div>
                    <div class="athlete-achievements">
                        <h4>Últimas Conquistas</h4>
                        ${achievements}
                    </div>
                    <a href="#" class="read-more" onclick="event.preventDefault();">
                        Ler mais <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }

    getPhotoUrl(driveUrl) {
        if (!driveUrl || !driveUrl.includes('drive.google.com')) {
            return null;
        }
        
        // Extract file ID from Google Drive URL
        const match = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
            const fileId = match[1];
            // return `https://drive.google.com/uc?export=view&id=${fileId}`;
            return `https://drive.google.com/uc?id=${fileId}`;
        }
        
        // Alternative pattern for open?id= URLs
        const idMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
        if (idMatch) {
            const fileId = idMatch[1];
            // return `https://drive.google.com/uc?export=view&id=${fileId}`;
            return `https://drive.google.com/uc?id=${fileId}`;
        }
        
        return null;
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength).trim() + '...';
    }

    openModal(athlete) {
        const modal = document.getElementById('athlete-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (!modal || !modalBody) return;

        const photoUrl = this.getPhotoUrl(athlete['Foto para o perfil']);
        const achievements = this.formatAchievements(athlete['Últimas conquistas.']);
        
        modalBody.innerHTML = `
            <div class="modal-athlete-content">
                ${photoUrl ? 
                    `<img src="${photoUrl}" alt="Foto de ${athlete.Nome}" class="modal-athlete-photo">` :
                    `<div class="modal-athlete-photo athlete-photo-placeholder">
                        <i class="fas fa-user"></i>
                    </div>`
                }
                <h2 class="modal-athlete-name">${athlete.Nome}</h2>
                
                <div class="modal-section">
                    <h3><i class="fas fa-user-circle"></i> Quem é</h3>
                    <p>${athlete['Quem sou.']}</p>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-trophy"></i> Últimas Conquistas</h3>
                    <div class="modal-achievements">
                        ${achievements}
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const closeButton = document.getElementById('modal-close');
        if (closeButton) {
            closeButton.focus();
        }
    }

    formatAchievements(achievementsText) {
        if (!achievementsText) return '<p>Nenhuma conquista registrada.</p>';
        
        // Split by bullet points or line breaks
        const achievements = achievementsText
            .split(/[•·\n]/)
            .map(item => item.trim())
            .filter(item => item.length > 0);
        
        if (achievements.length <= 1) {
            return `<p>${achievementsText}</p>`;
        }
        
        const achievementsList = achievements
            .map(achievement => `<li>${achievement}</li>`)
            .join('');
        
        return `<ul>${achievementsList}</ul>`;
    }

    closeModal() {
        const modal = document.getElementById('athlete-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    hideLoader() {
        const loader = document.querySelector('.loader');
        const loadingState = document.getElementById('loading-state');
        
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
        
        if (loadingState) {
            loadingState.style.display = 'none';
        }
    }

    showError(message) {
        const grid = document.getElementById('athletes-grid');
        const loadingState = document.getElementById('loading-state');
        
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        if (grid) {
            grid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Erro ao carregar dados</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        Tentar novamente
                    </button>
                </div>
            `;
        }
        
        this.hideLoader();
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioManager();
});

// Add error state styles
const errorStateStyles = `
    .error-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #64748b;
        grid-column: 1 / -1;
    }
    
    .error-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #ef4444;
    }
    
    .error-state h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #1e293b;
    }
    
    .error-state .btn {
        margin-top: 1rem;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: transform 0.2s ease;
    }
    
    .error-state .btn:hover {
        transform: translateY(-2px);
    }
`;

// Inject error state styles
const styleSheet = document.createElement('style');
styleSheet.textContent = errorStateStyles;
document.head.appendChild(styleSheet);

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            const placeholder = img.parentElement;
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="athlete-photo-placeholder">
                        <i class="fas fa-user"></i>
                    </div>
                `;
            }
        });
    });
});

// Performance optimization: Intersection Observer for lazy loading
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
