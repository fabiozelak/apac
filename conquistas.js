/**
 * Gerenciador de Conquistas - APAC
 * Responsável por carregar, manipular e renderizar dados de campeonatos e atletas
 */

class ConquistasManager {
  constructor() {
    this.championships = [];
    this.container = document.getElementById('championshipsContainer');
  }

  /**
   * Carregar dados do arquivo JSON
   */
  async loadFromJSON(jsonPath) {
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`Erro ao carregar JSON: ${response.statusText}`);
      }
      const data = await response.json();
      this.championships = data.championships || [];
      this.render();
      return true;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.showError(error.message);
      return false;
    }
  }

  /**
   * Carregar dados de um array JavaScript
   */
  loadFromArray(championshipsArray) {
    this.championships = championshipsArray;
    this.render();
  }

  /**
   * Renderizar todos os campeonatos
   */
  render() {
    if (!this.container) {
      console.error('Container não encontrado');
      return;
    }

    if (this.championships.length === 0) {
      this.showEmpty();
      return;
    }

    this.container.innerHTML = this.championships
      .map(championship => this.renderChampionship(championship))
      .join('');
  }

  /**
   * Renderizar um campeonato individual
   */
  renderChampionship(championship) {
    return `
      <div class="championship-card">
        <div class="championship-header">
          <h1>${this.escapeHtml(championship.name)}</h1>
          <div class="championship-dates">
            <span>${this.escapeHtml(championship.startDate)}</span>
            <i class="fas fa-arrow-right"></i>
            <span>${this.escapeHtml(championship.endDate)}</span>
          </div>
          
          <div class="stats-summary">
            <div class="stat-card">
              <div class="stat-card-value">${championship.stats.totalMedals}</div>
              <div class="stat-card-label">Medalhas</div>
            </div>
            <div class="stat-card">
              <div class="stat-card-value">${championship.stats.athletes}</div>
              <div class="stat-card-label">Atletas</div>
            </div>
          </div>
        </div>

        <div class="athletes-container">
          ${championship.athletes
            .map(athlete => this.renderAthlete(athlete))
            .join('')}
        </div>
      </div>
    `;
  }

  /**
   * Renderizar um atleta individual
   */
  renderAthlete(athlete) {
    return `
      <div class="athlete-item">
        <div class="athlete-name">${this.escapeHtml(athlete.name)}</div>
        <div class="athlete-category">${this.escapeHtml(athlete.category)}</div>
        <ul class="achievements-list">
          ${athlete.achievements
            .map(achievement => `<li>${this.escapeHtml(achievement)}</li>`)
            .join('')}
        </ul>
      </div>
    `;
  }

  /**
   * Mostrar estado vazio
   */
  showEmpty() {
    this.container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🏅</div>
        <h3>Nenhuma conquista registrada</h3>
        <p>As conquistas dos atletas aparecerão aqui conforme os resultados saem.</p>
      </div>
    `;
  }

  /**
   * Mostrar erro
   */
  showError(message) {
    this.container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Erro ao carregar dados</h3>
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  /**
   * Adicionar novo campeonato
   */
  addChampionship(championship) {
    this.championships.unshift(championship);
    this.render();
  }

  /**
   * Adicionar atleta a um campeonato
   */
  addAthlete(championshipId, athlete) {
    const championship = this.championships.find(c => c.id === championshipId);
    if (championship) {
      championship.athletes.push(athlete);
      championship.stats.athletes = championship.athletes.length;
      this.render();
      return true;
    }
    console.warn(`Campeonato com ID "${championshipId}" não encontrado`);
    return false;
  }

  /**
   * Adicionar conquista a um atleta
   */
  addAchievement(championshipId, athleteId, achievement) {
    const championship = this.championships.find(c => c.id === championshipId);
    if (!championship) {
      console.warn(`Campeonato com ID "${championshipId}" não encontrado`);
      return false;
    }

    const athlete = championship.athletes.find(a => a.id === athleteId);
    if (!athlete) {
      console.warn(`Atleta com ID "${athleteId}" não encontrado`);
      return false;
    }

    athlete.achievements.push(achievement);
    this.render();
    return true;
  }

  /**
   * Remover campeonato
   */
  removeChampionship(championshipId) {
    const index = this.championships.findIndex(c => c.id === championshipId);
    if (index > -1) {
      this.championships.splice(index, 1);
      this.render();
      return true;
    }
    return false;
  }

  /**
   * Remover atleta
   */
  removeAthlete(championshipId, athleteId) {
    const championship = this.championships.find(c => c.id === championshipId);
    if (!championship) return false;

    const index = championship.athletes.findIndex(a => a.id === athleteId);
    if (index > -1) {
      championship.athletes.splice(index, 1);
      championship.stats.athletes = championship.athletes.length;
      this.render();
      return true;
    }
    return false;
  }

  /**
   * Obter campeonato por ID
   */
  getChampionship(championshipId) {
    return this.championships.find(c => c.id === championshipId);
  }

  /**
   * Obter atleta por ID
   */
  getAthlete(championshipId, athleteId) {
    const championship = this.getChampionship(championshipId);
    if (!championship) return null;
    return championship.athletes.find(a => a.id === athleteId);
  }

  /**
   * Escapar caracteres HTML para segurança
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Exportar dados como JSON
   */
  exportAsJSON() {
    return JSON.stringify({ championships: this.championships }, null, 2);
  }

  /**
   * Obter estatísticas gerais
   */
  getGlobalStats() {
    return {
      totalChampionships: this.championships.length,
      totalAthletes: this.championships.reduce((sum, c) => sum + c.athletes.length, 0),
      totalMedals: this.championships.reduce((sum, c) => sum + c.stats.totalMedals, 0)
    };
  }
}

// Instância global do gerenciador
let conquistasManager = null;

/**
 * Inicializar o gerenciador quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', async () => {
  conquistasManager = new ConquistasManager();
  
  // Tentar carregar do JSON
  const jsonLoaded = await conquistasManager.loadFromJSON('exemplo-estrutura-conquistas.json');
  
  // Se falhar, usar dados padrão
  if (!jsonLoaded) {
    console.log('Usando dados padrão...');
    conquistasManager.loadFromArray(getDefaultData());
  }
});

/**
 * Dados padrão (fallback)
 */
function getDefaultData() {
  return [
    {
      id: "estadual-2026",
      name: "ERRO de CArregamento",
      startDate: "15 de Janeiro",
      endDate: "20 de Janeiro",
      location: "São Paulo, SP",
      stats: {
        totalMedals: 4,
        athletes: 2
      },
      athletes: [
        {
          id: "atleta-001",
          name: "Maria Silva",
          category: "Categoria Sênior",
          achievements: [
            "1º lugar - Modalidade Solo Dance",
            "2º lugar - Modalidade Free Dance",
            "1º lugar - Geral"
          ]
        },
        {
          id: "atleta-002",
          name: "João Santos",
          category: "Categoria Sênior",
          achievements: [
            "2º lugar - Modalidade Solo Dance",
            "1º lugar - Modalidade Free Dance",
            "2º lugar - Geral"
          ]
        }
      ]
    }
  ];
}
