function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // ตั้งค่าฟอนต์ และสี
  doc.setFont('Helvetica');
  doc.setTextColor(0, 0, 0); // สีข้อความเป็นสีดำ
  doc.setFontSize(16);

  // เพิ่มหัวเรื่อง
  doc.text('ข้อมูลการยืมอุปกรณ์', 14, 20); // (ข้อความ, x, y)

  // เพิ่มข้อมูลในตาราง
  const table = document.getElementById('borrowTable');
  const rows = table.rows;
  let rowData = [];

  for (let i = 1; i < rows.length; i++) {  // เริ่มจาก 1 เพราะแถวแรกเป็นหัวตาราง
    const cells = rows[i].cells;
    rowData.push([
      cells[0].innerText,
      cells[1].innerText,
      cells[2].innerText
    ]);
  }

  // เพิ่มตารางใน PDF
  doc.autoTable({
    head: [['รายการที่', 'รายการยืม', 'จำนวน']],
    body: rowData,
    startY: 30, // เริ่มจากจุดนี้บน PDF
    theme: 'grid', // เลือกสไตล์ของตาราง
    headStyles: {
      fillColor: [63, 81, 181],  // สีพื้นหลังหัวตาราง
      textColor: [255, 255, 255], // สีตัวอักษรหัวตาราง
      fontSize: 12,  // ขนาดฟอนต์หัวตาราง
      fontStyle: 'bold', // ฟอนต์หนา
    },
    bodyStyles: {
      fontSize: 10,  // ขนาดฟอนต์ของเนื้อหาตาราง
      lineColor: [44, 62, 80], // สีเส้นขอบของตาราง
      lineWidth: 0.75,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240] // สีพื้นหลังของแถวที่สอง
    }
  });

  // บันทึก PDF
  doc.save('borrow-data.pdf');
}

// เชื่อมโยงฟังก์ชันกับปุ่ม
document.getElementById('downloadPDF').addEventListener('click', downloadPDF);
