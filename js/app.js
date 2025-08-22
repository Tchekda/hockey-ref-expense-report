// Main application initialization
class ExpenseApp {
    constructor() {
        this.storage = new DataStorage();
        this.pdfGenerator = new PDFGenerator();
        this.formHandler = new FormHandler(this.storage, this.pdfGenerator);

        this.init();
    }

    init() {
        // Load saved data on page load
        this.loadInitialData();

        // Setup additional features
        this.setupKeyboardShortcuts();
        this.setupServiceWorker();

        console.log('Expense Report Generator initialized');
    }

    // Load any saved persistent data
    loadInitialData() {
        // Always clear temporary fields first
        this.storage.clearTemporaryFields();

        if (this.storage.hasData()) {
            this.storage.loadPersistentData();
        }

        // Set default values (today's date for match and footer)
        this.storage.autoPopulateDefaults();

        // Initialize signature preview
        const signaturePreview = document.getElementById('signaturePreview');
        if (signaturePreview && !signaturePreview.querySelector('img')) {
            signaturePreview.classList.add('empty');
        }
    }

    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S to save data
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.formHandler.saveData();
            }

            // Ctrl+Enter to generate PDF
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.formHandler.handleFormSubmission();
            }
        });
    }

    // Setup service worker for offline functionality (optional)
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            // For future enhancement - offline functionality
            console.log('Service Worker support detected');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.expenseApp = new ExpenseApp();
});

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);

    // Show user-friendly error message
    const message = document.createElement('div');
    message.className = 'message error';
    message.textContent = 'Une erreur inattendue s\'est produite. Veuillez recharger la page.';

    document.body.insertAdjacentElement('afterbegin', message);

    setTimeout(() => {
        message.remove();
    }, 10000);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});
