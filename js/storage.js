// Storage utility for managing persistent data
class DataStorage {
    constructor() {
        this.storageKey = 'refereeExpenseData';
        this.persistentFields = [
            'firstName', 'lastName', 'licenseNumber', 'address', 'email',
            'iban', 'bic', 'rib'
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
}
