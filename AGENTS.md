# AGENTS.md - AI Code Assistant Documentation

> ⚠️ **Important**: This file must be kept updated when significant changes are made to the codebase, architecture, or functionality.

## Project Overview

**Hockey Referee Expense Report Generator** - A Progressive Web App (PWA) for French ice hockey referees to create professional PDF expense reports. Built with vanilla HTML/CSS/JavaScript with PWA capabilities, focusing on privacy, offline functionality, cross-platform compatibility, and native mobile experience.

### Core Purpose

- Generate official expense report PDFs for FFHG (Fédération Française de Hockey sur Glace) compliance
- 100% client-side processing - no server communication
- Progressive Web App with offline functionality and mobile installation
- Cross-platform data persistence with iOS Safari fallbacks

## Architecture & Technology Stack

### Progressive Web App (PWA) Features

- **Service Worker** (`sw.js`): Offline caching, background sync capabilities
- **Web App Manifest** (`manifest.json`): Mobile installation, app-like experience
- **Native Installation**: Browser-provided installation prompts (Chrome, Safari, Edge)
- **Offline Functionality**: Full PDF generation without internet connection

### Frontend Technologies

- **HTML5**: Semantic PWA-enabled form structure with manifest links
- **CSS3**: Mobile-first responsive design with device-specific optimizations
- **Vanilla JavaScript**: ES6+ classes, PWA features, no frameworks
- **jsPDF v2.5.1**: Client-side PDF generation library (CDN)
- **Canvas API**: Image processing, signature handling

### Key Design Principles

1. **Privacy First**: All data stays in browser, no server communication
2. **PWA Native Experience**: Installable app with offline capabilities
3. **Cross-Platform Storage**: Multi-layer fallbacks for iOS Safari compatibility
4. **Mobile Optimized**: Camera capture, touch-friendly UI, responsive header
5. **Data Persistence**: Smart separation of persistent vs. temporary data with platform detection

## Project Structure

```
├── index.html              # PWA-enabled form interface with manifest links
├── manifest.json           # PWA manifest for mobile installation
├── sw.js                   # Service Worker for offline functionality
├── css/
│   └── styles.css          # Responsive styling with mobile/desktop header variants
├── js/
│   ├── app.js              # PWA initialization and native installation handling
│   ├── form-handler.js     # Form validation, dual message display
│   ├── pdf-generator.js    # PDF creation with signature image processing
│   └── storage.js          # Multi-layer storage system with iOS Safari fallbacks
├── img/
│   └── arbitre.png         # PWA icon and application logo
├── README.md              # User documentation (updated with PWA features)
├── AGENTS.md              # This file - AI assistant technical documentation
├── LICENCE.md             # MIT license
└── Suivi NdF Arbitre.xlsx # Excel tracking file for report management
```

## Core Functionality

### 1. Form Management (`form-handler.js`)

**Primary Class**: `FormHandler`

- **Validation**: Real-time form validation with visual feedback
- **File Processing**: Multi-format signature handling (JPG, PNG) with conversion
- **Dual Messages**: Enhanced user feedback with both generating and completion messages
- **Event Handling**: Input formatting (IBAN), auto-population, mobile optimizations

**Key Methods**:

- `collectFormData()`: Comprehensive form data collection including file processing
- `validateForm()`: Enhanced validation with dual message display
- `handleSignatureUpload()`: Multi-format processing
- `toggleTravelPaymentOptions()`: Smart payment method selection UI
- `updateDefaultLocation()`: Auto-population with location intelligence

### 2. PDF Generation (`pdf-generator.js`)

**Class**: `PDFGenerator`

- **Layout**: A4 format with optimized margins and responsive positioning
- **Typography**: Consistent font sizing with device-specific adjustments
- **Sections**: Header with logo, Match, Referee, Indemnity, Banking, Footer/Signature
- **Advanced Image Processing**: Async image loading with signature integration
- **Alignment System**: Pre-calculated positioning for consistent value alignment

**Key Features**:

