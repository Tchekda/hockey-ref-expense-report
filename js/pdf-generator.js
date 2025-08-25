// PDF Generator using jsPDF
class PDFGenerator {
    constructor() {
        this.doc = null;
        this.pageWidth = 210; // A4 width in mm
        this.pageHeight = 297; // A4 height in mm
        this.margin = 15; // Reduced from 20 to 15
        this.currentY = this.margin;

        // Pre-calculate alignment positions to ensure consistency
        this.leftValueX = null;
        this.rightValueX = null;
        this.indemnityValueX = null;
    }

    // Generate PDF from form data
    async generatePDF(formData) {
        try {
            // Initialize jsPDF
            this.doc = new jspdf.jsPDF();
            this.currentY = this.margin;

            // Pre-load the logo image
            this.logoBase64 = await this.loadImageAsBase64('img/arbitre.png').catch(() => null);

            // Calculate alignment positions once for consistency
            this.calculateAlignmentPositions();

            // Add content
            this.addHeader();
            this.addMatchSection(formData);
            this.addRefereeSection(formData);
            this.addIndemnitySection(formData);
            this.addBankingSection(formData);
            this.addFooterSection(formData);

            // Generate filename
            const fileName = this.generateFileName(formData);

            // Save the PDF
            this.doc.save(fileName);

            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            return false;
        }
    }

    // Calculate consistent alignment positions
    calculateAlignmentPositions() {
        this.doc.setFontSize(10);
        this.doc.setFont(undefined, 'bold');

        // Calculate maximum label widths for left and right columns
        const maxLeftLabelWidth = Math.max(
            this.doc.getTextWidth('Nom et prénom:'),
            this.doc.getTextWidth('Équipe locale:'),
            this.doc.getTextWidth('Catégorie:'),
            this.doc.getTextWidth('Date:'),
            this.doc.getTextWidth('Indemnité de Match:')
        );

        const midPoint = this.pageWidth / 2 + 5;
        const maxRightLabelWidth = Math.max(
            this.doc.getTextWidth('Numéro de licence:'),
            this.doc.getTextWidth('Équipe visiteuse:'),
            this.doc.getTextWidth('Position:'),
            this.doc.getTextWidth('Heure:')
        );

        // Separate alignment for indemnity section with longer labels
        const maxIndemnityLabelWidth = Math.max(
            this.doc.getTextWidth('Indemnité de Match:'),
            this.doc.getTextWidth('Indemnité de Grand Déplacement:'),
            this.doc.getTextWidth('TOTAL:')
        );

        this.leftValueX = this.margin + maxLeftLabelWidth + 5;
        this.rightValueX = midPoint + maxRightLabelWidth + 5;
        this.indemnityValueX = this.margin + maxIndemnityLabelWidth + 5;
    }

    // Add header
    addHeader() {
        // Add logos on both sides
        this.addLogos();

        this.doc.setFontSize(20);
        this.doc.setFont(undefined, 'bold');
        this.doc.text('NOTE DE FRAIS - ARBITRE HOCKEY', this.pageWidth / 2, this.currentY, { align: 'center' });

        this.currentY += 15;
        this.addLine();
        this.currentY += 10;
    }

    // Add logos to PDF header
    addLogos() {
        try {
            const logoSize = 15; // Size in mm
            const logoY = this.currentY - 5; // Align with text

            // Left logo
            const leftLogoX = this.margin;

            // Right logo  
            const rightLogoX = this.pageWidth - this.margin - logoSize;

            if (this.logoBase64) {
                // Add actual logo images
                this.doc.addImage(this.logoBase64, 'PNG', leftLogoX, logoY, logoSize, logoSize);
                this.doc.addImage(this.logoBase64, 'PNG', rightLogoX, logoY, logoSize, logoSize);
            } else {
                // Fallback to placeholders
                this.addLogoPlaceholders();
            }
        } catch (error) {
            console.error('Error adding logos to PDF:', error);
            this.addLogoPlaceholders();
        }
    }

