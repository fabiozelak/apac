// Documents Manager
class DocumentsManager {
    constructor() {
        this.documents = [];
        this.filteredDocuments = [];
        this.currentFilters = {
            search: '',
            category: '',
            type: ''
        };
        
        this.init();
    }

    async init() {
        await this.loadDocuments();
        this.sortDocuments('id-desc'); // Ordenar por data (mais novo para mais antigo) por padrão
        this.setupEventListeners();
        this.populateFilters();
        this.renderDocuments();
        this.hideLoader();
    }

    async loadDocuments() {
        try {
            const response = await fetch('documentos.json');
            if (!response.ok) {
                throw new Error('Erro ao carregar dados dos documentos');
            }
            this.documents = await response.json();
            this.filteredDocuments = [...this.documents];
        } catch (error) {
            console.error('Erro ao carregar documentos:', error);
            this.showError('Erro ao carregar dados dos documentos. Tente novamente mais tarde.');
        }
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.filterAndRender();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.filterAndRender();
            });
        }

        // Type filter
        const typeFilter = document.getElementById('type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.currentFilters.type = e.target.value;
                this.filterAndRender();
            });
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    populateFilters() {
        // Get unique categories
        const categories = [...new Set(this.documents.map(doc => doc.categoria))];
        const categoryFilter = document.getElementById('category-filter');
        
        if (categoryFilter) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
    }

    filterAndRender() {
        this.filteredDocuments = this.documents.filter(document => {
            const matchSearch = this.matchesSearch(document);
            const matchCategory = this.matchesCategory(document);
            const matchType = this.matchesType(document);
            
            return matchSearch && matchCategory && matchType;
        });

        // Manter a ordenação ao filtrar
        this.sortDocuments('data-desc');
        this.renderDocuments();
    }

    matchesSearch(document) {
        if (!this.currentFilters.search) return true;
        
        const searchTerm = this.currentFilters.search;
        return (
            document.nome.toLowerCase().includes(searchTerm) ||
            document.descricao.toLowerCase().includes(searchTerm) ||
            document.categoria.toLowerCase().includes(searchTerm)
        );
    }

    matchesCategory(document) {
        if (!this.currentFilters.category) return true;
        return document.categoria === this.currentFilters.category;
    }

    matchesType(document) {
        if (!this.currentFilters.type) return true;
        return document.tipo === this.currentFilters.type;
    }

    renderDocuments() {
        const listContainer = document.getElementById('documents-list');
        const emptyState = document.getElementById('empty-state');
        
        if (!listContainer) return;

        if (this.filteredDocuments.length === 0) {
            listContainer.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        listContainer.innerHTML = this.filteredDocuments
            .map(document => this.createDocumentItem(document))
            .join('');
    }

    createDocumentItem(document) {
        const icon = this.getDocumentIcon(document.tipo);
        const typeClass = document.tipo.toLowerCase();
        const formattedDate = this.formatDate(document.data);
        if (document.hidden === "true") {
            return '';
        } else {
        return `
            <div class="document-item ${typeClass}">
                <div class="document-info">
                    <div class="document-header">
                        <div class="document-icon">
                            ${icon}
                        </div>
                        <h3 class="document-title">${document.nome}</h3>
                    </div>
                    <div class="document-meta">
                        <span class="document-category">
                            <i class="fas fa-folder"></i> ${document.categoria}
                        </span>
                        <span class="document-date">
                            <i class="fas fa-calendar"></i> ${formattedDate}
                        </span>
                    </div>
                    <p class="document-description">${document.descricao}</p>
                </div>
                <div class="document-actions">
                    <a href="${document.arquivo}" class="btn-download" download>
                        <i class="fas fa-download"></i> Download
                    </a>
                    <div class="document-size">
                        <i class="fas fa-file"></i> ${document.tamanho}
                    </div>
                </div>
            </div>
        `;
        }
    }

    getDocumentIcon(type) {
        const icons = {
            'PDF': '<i class="fas fa-file-pdf"></i>',
            'DOC': '<i class="fas fa-file-word"></i>',
            'XLS': '<i class="fas fa-file-excel"></i>',
            'default': '<i class="fas fa-file"></i>'
        };
        
        return icons[type] || icons['default'];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    sortDocuments(sortBy) {
        if (sortBy === 'data-desc') {
            // Ordenar por data (mais novo para mais antigo)
            this.filteredDocuments.sort((a, b) => {
                return new Date(b.data) - new Date(a.data);
            });
        } else if (sortBy === 'data-asc') {
            // Ordenar por data (mais antigo para mais novo)
            this.filteredDocuments.sort((a, b) => {
                return new Date(a.data) - new Date(b.data);
            });
        } else if (sortBy === 'nome-asc') {
            // Ordenar por nome (A-Z)
            this.filteredDocuments.sort((a, b) => {
                return a.nome.localeCompare(b.nome);
            });
        } else if (sortBy === 'nome-desc') {
            // Ordenar por nome (Z-A)
            this.filteredDocuments.sort((a, b) => {
                return b.nome.localeCompare(a.nome);
            });
        } else if (sortBy === 'id-desc') {
            // Ordenar por ID (mais novo para mais antigo)
            this.filteredDocuments.sort((a, b) => {
                return b.id - a.id;
            });
        } else if (sortBy === 'id-asc') {
            // Ordenar por ID (mais antigo para mais novo)
            this.filteredDocuments.sort((a, b) => {
                return a.id - b.id;
            });
        }
    }

    clearFilters() {
        this.currentFilters = {
            search: '',
            category: '',
            type: ''
        };
        
        // Reset form inputs
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const typeFilter = document.getElementById('type-filter');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (typeFilter) typeFilter.value = '';
        
        this.filterAndRender();
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
        const listContainer = document.getElementById('documents-list');
        const loadingState = document.getElementById('loading-state');
        
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        if (listContainer) {
            listContainer.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Erro ao carregar documentos</h3>
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

// Initialize documents manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DocumentsManager();
});

// Add error state styles
const errorStateStyles = `
    .error-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #64748b;
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

// Performance optimization: Add animation on scroll
if ('IntersectionObserver' in window) {
    const documentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                documentObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe document items when they're added to the DOM
    setTimeout(() => {
        document.querySelectorAll('.document-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            documentObserver.observe(item);
        });
    }, 100);
}