- `calculateAlignmentPositions()`: Multi-section alignment system for consistent formatting
- `loadImageAsync()`: Asynchronous image processing for signatures and logos
- Advanced signature handling: Multi-format image embedding
- Smart indemnity section with responsive alignment for varying label lengths
- French localization: Date formatting, currency display, cultural conventions
- Descriptive filename generation: `NoteDeFrais_MatchDate_Division_HomeTeam_vs_AwayTeam_RefereeName.pdf`

**Critical Implementation Details**:

- Separate alignment calculations for different sections accommodate varying label lengths
- Async image loading prevents PDF generation blocking
- Logo integration with fallback handling for missing images

### 3. Data Storage (`storage.js`)

**Class**: `DataStorage`

- **Multi-Layer Storage**: localStorage → sessionStorage → memory (iOS Safari fallbacks)
- **Platform Detection**: Automatic iOS Safari private browsing detection
- **Storage Availability**: Real-time storage capability assessment with user warnings
- **Persistent Data**: Personal info, banking details, signature (cross-session)
- **Temporary Data**: Match info, indemnities (session-only)
- **Query Parameters**: Advanced URL pre-filling with single-letter aliases for Excel integration

**Storage Architecture**:

```javascript
// Multi-layer storage strategy
class DataStorage {
  constructor() {
    this.storageType = this.detectBestStorageMethod();
    this.showStorageWarnings(); // iOS Safari compatibility
  }

  detectBestStorageMethod() {
    // localStorage → sessionStorage → memory fallback
  }
}
```

**Data Categories**:

```javascript
persistentFields: [
  "firstName",
  "lastName",
  "licenseNumber",
  "address",
  "email",
  "iban",
  "bic",
  "rib",
  "signatureImage", // Cross-platform signature persistence
];

temporaryFields: [
  "matchDate",
  "matchTime",
  "matchLocation",
  "homeTeam",
  "awayTeam",
  "category",
  "position",
  "matchIndemnity",
  "travelIndemnity",
  "travelPayment",
  "madeIn",
  "madeOn",
];
```

**Query Parameter System**:

- **Full parameter names** with **single-letter aliases** (Excel URL length compatibility)
- **Example**: `matchDate=2025-08-24` or `a=2025-08-24`
- **Priority order**: Query params > localStorage > defaults
- **Excel Integration**: Short aliases enable complex URLs within Excel's limitations

**iOS Safari Compatibility**:

```javascript
isLocalStorageAvailable() {
    // Detects private browsing, quota issues
    // Returns appropriate storage method
}

showStorageWarnings() {
    // User-friendly warnings for iOS Safari limitations
}
```

### 4. PWA Management (`app.js`)

**Purpose**: Progressive Web App initialization and native installation handling

**Key Responsibilities**:

- **Service Worker Registration**: Cache management and offline functionality
- **PWA Installation**: Native browser installation handling (removed custom prompts)
- **Feature Detection**: PWA capability assessment across browsers
- **UI Initialization**: Form handlers, PDF generators, storage systems coordination

**Critical PWA Implementation**:

```javascript
// Native browser installation (Chrome, Safari, Edge)
// Removed custom beforeinstallprompt handling for better reliability
```

### 5. Service Worker (`sw.js`)

**Caching Strategy**:

- **Cache-first** for app shell (HTML, CSS, JS, images)
- **Network-first** for dynamic content with fallbacks
- **Offline-capable** PDF generation with all dependencies cached

### 6. Web App Manifest (`manifest.json`)

**PWA Configuration**:

- **Simplified manifest** for maximum compatibility
- **Installation prompts** handled by native browser UI
- **Offline capability** declarations
- **Mobile optimization** with proper icons and display modes

**Class**: `ExpenseApp`

- **Initialization Order**: Clear temp fields → Load query params → Load persistent data → Set defaults
- **Keyboard Shortcuts**: Ctrl+S (save), Ctrl+Enter (generate PDF)
- **Service Worker**: Ready for PWA implementation

## Recent Significant Changes (Major Updates)

### 1. Progressive Web App Implementation

- **Service Worker**: Complete offline functionality with intelligent caching
- **Web App Manifest**: Native mobile installation capabilities
- **Installation Optimization**: Switched to browser-native installation prompts
- **Cross-Platform PWA**: Works on iOS, Android, and desktop platforms

### 2. iOS Safari Compatibility Overhaul

