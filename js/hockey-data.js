/**
 * Hockey Data Management
 * Handles team autocomplete functionality
 */
class HockeyData {
    constructor() {
        this.teams = [];
        this.teamEmails = new Map();
        this.isLoaded = false;

        this.loadData();
    }

    /**
     * Load hockey teams data from JSON file
     */
    async loadData() {
        try {
            const response = await fetch('data/hockey-teams.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Process teams data
            this.teams = [];
            this.teamEmails = new Map();
            this.nameToTeam = new Map();
            this.allNames = [];
            this.mainNames = [];
            data.teams.forEach(team => {
                // Add main name
                this.teams.push(team.name);
                this.allNames.push(team.name);
                this.mainNames.push(team.name);
                this.nameToTeam.set(team.name.toLowerCase(), team);
                // Add alternate names
                if (team.alternateNames && Array.isArray(team.alternateNames)) {
                    team.alternateNames.forEach(alt => {
                        this.allNames.push(alt);
                        this.nameToTeam.set(alt.toLowerCase(), team);
                    });
                }
                this.teamEmails.set(team.name, team.emails || []);
            });

            this.isLoaded = true;
            this.initializeAutocomplete();

            console.log(`Loaded ${this.teams.length} teams`);

        } catch (error) {
            console.warn('Could not load hockey data:', error);
            this.isLoaded = false;
            // Initialize empty autocomplete so form still works
            this.initializeAutocomplete();
        }
    }

    /**
     * Initialize autocomplete datalists
     */
    initializeAutocomplete() {
        this.createDataList('teamsList', this.mainNames.sort());
    }

    /**
     * Create a datalist element with options
     */
    createDataList(id, options) {
        let datalist = document.getElementById(id);
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = id;
            document.querySelector('form').appendChild(datalist);
        }

        datalist.innerHTML = '';
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            datalist.appendChild(optionElement);
        });
    }

    /**
     * Get team emails for contact display
     */
    getTeamEmails(teamName) {
        if (!this.isLoaded) return [];
        const team = this.nameToTeam.get((teamName || '').toLowerCase());
        return team && team.emails ? team.emails : [];
    }

    /**
     * Check if team exists in the database
     */
    teamExists(teamName) {
        return this.nameToTeam.has((teamName || '').toLowerCase());
    }
}

// Global instance
let hockeyData = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    hockeyData = new HockeyData();
    window.hockeyData = hockeyData; // Make it globally accessible
});
