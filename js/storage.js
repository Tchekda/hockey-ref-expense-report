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

        // Setup immediate persistence for personal fields
        this.setupImmediatePersistence();
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
            // Test localStorage availability (iOS Safari private browsing fix)
            if (!this.isLocalStorageAvailable()) {
                console.warn('localStorage not available, using fallback storage');
                this.showStorageWarning();
                this.saveToFallback(data, signatureData);
                return true;
            }

            localStorage.setItem(this.storageKey, JSON.stringify(data));
            if (signatureData) {
                localStorage.setItem(this.signatureKey, signatureData);
            }
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            // Fallback to alternative storage
            this.showStorageWarning();
            this.saveToFallback(data, signatureData);
            return false;
        }
    }    // Load persistent data from localStorage
    loadPersistentData() {
        try {
            let savedData = null;

            if (this.isLocalStorageAvailable()) {
                savedData = localStorage.getItem(this.storageKey);
            } else {
                savedData = this.loadFromFallback();
            }

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
        if (this.isLocalStorageAvailable()) {
            return localStorage.getItem(this.storageKey) !== null;
        } else {
            return this.loadFromFallback() !== null;
        }
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
            let signatureData = null;

            if (this.isLocalStorageAvailable()) {
                signatureData = localStorage.getItem(this.signatureKey);
            } else {
                signatureData = this.loadSignatureFromFallback();
            }

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
        const queryFields = {
            // Match fields
            'matchDate': 'a', 'matchTime': 'b', 'matchLocation': 'c', 'homeTeam': 'd', 'awayTeam': 'e',
            'category': 'f', 'position': 'g',
            // Indemnity fields
            'matchIndemnity': 'h', 'travelIndemnity': 'i'
        };

        let hasQueryData = false;

        Object.entries(queryFields).forEach(([fieldId, alias]) => {
            const value = urlParams.get(fieldId) || urlParams.get(alias); // Check both full name and alias
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
                    } else {
                        // For other input types
                        element.value = value;
                        hasQueryData = true;
                    }
                }
            }
        });

        // If matchLocation was set via query params, auto-fill madeIn field
        const matchLocationValue = urlParams.get('matchLocation') || urlParams.get('c');
        if (matchLocationValue) {
            const madeInField = document.getElementById('madeIn');
            if (madeInField && !madeInField.value) {
                madeInField.value = matchLocationValue;
            }
        }

        return hasQueryData;
    }

    // Setup immediate persistence for personal fields
    setupImmediatePersistence() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.attachPersistenceListeners());
        } else {
            this.attachPersistenceListeners();
        }
    }

    // Attach event listeners for immediate persistence
    attachPersistenceListeners() {
        this.persistentFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                // Use 'input' event for real-time saving as user types
                element.addEventListener('input', () => {
                    this.debouncedSave();
                });

                // Also save on blur (when user leaves the field)
                element.addEventListener('blur', () => {
                    this.savePersistentData();
                });
            }
        });

        // Handle signature changes immediately
        const signatureInput = document.getElementById('signature');
        if (signatureInput) {
            signatureInput.addEventListener('change', () => {
                // Small delay to allow signature processing
                setTimeout(() => {
                    const signatureData = this.getSignatureData();
                    if (signatureData) {
                        try {
                            if (this.isLocalStorageAvailable()) {
                                localStorage.setItem(this.signatureKey, signatureData);
                            } else {
                                this.saveSignatureToFallback(signatureData);
                            }
                        } catch (error) {
                            console.error('Error saving signature:', error);
                            this.saveSignatureToFallback(signatureData);
                        }
                    }
                }, 100);
            });
        }
    }

    // Debounced save to avoid excessive localStorage writes
    debouncedSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.savePersistentData();
        }, 500); // Save 500ms after user stops typing
    }

    // Check if localStorage is available (iOS Safari private browsing fix)
    isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Fallback storage using sessionStorage or memory
    saveToFallback(data, signatureData) {
        try {
            // Try sessionStorage first
            sessionStorage.setItem(this.storageKey, JSON.stringify(data));
            if (signatureData) {
                sessionStorage.setItem(this.signatureKey, signatureData);
            }
        } catch (e) {
            // Last resort: store in memory (lost on page refresh)
            window._refereeExpenseData = data;
            window._refereeSignature = signatureData;
        }
    }

    // Load from fallback storage
    loadFromFallback() {
        try {
            // Try sessionStorage first
            return sessionStorage.getItem(this.storageKey);
        } catch (e) {
            // Check memory storage
            return window._refereeExpenseData ? JSON.stringify(window._refereeExpenseData) : null;
        }
    }

    // Load signature from fallback storage
    loadSignatureFromFallback() {
        try {
            // Try sessionStorage first
            return sessionStorage.getItem(this.signatureKey);
        } catch (e) {
            // Check memory storage
            return window._refereeSignature || null;
        }
    }

    // Save signature to fallback storage
    saveSignatureToFallback(signatureData) {
        try {
            sessionStorage.setItem(this.signatureKey, signatureData);
        } catch (e) {
            window._refereeSignature = signatureData;
        }
    }

    // Show storage warning to user
    showStorageWarning() {
        // Avoid showing multiple warnings
        if (this._warningShown) return;
        this._warningShown = true;

        const warningDiv = document.createElement('div');
        warningDiv.className = 'storage-warning';
        warningDiv.innerHTML = `
            <div class="storage-warning-content">
                <span class="storage-warning-icon">⚠️</span>
                <div class="storage-warning-text">
                    <strong>Stockage limité détecté</strong><br>
                    Vos données personnelles ne seront pas sauvegardées de manière permanente.
                    <br><small>
                        ${this.getStorageAdvice()}
                    </small>
                </div>
                <button class="storage-warning-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add CSS styles if not already added
        if (!document.getElementById('storage-warning-styles')) {
            const style = document.createElement('style');
            style.id = 'storage-warning-styles';
            style.textContent = `
                .storage-warning {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 8px;
                    padding: 12px;
                    max-width: 90%;
                    width: 400px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .storage-warning-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }
                .storage-warning-icon {
                    font-size: 20px;
                    flex-shrink: 0;
                }
                .storage-warning-text {
                    flex: 1;
                    font-size: 14px;
                    color: #856404;
                }
                .storage-warning-text strong {
                    color: #533f03;
                }
                .storage-warning-text small {
                    color: #6c757d;
                    display: block;
                    margin-top: 4px;
                }
                .storage-warning-close {
                    background: none;
                    border: none;
                    font-size: 18px;
                    color: #856404;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .storage-warning-close:hover {
                    color: #533f03;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(warningDiv);

        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (warningDiv.parentNode) {
                warningDiv.remove();
            }
        }, 15000);
    }

    // Get device-specific storage advice
    getStorageAdvice() {
        const userAgent = navigator.userAgent.toLowerCase();

        if (userAgent.includes('safari') && userAgent.includes('mobile')) {
            return 'Sur iOS Safari : Désactivez la navigation privée pour une sauvegarde permanente.';
        } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
            return 'Sur Safari : Vérifiez que le stockage local est autorisé dans les préférences.';
        } else if (userAgent.includes('fbav') || userAgent.includes('messenger')) {
            return 'Dans Messenger : Ouvrez le lien dans Safari ou Chrome pour une meilleure expérience.';
        } else {
            return 'Vos données seront supprimées lorsque vous fermerez l\'onglet ou le navigateur.';
        }
    }
}