- **Multi-Layer Storage**: localStorage → sessionStorage → memory fallback system
- **Private Browsing Support**: Automatic detection and alternative storage methods
- **Storage Warnings**: User-friendly alerts for storage limitations
- **Immediate Persistence**: Real-time saving for personal data fields

### 3. Advanced File Processing

- **Multi-Format Images**: JPG, PNG signature compatibility
- **Canvas API Integration**: Image processing and format conversion
- **Async Image Loading**: Non-blocking PDF generation with signature integration

### 4. User Experience Enhancements

- **Dual Message Display**: Separate "generating" and "completion" feedback
- **Responsive Header**: Device-specific logo positioning (mobile/desktop)
- **Enhanced Mobile Experience**: Optimized touch interactions and layouts
- **Storage Status Indicators**: Real-time storage capability feedback

### 5. Excel Integration & URL System

- **Query Parameter Aliases**: Single-letter shortcuts for Excel URL length limits
- **Backward Compatibility**: Full parameter names still supported
- **Excel Integration**: `Suivi NdF Arbitre.xlsx` for expense tracking
- **URL Pre-filling**: Advanced form population from external systems

## Form Fields & Data Flow

### Match Information (Temporary - Session Only)

- `matchDate`, `matchTime`, `matchLocation`
- `homeTeam`, `awayTeam`
- `category` (dropdown with FFHG divisions including new categories)
- `position` (Arbitre Principal, Juge de Ligne, Arbitre)

### Referee Information (Persistent - Cross-Session)

- `firstName`, `lastName`, `licenseNumber`
- `address` (multi-line), `email`
- Auto-saved immediately on input for user convenience

### Indemnities (Temporary - Match-Specific)

- `matchIndemnity` (always paid by club, required field)
- `travelIndemnity` (optional, triggers payment method selection)
- `travelPayment` (radio: "FFHG" default or "club")
- Smart toggle visibility based on travelIndemnity > 0

### Banking Details (Persistent - Cross-Session)

- `iban`, `bic`, `rib`

### Footer/Signature (Mixed)

- `iban`, `bic`, `rib` (secure local storage only)
- Auto-saved for user convenience, never transmitted

### Document Metadata (Auto-Generated)

- `madeIn` (auto-filled from match location, editable)
- `madeOn` (defaults to today, editable)
- `signatureImage` (multi-format support, persistent storage)

### Signature Processing (Advanced)

- **Multi-format support**: JPG, PNG with automatic conversion
- **Base64 storage**: Secure local persistence across sessions
- **PDF integration**: Async loading during PDF generation

## Privacy & Security Implementation

### Client-Side Only Architecture

- **No server communication**: 100% browser-based processing
- **No analytics**: No tracking scripts or external monitoring
- **Minimal dependencies**: Only jsPDF CDN for PDF generation
- **PWA security**: Service worker follows secure practices

### Cross-Platform Data Handling

- **Multi-layer storage**: localStorage → sessionStorage → memory
- **iOS Safari compatibility**: Automatic private browsing detection
- **Storage warnings**: User-friendly notifications for limitations
- **Data isolation**: No cross-site data sharing or transmission

### Enhanced Security Measures

- **File processing**: Local image conversion, no external services
- **Form security**: Appropriate autocomplete attributes and restrictions
- **Storage encryption**: Browser's native storage security model

## UI/UX Design Patterns

### Progressive Web App Experience

- **Native installation**: Browser-provided installation prompts
- **Offline functionality**: Full PDF generation without internet
- **App-like interface**: Responsive header with device-specific layouts
- **Cross-platform consistency**: Unified experience across devices

### Advanced Mobile Experience

- **Responsive headers**: Different layouts for mobile/desktop
- **Touch optimization**: Enhanced mobile form interactions
- **Camera integration**: Direct photo capture for signatures
- **iOS Safari specific**: Optimized for iOS Safari limitations

### Enhanced Feedback System

- **Dual message display**: Separate generating/completion feedback
- **Storage status indicators**: Real-time storage availability alerts
- **Platform-specific warnings**: iOS Safari private browsing notifications
- **Progress communication**: Clear user guidance throughout processes

### Smart Form Intelligence

