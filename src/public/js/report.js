function exportStyledTableToPDF() {
  const tableElement = document.getElementById("tableContainer");

  const options = {
    margin: 0.5, // margin in inches
    filename: "styled_table.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 }, // Higher scale for better quality
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf().from(tableElement).set(options).save();
}
