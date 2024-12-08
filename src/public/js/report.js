document
  .getElementById('downloadPdfButton')
  .addEventListener('click', function downloadSectionPDF() {
    const element = document.getElementById('reportContainer');

    const opt = {
      margin: 1,
      filename: 'report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  });
