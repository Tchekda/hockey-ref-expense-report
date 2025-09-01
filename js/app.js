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
        let deferredPrompt;

        // Debug: Check if PWA criteria are met
        console.log('PWA Setup: Checking install criteria...');
        console.log('PWA Setup: Service Worker support:', 'serviceWorker' in navigator);
        console.log('PWA Setup: Manifest link found:', !!document.querySelector('link[rel="manifest"]'));

        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA install prompt available');
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            // Show install button
            this.showInstallButton(deferredPrompt);
        });

        // Listen for successful installation
        window.addEventListener('appinstalled', (e) => {
            console.log('PWA was installed successfully');
            this.hideInstallButton();
        });

        // Debug: Check after a delay if no install prompt appeared
        setTimeout(() => {
            if (!deferredPrompt) {
                console.log('PWA Setup: No install prompt after 3 seconds');
                console.log('PWA Setup: This could be because:');
                console.log('- App is already installed');
                console.log('- Site is not served over HTTPS (except localhost)');
                console.log('- Manifest has validation errors');
                console.log('- Service Worker registration failed');

                // Show manual instructions for testing
                this.showManualInstallInstructions();
            }
        }, 3000);
    }

    // Show PWA install button
    showInstallButton(deferredPrompt) {
        // Check if button already exists
        if (document.getElementById('pwa-install-btn')) return;

        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.className = 'btn btn-install';
        installBtn.innerHTML = '📱 Installer l\'app';
        installBtn.title = 'Installer cette application sur votre appareil';

        // Add CSS for install button
        const style = document.createElement('style');
        style.textContent = `
            .btn-install {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #1e40af;
                color: white;
                border: none;
                padding: 12px 16px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
                cursor: pointer;
                z-index: 1000;
                transition: all 0.3s ease;
                font-family: system-ui, -apple-system, sans-serif;
            }
            .btn-install:hover {
                background: #1d4ed8;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(30, 64, 175, 0.4);
            }
            .btn-install:active {
                transform: translateY(0);
            }
            @media (max-width: 768px) {
                .btn-install {
                    bottom: 80px;
                    right: 16px;
                    font-size: 13px;
                    padding: 10px 14px;
                }
            }
        `;
        document.head.appendChild(style);

        // Add click handler
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                // Clear the deferred prompt
                deferredPrompt = null;
                // Hide the install button
                this.hideInstallButton();
            }
        });

        // Add to page
        document.body.appendChild(installBtn);
    }

    // Hide PWA install button
    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }

    // Show manual install instructions for debugging
    showManualInstallInstructions() {
        // Only show on mobile and if not already shown
        if (!('ontouchstart' in window) || document.getElementById('manual-install-debug')) {
            return;
        }

        const debugDiv = document.createElement('div');
        debugDiv.id = 'manual-install-debug';
        debugDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            right: 10px;
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 12px;
            font-size: 12px;
            z-index: 1001;
            font-family: system-ui, sans-serif;
        `;

        debugDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px;">🔧 PWA Debug Mode</div>
            <div style="margin-bottom: 8px;">
                <strong>Chrome:</strong> Menu (⋮) → "Installer l'app"<br>
                <strong>Firefox:</strong> Menu → "Installer" ou "Ajouter à l'écran d'accueil"
            </div>
            <button onclick="this.parentElement.remove()" style="background: #f59e0b; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px;">Fermer</button>
        `;

        document.body.appendChild(debugDiv);

        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (debugDiv.parentNode) {
                debugDiv.remove();
            }
        }, 15000);
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
