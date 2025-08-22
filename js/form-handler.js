// Form handling and validation
class FormHandler {
    constructor(storage, pdfGenerator) {
        this.storage = storage;
        this.pdfGenerator = pdfGenerator;
        this.form = document.getElementById('expenseForm');
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAutoPopulation();
    }

    // Bind event listeners
    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Save data button
        const saveButton = document.getElementById('saveData');
        saveButton.addEventListener('click', () => {
            this.saveData();
        });

        // Signature file input
        const signatureInput = document.getElementById('signature');
        signatureInput.addEventListener('change', (e) => {
            this.handleSignatureUpload(e);
        });

        // Clear signature button
        const clearSignatureBtn = document.getElementById('clearSignature');
        clearSignatureBtn.addEventListener('click', () => {
            this.storage.clearSignature();
        });

        // Format IBAN input
        const ibanField = document.getElementById('iban');
        ibanField.addEventListener('input', (e) => {
            this.formatIBAN(e.target);
        });

        // Validate email on blur
        const emailField = document.getElementById('email');
        emailField.addEventListener('blur', (e) => {
            this.validateEmail(e.target);
        });

        // Show/hide travel payment toggle based on travel indemnity value
        const travelIndemnityField = document.getElementById('travelIndemnity');
        travelIndemnityField.addEventListener('input', (e) => {
            this.toggleTravelPaymentOptions(e.target);
        });

        // Set default location when match location changes
        const matchLocationField = document.getElementById('matchLocation');
        matchLocationField.addEventListener('input', (e) => {
            this.updateDefaultLocation(e.target.value);
        });

        // Track manual changes to "madeIn" field
        const madeInField = document.getElementById('madeIn');
        madeInField.addEventListener('input', (e) => {
            // Mark as manually changed if user types something
            if (e.target.value !== document.getElementById('matchLocation').value) {
                e.target.dataset.autoFilled = 'false';
            }
        });
    }    // Setup auto-population features
    setupAutoPopulation() {
        // Set today's date as default for footer
        const madeOnField = document.getElementById('madeOn');
        if (madeOnField && !madeOnField.value) {
            madeOnField.value = new Date().toISOString().split('T')[0];
        }

        // Check travel indemnity on page load to show/hide toggle
        const travelIndemnityField = document.getElementById('travelIndemnity');
        if (travelIndemnityField) {
            this.toggleTravelPaymentOptions(travelIndemnityField);
        }

        // Set initial default location if match location already has a value
        const matchLocationField = document.getElementById('matchLocation');
        if (matchLocationField && matchLocationField.value) {
            this.updateDefaultLocation(matchLocationField.value);
        }
    }

    // Handle form submission
    async handleFormSubmission() {
        if (!this.validateForm()) {
            this.showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        this.setLoading(true);

        try {
            const formData = this.collectFormData();
            const success = this.pdfGenerator.generatePDF(formData);

            if (success) {
                this.showMessage('PDF généré avec succès !', 'success');
                // Auto-save persistent data
                this.storage.savePersistentData();
            } else {
                this.showMessage('Erreur lors de la génération du PDF.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Une erreur est survenue.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    // Save persistent data
    saveData() {
        const success = this.storage.savePersistentData();

        if (success) {
            this.showMessage('Données sauvegardées avec succès !', 'success');
        } else {
            this.showMessage('Erreur lors de la sauvegarde.', 'error');
        }
    }

    // Collect all form data
    collectFormData() {
        const formData = {};
        const inputs = this.form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.type === 'file') {
                // Handle signature separately
                formData.signature = this.storage.getSignatureData();
            } else if (input.type === 'radio') {
                // Handle radio buttons
                if (input.checked) {
                    formData[input.name] = input.value;
                }
            } else {
                formData[input.id] = input.value;
            }
        });

        return formData;
    }    // Validate entire form
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    // Format IBAN input
    formatIBAN(input) {
        let value = input.value.replace(/\s/g, '').toUpperCase();

        // Add spaces every 4 characters
        value = value.replace(/(.{4})/g, '$1 ').trim();

        input.value = value;
    }

    // Handle signature image upload
    handleSignatureUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showMessage('Veuillez sélectionner un fichier image.', 'error');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            this.showMessage('L\'image est trop volumineuse (max 2MB).', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.storage.displaySignature(e.target.result);
            this.showMessage('Signature ajoutée avec succès !', 'success');
        };
        reader.onerror = () => {
            this.showMessage('Erreur lors du chargement de l\'image.', 'error');
        };
        reader.readAsDataURL(file);
    }    // Validate email
    validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (input.value && !emailRegex.test(input.value)) {
            input.classList.add('error');
            this.showMessage('Format d\'email invalide.', 'error');
        } else {
            input.classList.remove('error');
        }
    }

    // Show message to user
    showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;

        // Insert at top of form
        this.form.insertBefore(message, this.form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Set loading state
    setLoading(isLoading) {
        if (isLoading) {
            document.body.classList.add('loading');
        } else {
            document.body.classList.remove('loading');
        }
    }

    // Toggle travel payment options based on travel indemnity value
    toggleTravelPaymentOptions(input) {
        const toggle = document.getElementById('travelPaymentToggle');
        const value = parseFloat(input.value) || 0;

        if (value > 0) {
            toggle.style.display = 'block';
        } else {
            toggle.style.display = 'none';
        }
    }

    // Update default location for "Fait à" based on match location
    updateDefaultLocation(matchLocation) {
        const madeInField = document.getElementById('madeIn');

        // Only update if the field is empty or hasn't been manually changed
        if (!madeInField.value || madeInField.dataset.autoFilled === 'true') {
            madeInField.value = matchLocation;
            madeInField.dataset.autoFilled = 'true';
        }
    }

    // Load saved data
    loadSavedData() {
        const success = this.storage.loadPersistentData();

        if (success) {
            this.storage.autoPopulateFooter();
            this.showMessage('Données chargées avec succès !', 'success');
        }
    }
}
