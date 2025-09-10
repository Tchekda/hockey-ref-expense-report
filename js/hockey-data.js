/**
 * Hockey Data Management
 * Handles team autocomplete functionality
 */
class HockeyData {
    constructor() {
        this.teams = [];
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

}

// Global instance
let hockeyData = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    hockeyData = new HockeyData();
});
