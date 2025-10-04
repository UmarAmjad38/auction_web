// #1
// export const generateInvoiceHtml = (invoice: any) => {
//     return `
//     <html>
//     <head>
//         <title>Invoice - ${invoice.invoiceId}</title>
//         <style>
//             body {
//                 font-family: 'Arial', sans-serif;
//                 background: #f4f4f4;
//                 padding: 40px;
//                 text-align: center;
//             }
//             .invoice-container {
//                 max-width: 800px;
//                 margin: auto;
//                 background: #fff;
//                 padding: 20px;
//                 border-radius: 10px;
//                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//             }
//             .invoice-header {
//                 background: #19549F;
//                 color: white;
//                 padding: 20px;
//                 border-radius: 10px 10px 0 0;
//                 text-align: center;
//             }
//             .invoice-header h1 {
//                 margin: 0;
//                 font-size: 24px;
//             }
//             .invoice-content {
//                 padding: 20px;
//                 text-align: left;
//             }
//             .invoice-details {
//                 margin-bottom: 20px;
//                 padding: 10px;
//                 background: #e3f2fd;
//                 border-radius: 5px;
//             }
//             table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-top: 20px;
//             }
//             th, td {
//                 padding: 12px;
//                 text-align: left;
//                 border-bottom: 1px solid #ddd;
//             }
//             th {
//                 background: #1976D2;
//                 color: white;
//             }
//             .total {
//                 font-size: 20px;
//                 font-weight: bold;
//                 color: #D32F2F;
//                 text-align: right;
//                 margin-top: 10px;
//             }
//             .footer {
//                 text-align: center;
//                 margin-top: 20px;
//                 padding: 10px;
//                 background: #1976D2;
//                 color: white;
//                 border-radius: 0 0 10px 10px;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="invoice-container">
//             <div class="invoice-header">
//                 <h1>Invoice #${invoice.invoiceId}</h1>
//             </div>
//             <div class="invoice-content">
//                 <div class="invoice-details">
//                     <p><strong>Order No:</strong> ${invoice.orderNo}</p>
//                     <p><strong>Lot No:</strong> ${invoice.lotNo}</p>
//                     <p><strong>Location:</strong> ${invoice.location}</p>
//                     <p><strong>Description:</strong> ${invoice.shortDescription}</p>
//                     <p><strong>Bid Amount:</strong> $${invoice.bidAmount}</p>
//                     <p><strong>Bid Date:</strong> ${invoice.bidCreatedAt}</p>
//                     <p><strong>Payment Due:</strong> ${invoice.paymentDueDate}</p>
//                 </div>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Item</th>
//                             <th>Amount</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>${invoice.shortDescription}</td>
//                             <td>$${invoice.bidAmount}</td>
//                         </tr>
//                     </tbody>
//                 </table>
//                 <p class="total">Total: $${invoice.bidAmount}</p>
//             </div>
//             <div class="footer">
//                 <p>Thank you for your business!</p>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;
// };

// #2