- **Auto-population chain**: Location → "Fait à" → intelligent defaults
- **Conditional UI**: Travel payment options appear contextually
- **Query parameter priority**: URL params override stored values
- **Immediate persistence**: Real-time saving for important fields

## Integration Capabilities

### Advanced URL Pre-filling System

**Excel Integration**: Perfect for league management systems

- **Single-letter aliases**: Overcome Excel's 255-character URL limit
- **Backward compatibility**: Full parameter names still supported
- **Bulk generation**: Excel macros can generate multiple referee assignment links

### Example Integration URL:

```
https://site.com/?a=2025-08-24&b=20:30&c=Patinoire&d=Lions&e=Dragons&f=Division%201&g=Arbitre&h=45&i=25&j=FFHG
```

### Club Website Integration

Perfect for integration with:

- **Club websites**: Automated referee assignment links
- **League management systems**: Bulk assignment processing
- **Email automation**: Pre-filled expense report links in assignment emails
- **Mobile notifications**: Deep-linking for quick form completion

### Excel Tracking System

The included `Suivi NdF Arbitre.xlsx` enables:

- **Assignment tracking**: Monitor referee schedules and payments
- **Expense monitoring**: Track report completion and payment status
- **URL generation**: Automated link creation with proper aliases
- **Financial oversight**: League/club expense management integration

## Development Guidelines for AI Assistants

### Progressive Web App Considerations

- **Service Worker updates**: Careful cache versioning to avoid breaking changes
- **Manifest changes**: Test PWA installation across platforms
- **Offline functionality**: Ensure new features work without internet
- **iOS Safari specifics**: Test private browsing and storage limitations

### Code Style & Patterns

- **ES6+ Classes**: All functionality properly encapsulated
- **Async/Await**: Image processing and PWA features use modern async patterns
- **Error Handling**: Comprehensive try-catch with user-friendly messaging
- **Cross-platform compatibility**: Feature detection and graceful degradation

### When Making Changes

1. **Preserve PWA functionality**: Test offline capabilities after changes
2. **Maintain iOS Safari compatibility**: Verify storage fallbacks still work
3. **Update service worker**: Bump cache versions for significant changes
4. **Verify dual messaging**: Check both generating and completion feedback
5. **Update documentation**: Keep AGENTS.md current with architectural changes

### Common Modification Patterns

- **Adding PWA features**: Update manifest.json and service worker accordingly
- **Storage changes**: Test all three storage layers (localStorage → sessionStorage → memory)
- **Image processing**: Consider multi-format compatibility and conversion needs
- **Mobile optimizations**: Test responsive header and device-specific layouts
- **Cross-platform features**: Implement with progressive enhancement approach

### Testing Priorities

- **PWA installation**: Test on iOS, Android, and desktop platforms
- **Offline functionality**: Verify complete PDF generation without internet
- **iOS Safari private browsing**: Test all storage fallback mechanisms
- **Multi-device responsive**: Test header layouts and form interactions
- **Storage warnings**: Confirm user notifications for storage limitations

## Business Logic & Domain Knowledge

### FFHG Compliance & Standards

- **Official PDF format**: Specific layout requirements for legal validity
- **Payment method tracking**: Clear distinction between club and FFHG payments
- **Expense categories**: Proper classification for federation reimbursement

### Referee Mobile Workflow

- **On-site usage**: PWA installation enables app-like experience at venues
- **Offline capability**: Generate reports even with poor venue internet
- **Photo signatures**: Direct camera access for signature capture
- **Cross-device sync**: Personal data available across referee's devices

### French Hockey Technical Integration

- **League systems**: URL parameter integration with existing management tools
- **Excel workflows**: Single-letter aliases enable complex league automation
- **Multi-platform support**: iOS Safari compatibility for referee iPhones

---

## Maintenance Notes for AI Assistants

**Last Updated**: August 2025
**Next Review Due**: When major features are added or architecture changes

**Update Triggers**:

- New form fields or sections
- Changes to PDF generation logic
- New query parameters or URL features
- Storage/persistence modifications
- Major UI/UX overhauls
- Integration capabilities additions

**Version Tracking**: Use git commit messages to track changes mentioned in this file.
