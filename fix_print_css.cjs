const fs = require('fs');

let content = fs.readFileSync('src/index.css', 'utf-8');

if (!content.includes('@media print {')) {
  content += `
@media print {
  body * {
    visibility: hidden;
  }
  .print\\:block, .print\\:block * {
    visibility: visible;
  }
  .print\\:block {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .break-after-page {
    page-break-after: always;
  }
  
  /* Reset background colors for print */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
`;
  fs.writeFileSync('src/index.css', content);
}
