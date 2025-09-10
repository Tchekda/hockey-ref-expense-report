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
        this.setupHockeyDataIntegration();
    }

    // Bind event listeners
    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Clear data button
        const clearButton = document.getElementById('clearData');
        clearButton.addEventListener('click', () => {
            this.clearData();
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

    // Setup hockey data integration
    setupHockeyDataIntegration() {
        // Wait for hockey data to load before setting up enhanced functionality
        const checkHockeyData = () => {
            console.log('Checking hockey data load status...');
            if (window.hockeyData && window.hockeyData.isLoaded) {
                this.bindHockeyDataEvents();
            } else {
                // Check again in 100ms
                setTimeout(checkHockeyData, 100);
            }
        };
        checkHockeyData();
    }

    // Bind hockey data specific events
    bindHockeyDataEvents() {
        const homeTeamInput = document.getElementById('homeTeam');

        // Enhanced home team selection with email display
        if (homeTeamInput) {
            homeTeamInput.addEventListener('change', (e) => {
                this.displayTeamEmails(e.target.value);
            });

            homeTeamInput.addEventListener('blur', (e) => {
                this.displayTeamEmails(e.target.value);
            });

            // Check initial value when hockey data loads
            if (homeTeamInput.value) {
                this.displayTeamEmails(homeTeamInput.value);
            }
        }

        console.log('Hockey data integration active');
    }

    // Display team emails or warning message
    displayTeamEmails(teamName) {
        const emailContainer = document.getElementById('teamEmailsContainer');
        if (!emailContainer) {
            this.createEmailContainer();
            return this.displayTeamEmails(teamName); // Retry after creating container
        }

        // Clear previous content
        emailContainer.innerHTML = '';
        emailContainer.style.display = 'none';

        if (!teamName || !window.hockeyData || !window.hockeyData.isLoaded) {
            return;
        }

        if (window.hockeyData.teamExists(teamName)) {
            const emails = window.hockeyData.getTeamEmails(teamName);
            if (emails && emails.length > 0) {
                this.showTeamEmails(emailContainer, teamName, emails);
            }
        } else {
            this.showTeamNotFoundWarning(emailContainer, teamName);
        }
    }

    // Create email container if it doesn't exist
    createEmailContainer() {
        const formActions = document.querySelector('.form-actions');
        if (!formActions) return;

        const container = document.createElement('div');
        container.id = 'teamEmailsContainer';
        container.className = 'team-emails-container';

        // Insert before the form actions
        formActions.parentNode.insertBefore(container, formActions);
    }

    // Show team emails
    showTeamEmails(container, teamName, emails) {
        container.innerHTML = `
            <div class="team-emails-header">
                <h4>📧 Contacts pour ${teamName}</h4>
            </div>
            <div class="team-emails-list">
                ${emails.map(emailObj => `
                    <div class="email-item">
                        <div class="email-label">${emailObj.label}</div>
                        <div class="email-address">
                            <a href="mailto:${emailObj.email}">${emailObj.email}</a>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="team-emails-footer">
                <small>💡 Contactez-moi pour ajouter ou modifier des adresses mail</small>
            </div>
        `;
        container.style.display = 'block';
    }

    // Show warning for unknown team
    showTeamNotFoundWarning(container, teamName) {
        container.innerHTML = `
            <div class="team-warning">
                <div class="warning-header">
                    <span class="warning-icon">⚠️</span>
                    <strong>Aucune adresse mail disponible</strong>
                </div>
                <p>Aucune adresse mail trouvée pour <strong>"${teamName}"</strong>.</p>
                <p>Contactez-moi pour ajouter les informations correctes (coordonnées disponibles en bas de page).</p>
            </div>
        `;
        container.style.display = 'block';
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
            const success = await this.pdfGenerator.generatePDF(formData);

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

    // Clear persistent data
    clearData() {
        // Show confirmation dialog
        if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données enregistrées (informations personnelles, bancaires et signature) ? Cette action est irréversible.')) {
            const success = this.storage.clearSavedData();

            if (success) {
                // Clear the form fields
                this.storage.persistentFields.forEach(fieldId => {
                    const element = document.getElementById(fieldId);
                    if (element) {
                        element.value = '';
                    }
                });

                // Clear signature
                this.storage.clearSignature();

                this.showMessage('Toutes les données enregistrées ont été supprimées avec succès !', 'success');
            } else {
                this.showMessage('Erreur lors de la suppression des données.', 'error');
            }
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

        // Create message at top of form
        const topMessage = document.createElement('div');
        topMessage.className = `message ${type}`;
        topMessage.textContent = text;

        // Insert at top of form
        this.form.insertBefore(topMessage, this.form.firstChild);

        // Create message near the button at bottom
        const bottomMessage = document.createElement('div');
        bottomMessage.className = `message ${type}`;
        bottomMessage.textContent = text;
        bottomMessage.style.marginTop = '10px';

        // Insert after form actions (buttons)
        const formActions = document.querySelector('.form-actions');
        if (formActions) {
            formActions.parentNode.insertBefore(bottomMessage, formActions.nextSibling);
        }

        // Auto-remove both messages after 5 seconds
        setTimeout(() => {
            topMessage.remove();
            bottomMessage.remove();
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
        const toggle = document.getElementById('travelPayment');
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
