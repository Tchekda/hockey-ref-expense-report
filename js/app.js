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

        // Load data from query parameters (takes priority)
        const hasQueryData = this.storage.loadFromQueryParams();

        if (this.storage.hasData()) {
            this.storage.loadPersistentData();
        }

        // Set default values only if no query data was loaded
        if (!hasQueryData) {
            this.storage.autoPopulateDefaults();
        } else {
            // Still set today's date for footer if not provided in query
            const madeOnField = document.getElementById('madeOn');
            if (madeOnField && !madeOnField.value) {
                madeOnField.value = new Date().toISOString().split('T')[0];
            }
        }

        // Initialize signature preview
        const signaturePreview = document.getElementById('signaturePreview');
        if (signaturePreview && !signaturePreview.querySelector('img')) {
            signaturePreview.classList.add('empty');
        }
    }    // Setup keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D to clear data (more secure combination for destructive action)
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.formHandler.clearData();
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
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then((registration) => {
                        console.log('Service Worker registered successfully:', registration);

                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            console.log('Service Worker update found');
                            const newWorker = registration.installing;

                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New version available, could show update notification
                                    console.log('New version available - reload to update');
                                }
                            });
                        });
                    })
                    .catch((error) => {
                        console.error('Service Worker registration failed:', error);
                    });
            });

            // Setup PWA install prompt
            this.setupPWAInstall();
        }
    }

    // Setup PWA installation prompt
    setupPWAInstall() {
        // Let browser handle PWA install prompt natively
        // Removed custom beforeinstallprompt handling to allow browser default

        // Listen for successful installation
        window.addEventListener('appinstalled', (e) => {
            console.log('PWA was installed successfully');
        });
    }
}// Initialize app when DOM is ready
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
