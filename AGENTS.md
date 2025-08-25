# AGENTS.md - AI Code Assistant Documentation

> ⚠️ **Important**: This file must be kept updated when significant changes are made to the codebase, architecture, or functionality.

## Project Overview

**Hockey Referee Expense Report Generator** - A client-side web application for French ice hockey referees to create professional PDF expense reports. Built with vanilla HTML/CSS/JavaScript with a focus on privacy, offline functionality, and ease of use.

### Core Purpose

- Generate official expense report PDFs for FFHG (Fédération Française de Hockey sur Glace) compliance
- 100% client-side processing - no server communication
- Data persistence using localStorage only
- Mobile-responsive design for on-the-go usage

## Architecture & Technology Stack

### Frontend Technologies

- **HTML5**: Semantic form structure with proper accessibility
- **CSS3**: Mobile-first responsive design with flexbox
- **Vanilla JavaScript**: ES6+ classes, no frameworks
- **jsPDF v2.5.1**: Client-side PDF generation library (CDN)

### Key Design Principles

1. **Privacy First**: All data stays in browser, no server communication
2. **Offline Capable**: Works completely offline after initial load
3. **Mobile Optimized**: Camera capture for signatures, touch-friendly UI
4. **Data Persistence**: Smart separation of persistent vs. temporary data

## Project Structure

```
├── index.html              # Main form interface
├── css/
│   └── styles.css          # Responsive styling, mobile-first approach
├── js/
│   ├── app.js              # Application initialization and coordination
│   ├── form-handler.js     # Form validation and user interactions
│   ├── pdf-generator.js    # PDF creation with jsPDF
│   └── storage.js          # LocalStorage management and query params
├── img/
│   └── arbitre.png         # Application icon/logo
├── README.md              # User documentation
├── AGENTS.md              # This file - AI assistant documentation
├── LICENCE.md             # MIT license
└── Suivi NdF Arbitre.xlsx # Excel tracking file for report management
```

## Core Functionality

### 1. Form Management (`form-handler.js`)

**Class**: `FormHandler`

- **Validation**: Real-time form validation with visual feedback
- **File Upload**: Signature image handling with base64 conversion
- **Event Handling**: Input formatting (IBAN), auto-population logic
- **User Experience**: Loading states, success/error messages

**Key Methods**:

- `collectFormData()`: Gathers all form data including radio buttons
- `validateForm()`: Validates required fields with visual feedback
- `handleSignatureUpload()`: Processes signature images with size/type validation
- `toggleTravelPaymentOptions()`: Shows/hides payment method selection
- `updateDefaultLocation()`: Auto-fills "Fait à" from match location

### 2. PDF Generation (`pdf-generator.js`)

**Class**: `PDFGenerator`

- **Layout**: A4 format with optimized margins (15mm)
- **Typography**: Consistent font sizing and alignment system
- **Sections**: Header, Match, Referee, Indemnity, Banking, Footer/Signature
- **Alignment**: Pre-calculated positioning system for consistent value alignment

**Key Features**:

- `calculateAlignmentPositions()`: Ensures consistent column alignment across sections
- Smart indemnity section with separate alignment for long labels
- Signature handling: Image embedding or manual signature space
- French date formatting and currency display
- Automatic filename generation: `NoteDeFrais_YYYY-MM-DD_LastName.pdf`

**Critical Implementation Detail**:
The PDF uses separate alignment calculations for different sections to handle varying label lengths, particularly in the indemnity section where "Indemnité de Grand Déplacement" requires special handling.

### 3. Data Storage (`storage.js`)

**Class**: `DataStorage`

