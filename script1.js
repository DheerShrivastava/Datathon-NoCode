class InvoiceManager {
    constructor() {
        this.entries = [];
        this.currentId = 1;
        this.setupEventListeners();
        this.addNewEntry(); // Add first entry automatically
    }

    setupEventListeners() {
        // Add new entry button
        document.getElementById('addEntry').addEventListener('click', () => this.addNewEntry());
        
        // Export to Excel button
        document.getElementById('exportExcel').addEventListener('click', () => this.exportToExcel());
    }

    generateDocId() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `INV-${timestamp}-${random}`;
    }

    addNewEntry() {
        const template = document.getElementById('entryTemplate');
        const clone = template.content.cloneNode(true);
        const entryCard = clone.querySelector('.entry-card');
        
        // Set unique doc ID
        const docId = this.generateDocId();
        entryCard.querySelector('.docId').textContent = docId;

        // Set current date as default
        const today = new Date().toISOString().split('T')[0];
        entryCard.querySelector('.date').value = today;
        entryCard.querySelector('.dueDate').value = today;

        // Add remove button functionality
        entryCard.querySelector('.remove-entry').addEventListener('click', () => {
            if (document.querySelectorAll('.entry-card').length > 1) {
                entryCard.remove();
            } else {
                alert('You must keep at least one entry.');
            }
        });

        // Add validation listeners
        this.addValidationListeners(entryCard);

        document.getElementById('entriesList').appendChild(entryCard);
    }

    addValidationListeners(entryCard) {
        const inputs = entryCard.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim() === '') {
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });
        });
    }

    validateEntries() {
        let isValid = true;
        const requiredInputs = document.querySelectorAll('input[required], select[required]');
        
        requiredInputs.forEach(input => {
            if (input.value.trim() === '') {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    collectFormData() {
        const entries = [];
        document.querySelectorAll('.entry-card').forEach(card => {
            const entry = {
                'Doc ID': card.querySelector('.docId').textContent,
                'Supplier Name': card.querySelector('.supplierName').value,
                'Category': card.querySelector('.category').value,
                'Invoice Number': card.querySelector('.invoiceNumber').value,
                'Date': card.querySelector('.date').value,
                'Due Date': card.querySelector('.dueDate').value,
                'Description': card.querySelector('.description').value,
                'Amount': card.querySelector('.amount').value,
                'Currency': card.querySelector('.currency').value
            };
            entries.push(entry);
        });
        return entries;
    }

    exportToExcel() {
        if (!this.validateEntries()) {
            alert('Please fill in all required fields before exporting.');
            return;
        }

        const entries = this.collectFormData();
        if (entries.length === 0) {
            alert('Please add at least one entry before exporting.');
            return;
        }

        try {
            // Create worksheet
            const ws = XLSX.utils.json_to_sheet(entries);

            // Auto-size columns
            const range = XLSX.utils.decode_range(ws['!ref']);
            const cols = range.e.c + 1;
            ws['!cols'] = [];
            for (let i = 0; i < cols; i++) {
                ws['!cols'][i] = { wch: 15 }; // Set column width
            }

            // Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Invoices');

            // Generate Excel file with timestamp
            const timestamp = new Date().toISOString().split('T')[0];
            XLSX.writeFile(wb, `invoice_entries_${timestamp}.xlsx`);

            // Show success message
            alert('Excel file has been downloaded successfully!');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('An error occurred while exporting to Excel. Please try again.');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InvoiceManager();
});
