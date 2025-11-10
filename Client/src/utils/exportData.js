export const exportToCSV = (data, filename = 'export.csv', columns = null) => {
    if (!data || data.length === 0) {
        alert('Nu există date de exportat');
        return;
    }

    const cols = columns || Object.keys(data[0]);
    
    let csvContent = cols.map(col => `"${col}"`).join(',') + '\n';
    
    data.forEach(row => {
        const values = cols.map(col => {
            const value = row[col] || '';
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return `"${value}"`;
        });
        csvContent += values.join(',') + '\n';
    });

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
};

export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Sheet1') => {
    if (!data || data.length === 0) {
        alert('Nu există date de exportat');
        return;
    }

    const headers = Object.keys(data[0]);
    
    let tableHTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <style>
                table { border-collapse: collapse; width: 100%; }
                th { background-color: #3b82f6; color: white; font-weight: bold; padding: 12px; border: 1px solid #ddd; }
                td { padding: 8px; border: 1px solid #ddd; text-align: left; }
                tr:nth-child(even) { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <table>
                <thead>
                    <tr>
                        ${headers.map(h => `<th>${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    downloadBlob(blob, filename);
};

export const exportToPDF = (data, filename = 'export.pdf', title = 'Raport', options = {}) => {
    if (!data || data.length === 0) {
        alert('Nu există date de exportat');
        return;
    }

    const {
        orientation = 'portrait',
        columns = null,
        includeDate = true,
        includeStats = false
    } = options;

    const cols = columns || Object.keys(data[0]);
    
    const printWindow = window.open('', '_blank');
    
    let statsHTML = '';
    if (includeStats) {
        const totalRecords = data.length;
        statsHTML = `
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 8px 0; color: #374151;">Statistici</h3>
                <p style="margin: 4px 0; color: #6b7280;">Total înregistrări: <strong>${totalRecords}</strong></p>
            </div>
        `;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                @media print {
                    @page {
                        size: ${orientation === 'landscape' ? 'landscape' : 'portrait'};
                        margin: 1cm;
                    }
                    body { margin: 0; }
                    .no-print { display: none; }
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    max-width: 100%;
                    margin: 0 auto;
                    background: white;
                    color: #1f2937;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #3b82f6;
                    padding-bottom: 20px;
                }
                h1 {
                    color: #1f2937;
                    margin: 0 0 8px 0;
                    font-size: 28px;
                }
                .date {
                    color: #6b7280;
                    font-size: 14px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                th {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    padding: 14px 12px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 13px;
                    border: 1px solid #2563eb;
                }
                td {
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    font-size: 13px;
                    color: #374151;
                }
                tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                tr:hover {
                    background-color: #eff6ff;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    color: #9ca3af;
                    font-size: 12px;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 20px;
                }
                .print-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 24px;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                    transition: all 0.3s;
                }
                .print-btn:hover {
                    background: #2563eb;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
                }
            </style>
        </head>
        <body>
            <button class="print-btn no-print" onclick="window.print()">🖨️ Printează PDF</button>
            
            <div class="header">
                <h1>${title}</h1>
                ${includeDate ? `<p class="date">Data export: ${new Date().toLocaleDateString('ro-RO', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</p>` : ''}
            </div>

            ${statsHTML}

            <table>
                <thead>
                    <tr>
                        ${cols.map(col => `<th>${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            ${cols.map(col => `<td>${row[col] || '-'}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="footer">
                <p>Generat de Hotel Management System | © ${new Date().getFullYear()}</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
};

export const exportWithCharts = (data, chartData, filename = 'raport-complet.pdf', title = 'Raport Complet') => {
    if (!data || data.length === 0) {
        alert('Nu există date de exportat');
        return;
    }

    const printWindow = window.open('', '_blank');
    
    let chartsHTML = '';
    if (chartData && chartData.length > 0) {
        chartsHTML = `
            <div style="page-break-after: always;">
                <h2 style="color: #1f2937; margin-bottom: 20px;">📊 Grafice și Statistici</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    ${chartData.map(chart => `
                        <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
                            <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 16px;">${chart.title}</h3>
                            <div style="font-size: 32px; font-weight: bold; color: #3b82f6; text-align: center;">
                                ${chart.value}
                            </div>
                            ${chart.subtitle ? `<p style="text-align: center; color: #6b7280; margin: 8px 0 0 0; font-size: 13px;">${chart.subtitle}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    const headers = Object.keys(data[0]);

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                @media print {
                    @page { size: landscape; margin: 1cm; }
                    body { margin: 0; }
                    .no-print { display: none; }
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 30px;
                    background: white;
                    color: #1f2937;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    border-bottom: 4px solid #3b82f6;
                    padding-bottom: 20px;
                }
                h1 {
                    margin: 0;
                    font-size: 36px;
                    color: #1f2937;
                    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                h2 { color: #1f2937; font-size: 24px; }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 30px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                th {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    padding: 16px 12px;
                    text-align: left;
                    font-weight: 600;
                    border: 1px solid #2563eb;
                }
                td {
                    padding: 14px 12px;
                    border: 1px solid #e5e7eb;
                    color: #374151;
                }
                tr:nth-child(even) { background-color: #f9fafb; }
                tr:hover { background-color: #eff6ff; }
                .print-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 14px 28px;
                    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 600;
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
                }
                .print-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6);
                }
            </style>
        </head>
        <body>
            <button class="print-btn no-print" onclick="window.print()">🖨️ Printează Raport</button>
            
            <div class="header">
                <h1>${title}</h1>
                <p style="color: #6b7280; margin: 12px 0 0 0; font-size: 15px;">
                    Generat la ${new Date().toLocaleDateString('ro-RO', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>

            ${chartsHTML}

            <div>
                <h2>📋 Date Detaliate</h2>
                <table>
                    <thead>
                        <tr>
                            ${headers.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                ${headers.map(h => `<td>${row[h] || '-'}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 60px; text-align: center; color: #9ca3af; font-size: 13px; border-top: 2px solid #e5e7eb; padding-top: 30px;">
                <p style="margin: 0;">Hotel Management System | © ${new Date().getFullYear()}</p>
                <p style="margin: 8px 0 0 0;">Raport confidențial - Doar pentru uz intern</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
};

const downloadBlob = (blob, filename) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
};

export const exportMultipleSheets = (sheets, filename = 'raport-multiplu.xlsx') => {
    if (!sheets || sheets.length === 0) {
        alert('Nu există date de exportat');
        return;
    }

    let workbookHTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
    `;

    sheets.forEach((sheet, index) => {
        workbookHTML += `
            <x:ExcelWorksheet>
                <x:Name>${sheet.name || `Sheet${index + 1}`}</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
        `;
    });

    workbookHTML += `
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <style>
                table { border-collapse: collapse; width: 100%; }
                th { background-color: #3b82f6; color: white; font-weight: bold; padding: 12px; border: 1px solid #ddd; }
                td { padding: 8px; border: 1px solid #ddd; }
            </style>
        </head>
        <body>
    `;

    sheets.forEach((sheet) => {
        const headers = Object.keys(sheet.data[0] || {});
        workbookHTML += `
            <table>
                <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${sheet.data.map(row => `
                        <tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>
                    `).join('')}
                </tbody>
            </table>
            <br><br>
        `;
    });

    workbookHTML += '</body></html>';

    const blob = new Blob([workbookHTML], { type: 'application/vnd.ms-excel' });
    downloadBlob(blob, filename);
};