// export const generateInvoiceHtml = (invoice: any) => {
//     return `
//     <html>
//     <head>
//         <title>Invoice - ${invoice.invoiceId}</title>
//         <style>
//             body {
//                 font-family: 'Roboto', sans-serif;
//                 background: #f3f4f6;
//                 padding: 40px;
//                 text-align: center;
//                 color: #333;
//                 margin: 0;
//             }
//             .invoice-container {
//                 max-width: 1000px;
//                 margin: auto;
//                 background: #fff;
//                 padding: 40px;
//                 border-radius: 15px;
//                 box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
//             }
//             .invoice-header {
//                 background: linear-gradient(135deg, #FF7043, #FF9800);
//                 color: white;
//                 padding: 30px;
//                 border-radius: 15px 15px 0 0;
//                 text-align: center;
//                 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//             }
//             .invoice-header h1 {
//                 margin: 0;
//                 font-size: 36px;
//                 font-weight: 700;
//             }
//             .invoice-details {
//                 margin-top: 40px;
//                 text-align: left;
//                 padding: 25px;
//                 background-color: #FFF3E0;
//                 border-radius: 10px;
//                 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//                 font-size: 18px;
//                 color: #333;
//             }
//             .invoice-details p {
//                 font-size: 20px;
//                 line-height: 1.8;
//                 margin: 15px 0;
//                 color: #555;
//             }
//             .invoice-items {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-top: 25px;
//             }
//             .invoice-items th, .invoice-items td {
//                 padding: 18px;
//                 text-align: left;
//                 border-bottom: 2px solid #ddd;
//                 font-size: 20px;
//             }
//             .invoice-items th {
//                 background-color: #FF7043;
//                 color: white;
//                 font-weight: bold;
//             }
//             .invoice-items td {
//                 background-color: #FBE9E7;
//             }
//             .total-amount {
//                 font-size: 26px;
//                 font-weight: 800;
//                 color: #D32F2F;
//                 text-align: right;
//                 padding-top: 30px;
//                 border-top: 2px solid #FF7043;
//                 margin-top: 20px;
//             }
//             .footer {
//                 text-align: center;
//                 margin-top: 40px;
//                 padding: 20px;
//                 background-color: #FF7043;
//                 color: white;
//                 border-radius: 0 0 15px 15px;
//                 font-size: 18px;
//             }
//             .footer p {
//                 margin: 0;
//                 font-size: 20px;
//                 line-height: 1.5;
//             }
//             .thank-you {
//                 font-size: 22px;
//                 font-weight: 700;
//                 color: #FFEB3B;
//                 margin-top: 10px;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="invoice-container">
//             <div class="invoice-header">
//                 <h1>Invoice #${invoice.invoiceId}</h1>
//             </div>
//             <div class="invoice-details">
//                 <p><strong>Order No:</strong> ${invoice.orderNo}</p>
//                 <p><strong>Lot No:</strong> ${invoice.lotNo}</p>
//                 <p><strong>Location:</strong> ${invoice.location}</p>
//                 <p><strong>Description:</strong> ${invoice.shortDescription}</p>
//                 <p><strong>Bid Amount:</strong> $${invoice.bidAmount}</p>
//                 <p><strong>Bid Date:</strong> ${invoice.bidCreatedAt}</p>
//                 <p><strong>Payment Due:</strong> ${invoice.paymentDueDate}</p>
//             </div>
//             <table class="invoice-items">
//                 <thead>
//                     <tr>
//                         <th>Item</th>
//                         <th>Amount</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>${invoice.shortDescription}</td>
//                         <td>$${invoice.bidAmount}</td>
//                     </tr>
//                 </tbody>
//             </table>
//             <div class="total-amount">
//                 Total: $${invoice.bidAmount}
//             </div>
//             <div class="footer">
//                 <p class="thank-you">Thank you for your business!</p>
//                 <p>We look forward to working with you again.</p>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;
// };


export const generateInvoiceHtml = (invoice: any) => {
    return `
    <html>
    <head>
        <title>Invoice - ${invoice.invoiceId}</title>
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                background: #f4f4f4;
                padding: 40px;
                text-align: center;
                color: #333;
            }
            .invoice-container {
                max-width: 900px;
                margin: auto;
                background: #fff;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            }
            .invoice-header {
                background: linear-gradient(135deg, #6A1B9A, #D32F2F);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                text-align: center;
            }
            .invoice-header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 500;
            }
            .invoice-details {
                margin-top: 20px;
                text-align: left;
                padding: 20px;
                background-color: #EDE7F6;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .invoice-details p {
                font-size: 16px;
                line-height: 1.6;
                margin: 8px 0;
            }
            .invoice-items {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .invoice-items th, .invoice-items td {
                padding: 12px;
                text-align: left;
                border-bottom: 2px solid #ddd;
                font-size: 16px;
            }
            .invoice-items th {
                background-color: #1976D2;
                color: white;
            }
            .total-amount {
                font-size: 18px;
                font-weight: 700;
                color: #D32F2F;
                text-align: right;
                padding-top: 20px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding: 15px;
                background-color: #1976D2;
                color: white;
                border-radius: 0 0 10px 10px;
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="invoice-header">
                <h1>Invoice #${invoice.invoiceId}</h1>
            </div>
            <div class="invoice-details">
                <p><strong>Order No:</strong> ${invoice.orderNo}</p>
                <p><strong>Lot No:</strong> ${invoice.lotNo}</p>
                <p><strong>Location:</strong> ${invoice.location}</p>
                <p><strong>Description:</strong> ${invoice.shortDescription}</p>
                <p><strong>Bid Amount:</strong> $${invoice.bidAmount}</p>
                <p><strong>Bid Date:</strong> ${invoice.bidCreatedAt}</p>
                <p><strong>Payment Due:</strong> ${invoice.paymentDueDate}</p>
            </div>
            <table class="invoice-items">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${invoice.shortDescription}</td>
                        <td>$${invoice.bidAmount}</td>
                    </tr>
                </tbody>
            </table>
            <div class="total-amount">
                Total: $${invoice.bidAmount}
            </div>
            <div class="footer">
                <p>Thank you for your business! <br/>We look forward to serving you again.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

