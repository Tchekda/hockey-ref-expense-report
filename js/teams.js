class TeamsDirectory {
    constructor() {
        this.teams = [];
        this.filteredTeams = [];
        this.init();
    }

    async init() {
        await this.loadTeams();
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
                this.performSearch(e.target.value);
            }, 300);
        });
    }

    performSearch(query) {
        const searchTerm = query.toLowerCase().trim();

        if (!searchTerm) {
            this.filteredTeams = [...this.teams];
        } else {
            this.filteredTeams = this.teams.filter(team => {
                // Search in team name
                const nameMatch = team.name.toLowerCase().includes(searchTerm);

                // Search in email addresses and labels
                const emailMatch = team.emails.some(emailObj =>
                    emailObj.email.toLowerCase().includes(searchTerm) ||
                    emailObj.label.toLowerCase().includes(searchTerm)
                );

                return nameMatch || emailMatch;
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
                <td class="team-name">${this.escapeHtml(team.name)}</td>
                <td>
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
