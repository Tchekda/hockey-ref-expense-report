class TeamsDirectory {
    constructor() {
        this.teams = [];
        this.filteredTeams = [];
        this.init();
    }

    async init() {
        await this.loadTeams();
        this.setupCategoryFilter();
        this.setupSearch();
        this.renderTable();
        this.updateStats();
    }

    async loadTeams() {
        try {
            const response = await fetch('data/hockey-teams.json');
            const data = await response.json();
            this.teams = data.teams || [];
            this.filteredTeams = [...this.teams];
        } catch (error) {
            console.error('Error loading teams:', error);
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performFilter();
            }, 300);
        });
    }

    setupCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');

        // Collect all unique categories
        const allCategories = new Set();
        this.teams.forEach(team => {
            if (team.categories && Array.isArray(team.categories)) {
                team.categories.forEach(category => allCategories.add(category));
            }
        });

        // Define category order to match main form dropdown
        const categoryOrder = [
            'Synerglace Ligue Magnus',
            'Division 1',
            'Division 2',
            'Division 3',
            'U20',
            'U18',
            'U15',
            'Féminine',
            'Para-hockey',
            'Amicaux',
            'Équipe de France',
            'Internationaux',
            'CHL',
            'ContiCup',
            'Autres'
        ];

        // Sort categories based on predefined order
        const sortedCategories = categoryOrder.filter(category => allCategories.has(category));

        // Populate the select dropdown
        sortedCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Add event listener for category filter
        categoryFilter.addEventListener('change', () => {
            this.performFilter();
        });
    }

    performFilter() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');

        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;

        if (!searchTerm && !selectedCategory) {
            this.filteredTeams = [...this.teams];
        } else {
            this.filteredTeams = this.teams.filter(team => {
                // Search filter
                let searchMatch = true;
                if (searchTerm) {
                    const nameMatch = team.name.toLowerCase().includes(searchTerm);
                    const emailMatch = team.emails.some(emailObj =>
                        emailObj.email.toLowerCase().includes(searchTerm) ||
                        emailObj.label.toLowerCase().includes(searchTerm)
                    );
                    const categoryMatch = team.categories && team.categories.some(category =>
                        category.toLowerCase().includes(searchTerm)
                    );
                    searchMatch = nameMatch || emailMatch || categoryMatch;
                }

                // Category filter
                let categoryMatch = true;
                if (selectedCategory) {
                    categoryMatch = team.categories && team.categories.includes(selectedCategory);
                }

                return searchMatch && categoryMatch;
            });
        }

        this.renderTable();
        this.updateStats();
    }

    renderTable() {
        const tbody = document.getElementById('teamsTableBody');
        const noResults = document.getElementById('noResults');
        const table = document.getElementById('teamsTable');

        if (this.filteredTeams.length === 0) {
            table.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        table.style.display = 'table';
        noResults.style.display = 'none';

        tbody.innerHTML = this.filteredTeams.map(team => `
            <tr>
                <td class="team-name" data-label="Équipe">${this.escapeHtml(team.name)}</td>
                <td data-label="Catégories">
                    <div class="categories-list">
                        ${team.categories && team.categories.length > 0
                ? team.categories.map(category =>
                    `<span class="category-tag">${this.escapeHtml(category)}</span>`
                ).join('')
                : '<span class="no-categories">-</span>'
            }
                    </div>
                </td>
                <td data-label="Contacts">
                    <div class="email-list">
                        ${team.emails.map(emailObj => `
                            <div class="email-item">
                                <div class="email-label">${this.escapeHtml(emailObj.label)}</div>
                                <a href="mailto:${this.escapeHtml(emailObj.email)}" class="email-address">
                                    ${this.escapeHtml(emailObj.email)}
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateStats() {
        const totalTeams = this.teams.length;
        const totalEmails = this.teams.reduce((sum, team) => sum + team.emails.length, 0);
        const visibleTeams = this.filteredTeams.length;

        document.getElementById('totalTeams').textContent = totalTeams;
        document.getElementById('totalEmails').textContent = totalEmails;
        document.getElementById('visibleTeams').textContent = visibleTeams;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TeamsDirectory();
});
