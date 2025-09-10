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
            this.teams = data.teams.map(team => team.name).sort();
            data.teams.forEach(team => {
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
        this.createDataList('teamsList', this.teams);
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
        return this.teamEmails.get(teamName) || [];
    }

    /**
     * Check if team exists in the database
     */
    teamExists(teamName) {
        return this.teams.includes(teamName);
    }
}

// Global instance
let hockeyData = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    hockeyData = new HockeyData();
    window.hockeyData = hockeyData; // Make it globally accessible
});