    // Add placeholder rectangles if image loading fails
    addLogoPlaceholders() {
        const logoSize = 15;
        const logoY = this.currentY - 5;

        const leftLogoX = this.margin;
        const rightLogoX = this.pageWidth - this.margin - logoSize;

        this.doc.setDrawColor(0, 102, 204);
        this.doc.setLineWidth(1);
        this.doc.rect(leftLogoX, logoY, logoSize, logoSize);
        this.doc.rect(rightLogoX, logoY, logoSize, logoSize);

        this.doc.setFontSize(8);
        this.doc.setFont(undefined, 'normal');
        this.doc.text('LOGO', leftLogoX + logoSize / 2, logoY + logoSize / 2 + 1, { align: 'center' });
        this.doc.text('LOGO', rightLogoX + logoSize / 2, logoY + logoSize / 2 + 1, { align: 'center' });
    }

    // Load image and convert to base64
    loadImageAsBase64(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                try {
                    const base64 = canvas.toDataURL('image/png');
                    resolve(base64);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = function () {
                reject(new Error('Failed to load image'));
            };

            img.src = imagePath;
        });
    }

    // Add horizontal line
    addLine() {
        this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    }

    // Add section title
    addSectionTitle(title) {
        this.doc.setFontSize(14);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(title, this.margin, this.currentY);
        this.currentY += 8;
    }

    // Add field with label and value
    addField(label, value, startY = null) {
        if (startY) this.currentY = startY;

        this.doc.setFontSize(10);
        this.doc.setFont(undefined, 'normal');

        // Check if label is too long and needs wrapping
        const maxLabelWidth = this.pageWidth - this.margin * 2 - 40; // Leave space for value
        const labelWidth = this.doc.getTextWidth(label + ':');

        if (labelWidth > maxLabelWidth * 0.6) {
            // Long label - put value on next line
            this.doc.setFont(undefined, 'bold');
            this.doc.text(label + ':', this.margin, this.currentY);
            this.currentY += 6;

            this.doc.setFont(undefined, 'normal');
            this.doc.text(value || '', this.margin + 10, this.currentY);
            this.currentY += 6;
        } else {
            // Short label - same line, aligned with two-column fields
            this.doc.setFont(undefined, 'bold');
            this.doc.text(label + ':', this.margin, this.currentY);

            this.doc.setFont(undefined, 'normal');
            this.doc.text(value || '', this.leftValueX, this.currentY);
            this.currentY += 6;
        }
    }

    // Add two fields side by side
    addTwoFields(label1, value1, label2, value2) {
        const midPoint = this.pageWidth / 2 + 5; // Shift right column a bit more to the right

        this.doc.setFontSize(10);

        // Use pre-calculated alignment positions for consistency
        // Left field
        this.doc.setFont(undefined, 'bold');
        this.doc.text(label1 + ':', this.margin, this.currentY);
        this.doc.setFont(undefined, 'normal');
        this.doc.text(value1 || '', this.leftValueX, this.currentY);

        // Right field
        this.doc.setFont(undefined, 'bold');
        this.doc.text(label2 + ':', midPoint, this.currentY);
        this.doc.setFont(undefined, 'normal');
        this.doc.text(value2 || '', this.rightValueX, this.currentY);

        this.currentY += 6;
    }    // Add match section
    addMatchSection(data) {
        this.addSectionTitle('MATCH');

        // Format date and time
        const matchDate = data.matchDate ? this.formatDate(data.matchDate) : '';
        const matchTime = data.matchTime || '';

        this.addTwoFields('Date', matchDate, 'Heure', matchTime);
        this.addField('Lieu', data.matchLocation);
        this.addTwoFields('Équipe locale', data.homeTeam, 'Équipe visiteuse', data.awayTeam);
        this.addTwoFields('Catégorie', data.category, 'Position', data.position);

        this.currentY += 5;
    }

    // Add referee section
    addRefereeSection(data) {
        this.addSectionTitle('ARBITRE');

        const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();

        // Use two columns for name and license
        this.addTwoFields('Nom et prénom', fullName, 'Numéro de licence', data.licenseNumber);

        // Handle multi-line address - full width
        if (data.address) {
            this.doc.setFontSize(10);
            this.doc.setFont(undefined, 'bold');
            this.doc.text('Adresse:', this.margin, this.currentY);

            this.doc.setFont(undefined, 'normal');
            const addressLines = data.address.split('\n');
            addressLines.forEach((line, index) => {
                this.doc.text(line, this.leftValueX, this.currentY + (index * 5));
            });
            this.currentY += (addressLines.length * 5) + 1;
        }

        this.addField('Email', data.email);
        this.currentY += 5;
    }

    // Add indemnity section
    addIndemnitySection(data) {
        this.addSectionTitle('INDEMNITÉ');

        const matchIndemnity = data.matchIndemnity ? `${data.matchIndemnity} €` : '';
        const travelIndemnity = data.travelIndemnity ? `${data.travelIndemnity} €` : '';

        // Use separate lines for indemnities with special alignment
        this.doc.setFontSize(10);
        this.doc.setFont(undefined, 'bold');
        this.doc.text('Indemnité de Match:', this.margin, this.currentY);
        this.doc.setFont(undefined, 'normal');
        this.doc.text(matchIndemnity, this.indemnityValueX, this.currentY);
        this.currentY += 6;

        this.doc.setFontSize(8);
        this.doc.setFont(undefined, 'italic');
        this.doc.text('(payée par le club)', this.indemnityValueX, this.currentY);
        this.currentY += 8;

        if (data.travelIndemnity && parseFloat(data.travelIndemnity) > 0) {
            this.doc.setFontSize(10);
            this.doc.setFont(undefined, 'bold');
            this.doc.text('Indemnité de Grand Déplacement:', this.margin, this.currentY);
            this.doc.setFont(undefined, 'normal');
            this.doc.text(travelIndemnity, this.indemnityValueX, this.currentY);
            this.currentY += 6;

            // Use the payment method from form data, default to FFHG
            const paymentMethod = data.travelPayment === 'Club' ? 'payée par le club' : 'payée par la FFHG';
            this.doc.setFontSize(8);
            this.doc.setFont(undefined, 'italic');
            this.doc.text(`(${paymentMethod})`, this.indemnityValueX, this.currentY);
            this.currentY += 8;
        }

        // Calculate total if match indemnity exists
        if (data.matchIndemnity) {
            const matchAmount = parseFloat(data.matchIndemnity) || 0;
            const travelAmount = parseFloat(data.travelIndemnity) || 0;
            const total = Math.round(matchAmount + travelAmount);
            this.doc.setFontSize(12);
            this.doc.setFont(undefined, 'bold');
            this.doc.text('TOTAL:', this.margin, this.currentY);
            this.doc.text(`${total} €`, this.indemnityValueX, this.currentY);
            this.currentY += 6;
        }

        this.currentY += 5;
    }

    // Add banking section
    addBankingSection(data) {
        this.addSectionTitle('RELEVÉ BANCAIRE');

        this.addField('IBAN', data.iban);
        this.addField('BIC', data.bic);
        this.addField('RIB', data.rib);

        this.currentY += 5;
    }

    // Add footer section
    addFooterSection(data) {
        this.addSectionTitle('SIGNATURE');

        const madeOnFormatted = data.madeOn ? this.formatDate(data.madeOn) : '';

        this.addTwoFields('Fait à', data.madeIn, 'Le', madeOnFormatted);

        // Handle signature image or text
        if (data.signature && data.signature.startsWith('data:image')) {
            // Add signature image
            this.doc.setFontSize(10);
            this.doc.setFont(undefined, 'bold');
            this.doc.text('Signature:', this.margin, this.currentY);
            this.currentY += 10;

            try {
                // Add signature image
                this.doc.addImage(data.signature, 'JPEG', this.margin + 10, this.currentY, 60, 20);
                this.currentY += 25;
            } catch (error) {
                console.error('Error adding signature image:', error);
                this.doc.setFont(undefined, 'normal');
                this.doc.text('(Signature non disponible)', this.margin + 10, this.currentY);
                this.currentY += 10;
            }
        } else {
            // Add signature space for manual signing
            this.doc.setFontSize(10);
            this.doc.setFont(undefined, 'bold');
            this.doc.text('Signature:', this.margin, this.currentY);
            this.currentY += 20;

            // Add signature line
            this.doc.line(this.margin + 10, this.currentY, this.margin + 120, this.currentY);
            this.currentY += 5;
            this.doc.setFontSize(8);
            this.doc.text('(Signature manuscrite)', this.margin + 10, this.currentY);
        }
    }

    // Format date to French format
    formatDate(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Generate filename for PDF
    generateFileName(data) {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const lastName = data.lastName ? data.lastName.replace(/[^a-zA-Z0-9]/g, '') : 'Arbitre';

        return `NoteDeFrais_${dateStr}_${lastName}.pdf`;
    }
}