- **Persistent Data**: Personal info, banking details, signature (stays between sessions)
- **Temporary Data**: Match info, indemnities (cleared on page refresh)
- **Query Parameters**: URL-based form pre-filling with aliases for short URLs

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
  "madeIn",
  "madeOn",
];
```

**Query Parameter System**:

- Full parameter names and single-letter aliases (for Excel URL length limits)
- Example: `matchDate=2025-08-24` or `a=2025-08-24`
- Priority: Query params > localStorage > defaults

### 4. Application Initialization (`app.js`)

**Class**: `ExpenseApp`

- **Initialization Order**: Clear temp fields → Load query params → Load persistent data → Set defaults
- **Keyboard Shortcuts**: Ctrl+S (save), Ctrl+Enter (generate PDF)
- **Service Worker**: Ready for PWA implementation

## Recent Significant Changes (Last 3 Commits)

### 1. Excel Integration (e1b883f)

- Added `Suivi NdF Arbitre.xlsx` for expense report tracking
- Excel file likely contains macros/formulas for referee expense management
- Added to .gitignore to prevent accidental commits of personal data

### 2. URL Alias System (78727da)

- Implemented single-letter aliases for query parameters
- Solves Excel's 255-character URL limit for hyperlinks
- Maintains backward compatibility with full parameter names

### 3. Smart Auto-loading (dbf84bb)

- Fixed club auto-loading from query parameters
- Improved travel payment radio button handling
- Enhanced query parameter processing reliability

## Form Fields & Data Flow

### Match Information (Temporary)

- `matchDate`, `matchTime`, `matchLocation`
- `homeTeam`, `awayTeam`
- `category` (dropdown with FFHG divisions)
- `position` (Arbitre Principal, Juge de Ligne, Arbitre)

### Referee Information (Persistent)

- `firstName`, `lastName`, `licenseNumber`
- `address` (multi-line), `email`

### Indemnities (Temporary)

- `matchIndemnity` (always paid by club)
- `travelIndemnity` (optional, with payment method toggle)
- `travelPayment` (radio: "FFHG" or "club")

### Banking Details (Persistent)

- `iban`, `bic`, `rib`

### Footer/Signature (Mixed)

- `madeIn` (auto-filled from match location)
- `madeOn` (defaults to today)
- `signature` (image file, persistent)

## Privacy & Security Implementation

### Client-Side Only Processing

- No server endpoints or API calls
- No analytics or tracking scripts
- No external dependencies except jsPDF CDN

### Data Handling

- **localStorage**: Used only for persistent referee/banking data
- **sessionStorage**: Not used (to ensure data clearing on browser restart)
- **Cookies**: Not used
- **File Uploads**: Processed locally, converted to base64, stored in localStorage

### Form Security

- `autocomplete="off"` on temporary fields to prevent browser caching
- Proper `autocomplete` attributes on persistent fields for UX
- File input restricted to images only

## UI/UX Design Patterns

### Mobile-First Responsive Design

- Breakpoints optimized for mobile referee usage
- Touch-friendly form controls
- Camera capture integration for signatures
- Optimized keyboard layouts for numeric inputs

### Visual Feedback System

- Real-time form validation with color coding
- Loading states during PDF generation
- Success/error messages with auto-dismiss
- Progress indicators for multi-step processes

### Smart Form Behavior

- Auto-population of related fields (location → "Fait à")
- Conditional field display (travel indemnity → payment options)
- Persistent data pre-filling on page load
- Query parameter prioritization

## Integration Capabilities

### URL Pre-filling System

Perfect for integration with:

- Club websites generating referee assignment links
- League management systems
- Automated email systems

### Example Integration URL:

```
https://site.com/?a=2025-08-24&b=20:30&c=Patinoire&d=Lions&e=Dragons&f=Division%201&g=Arbitre&h=45&i=25&j=FFHG
```

### Excel Integration

The included Excel file suggests capability for:

- Referee assignment tracking
- Expense report status monitoring
- Bulk URL generation for multiple matches

## Development Guidelines for AI Assistants

### Code Style & Patterns

- **ES6+ Classes**: All major functionality wrapped in classes
- **Event-Driven**: Heavy use of addEventListener for user interactions
- **Error Handling**: Try-catch blocks with user-friendly error messages
- **Modular Design**: Clear separation of concerns between classes

### When Making Changes

1. **Always preserve privacy**: No server communication should ever be added
2. **Maintain data flow**: Respect persistent vs. temporary data classification
3. **Test mobile**: Verify changes work on mobile devices
4. **Update AGENTS.md**: Document significant architectural changes here
5. **Validate PDF output**: Ensure PDF generation still works after changes

### Common Modification Patterns

- **Adding form fields**: Update relevant arrays in `storage.js`
- **PDF layout changes**: Modify alignment calculations in `pdf-generator.js`
- **New query parameters**: Add to `queryFields` object in `storage.js`
- **UI changes**: Mobile-first approach in `styles.css`

### Testing Considerations

- **Browser compatibility**: Test on Chrome, Firefox, Safari, Edge
- **Mobile testing**: iOS Safari, Chrome Mobile
- **Offline functionality**: Verify works without internet
- **Data persistence**: Test localStorage behavior across sessions
- **PDF generation**: Verify output quality and formatting

## Business Logic & Domain Knowledge

### FFHG Compliance Requirements

- Specific sections required in expense reports
- Payment method distinction (club vs. FFHG)
- Official formatting and calculation rules
- Signature requirements for legal validity

### Referee Workflow Understanding

- Referees often travel between venues
- Mobile usage common (filling out reports on-site)
- Personal/banking data rarely changes
- Match data unique per assignment
- Time-sensitive report submission requirements

### French Hockey Ecosystem

- Division structure (Magnus, D1, D2, D3, Youth categories)
- Position types (Arbitre Principal, Juge de Ligne)
- Regional travel patterns affecting indemnities
- Club vs. Federation payment responsibilities

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
