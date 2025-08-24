// Storage utility for managing persistent data
class DataStorage {
    constructor() {
        this.storageKey = 'refereeExpenseData';
        this.persistentFields = [
            'firstName', 'lastName', 'licenseNumber', 'address', 'email',
            'iban', 'bic', 'rib'
        ];
        this.temporaryFields = [
            'matchDate', 'matchTime', 'matchLocation', 'homeTeam', 'awayTeam',
            'category', 'position', 'matchIndemnity', 'travelIndemnity',
            'madeIn', 'madeOn'
        ];
        this.signatureKey = 'refereeSignature';
    }

    // Save persistent data to localStorage
    savePersistentData() {
        const data = {};

        this.persistentFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                data[fieldId] = element.value;
            }
        });

        // Save signature separately due to size
        const signatureData = this.getSignatureData();

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            if (signatureData) {
                localStorage.setItem(this.signatureKey, signatureData);
            }
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }    // Load persistent data from localStorage
    loadPersistentData() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) return false;

            const data = JSON.parse(savedData);

            this.persistentFields.forEach(fieldId => {
                const element = document.getElementById(fieldId);
                if (element && data[fieldId]) {
                    element.value = data[fieldId];
                }
            });

            // Load signature
            this.loadSignatureData();

            return true;
        } catch (error) {
            console.error('Error loading data:', error);
            return false;
        }
    }

    // Clear all saved data
    clearSavedData() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }

    // Check if data exists
    hasData() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    // Auto-populate footer fields
    autoPopulateFooter() {
        const madeOnField = document.getElementById('madeOn');

        // Set today's date if not already set
        if (madeOnField && !madeOnField.value) {
            madeOnField.value = new Date().toISOString().split('T')[0];
        }
    }

    // Auto-populate default values
    autoPopulateDefaults() {
        const today = new Date().toISOString().split('T')[0];

        // Set today's date for match date
        const matchDateField = document.getElementById('matchDate');
        if (matchDateField && !matchDateField.value) {
            matchDateField.value = today;
        }

        // Set today's date for footer
        const madeOnField = document.getElementById('madeOn');
        if (madeOnField && !madeOnField.value) {
            madeOnField.value = today;
        }
    }

    // Clear temporary fields on page load
    clearTemporaryFields() {
        this.temporaryFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                if (element.type === 'select-one') {
                    element.selectedIndex = 0; // Reset to first option
                } else {
                    element.value = '';
                }
            }
        });

        // Clear radio buttons
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            if (radio.name === 'travelPayment') {
                radio.checked = radio.value === 'FFHG'; // Reset to default
            }
        });

        // Hide travel payment toggle
        const toggle = document.getElementById('travelPaymentToggle');
        if (toggle) {
            toggle.style.display = 'none';
        }
    }

    // Get signature data from preview
    getSignatureData() {
        const preview = document.getElementById('signaturePreview');
        const img = preview.querySelector('img');
        return img ? img.src : null;
    }

    // Load signature data
    loadSignatureData() {
        try {
            const signatureData = localStorage.getItem(this.signatureKey);
            if (signatureData) {
                this.displaySignature(signatureData);
            }
        } catch (error) {
            console.error('Error loading signature:', error);
        }
    }

    // Display signature in preview
    displaySignature(base64Data) {
        const preview = document.getElementById('signaturePreview');
        const clearBtn = document.getElementById('clearSignature');

        preview.innerHTML = `<img src="${base64Data}" alt="Signature" />`;
        preview.classList.remove('empty');
        clearBtn.style.display = 'inline-block';
    }

    // Clear signature
    clearSignature() {
        const preview = document.getElementById('signaturePreview');
        const clearBtn = document.getElementById('clearSignature');
        const fileInput = document.getElementById('signature');

        preview.innerHTML = '';
        preview.classList.add('empty');
        clearBtn.style.display = 'none';
        fileInput.value = '';

        // Remove from storage
        localStorage.removeItem(this.signatureKey);
    }

    // Load data from query parameters
    loadFromQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const queryFields = [
            // Match fields
            'matchDate', 'matchTime', 'matchLocation', 'homeTeam', 'awayTeam', 'category', 'position',
            // Indemnity fields
            'matchIndemnity', 'travelIndemnity', 'travelPayment'
        ];

        let hasQueryData = false;

        queryFields.forEach(fieldId => {
            const value = urlParams.get(fieldId);
            if (value) {
                const element = document.getElementById(fieldId);
                if (element) {
                    if (element.type === 'select-one') {
                        // For select elements, set the value if it exists as an option
                        const option = Array.from(element.options).find(opt => opt.value === value);
                        if (option) {
                            element.value = value;
                            hasQueryData = true;
                        }
                    } else if (fieldId === 'travelPayment') {
                        // Handle radio buttons for travel payment
                        const radioButton = document.querySelector(`input[name="travelPayment"][value="${value}"]`);
                        if (radioButton) {
                            radioButton.checked = true;
                            hasQueryData = true;
                        }
                    } else {
                        // For other input types
                        element.value = value;
                        hasQueryData = true;
                    }
                }
            }
        });

        // If travel indemnity was set via query params, show the toggle
        if (urlParams.get('travelIndemnity')) {
            const travelIndemnityField = document.getElementById('travelIndemnity');
            if (travelIndemnityField && parseFloat(travelIndemnityField.value) > 0) {
                const toggle = document.getElementById('travelPaymentToggle');
                if (toggle) {
                    toggle.style.display = 'block';
                }
            }
        }

        return hasQueryData;
    }
}
