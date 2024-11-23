document.addEventListener('DOMContentLoaded', function() {
  // กำหนดวันที่ให้เป็นวันปัจจุบัน
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('borrowDate').value = today;
});

// คำนวณระยะเวลาการยืม
document.getElementById('returnDate').addEventListener('change', calculateDuration);
document.getElementById('borrowDate').addEventListener('change', calculateDuration);

function calculateDuration() {
  const borrowDate = new Date(document.getElementById('borrowDate').value);
  const returnDate = new Date(document.getElementById('returnDate').value);

  if (borrowDate && returnDate) {
    // ถ้าวันที่ยืมและคืนเป็นวันเดียวกัน ให้ระยะเวลาการยืมเป็น 1 วัน
    if (borrowDate.getTime() === returnDate.getTime()) {
      document.getElementById('borrowDuration').value = 1;
    } else if (borrowDate <= returnDate) {
      // คำนวณระยะเวลาการยืมในกรณีอื่น
      const duration = Math.ceil((returnDate - borrowDate) / (1000 * 60 * 60 * 24));
      document.getElementById('borrowDuration').value = duration;
    } else {
      document.getElementById('borrowDuration').value = '';
    }
  } else {
    document.getElementById('borrowDuration').value = '';
  }
}

// เพิ่ม ลบ รายการ
// เพิ่มแถว
document.getElementById('addRow').addEventListener('click', addRow);

function addRow() {
  const table = document.getElementById('borrowTable').getElementsByTagName('tbody')[0];
  const rowCount = table.rows.length; // คำนวณจำนวนแถวใน tbody
  const newRow = table.insertRow(rowCount); // เพิ่มแถวใหม่ที่ตำแหน่งสุดท้าย

  // เพิ่มคอลัมน์ "รายการที่"
  const cell1 = newRow.insertCell(0);
  cell1.textContent = rowCount + 1;

  // เพิ่มคอลัมน์ "รายการยืม" เป็น Drop-down List
  const cell2 = newRow.insertCell(1);
  const select = document.createElement('select');
  select.className = 'form-select';
  select.name = `item${rowCount + 1}`;

  const options = [
    'Laptop',
    'สาย HDMI',
    'เมาส์',
    'คีย์บอร์ด',
    'USB WIFI',
    'Desktop',
    'Monitor'
  ];

  options.forEach(optionText => {
    const option = document.createElement('option');
    option.value = optionText;
    option.textContent = optionText;
    select.appendChild(option);
  });

  cell2.appendChild(select);

  // เพิ่มคอลัมน์ "จำนวน" เป็น Input
  const cell3 = newRow.insertCell(2);
  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.name = `quantity${rowCount + 1}`;
  quantityInput.className = 'form-control';
  quantityInput.value = 1;
  quantityInput.min = 1; // ให้จำนวนขั้นต่ำคือ 1
  cell3.appendChild(quantityInput);
}

// ลบแถว
document.getElementById('removeRow').addEventListener('click', removeRow);

function removeRow() {
  const table = document.getElementById('borrowTable').getElementsByTagName('tbody')[0];
  const rowCount = table.rows.length;

  if (rowCount > 1) {
    table.deleteRow(rowCount - 1); // ลบแถวสุดท้าย
  } else {
    alert('ไม่สามารถลบรายการทั้งหมดได้ ต้องเหลืออย่างน้อย 1 รายการ');
  }
}



//ส่งข้อมูล
document.getElementById('borrowForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // หยุดการส่งฟอร์มแบบปกติ

  // เก็บค่าที่กรอกในฟอร์ม
  var borrowDate = document.getElementById('borrowDate').value;
  var name = document.getElementById('name').value;
  var phone = document.getElementById('phone').value.trim(); // แก้ไขให้เบอร์โทรเป็น string
  var division = document.getElementById('division').value;
  var position = document.getElementById('position').value;
  var returnDate = document.getElementById('returnDate').value;
  var borrowDuration = document.getElementById('borrowDuration').value;
  var purpose = document.getElementById('purpose').value;

  // เก็บรายการยืมทั้งหมด
  var items = [];
  var quantities = [];
  var itemSelects = document.querySelectorAll('[name^="item"]');
  var quantityInputs = document.querySelectorAll('[name^="quantity"]');

  itemSelects.forEach(function(select, index) {
    items.push(select.value);
    let quantity = parseInt(quantityInputs[index].value, 10);
    if (isNaN(quantity)) {
      quantity = 1;
    }
    quantities.push(quantity);
  });

  // ส่งข้อมูลไปยัง Google Sheets ผ่าน Webhook
  var formData = new FormData();
  formData.append('borrowDate', borrowDate);
  formData.append('name', name);
  formData.append('phone', phone);  // เบอร์โทรจะถูกส่งเป็น string ที่ไม่ตัดเลข 0
  formData.append('division', division);
  formData.append('position', position);
  formData.append('returnDate', returnDate);
  formData.append('borrowDuration', borrowDuration);
  formData.append('purpose', purpose);

  items.forEach(function(item, index) {
    formData.append('item' + (index + 1), item);
    formData.append('quantity' + (index + 1), quantities[index]);
  });

  console.log("FormData contents:");
  for (let pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }

  try {
    let response = await fetch('https://script.google.com/macros/s/AKfycbzD3cwtk5D0NJWypTO8DGB1Kdmg69lDbaK8-1qWytuC3yLD9G69mq1Iy9pBKcpU1IZffQ/exec', {
      method: 'POST',
      body: formData
    });

    let data = await response.text();
    console.log('Response from server:', data);
    alert('[บันทึกข้อมูลสำเร็จ]');
  } catch (error) {
    console.error('Error:', error);
    alert('Error ไหนไม่รู้ช่างมัน 55555');
  } finally {
    location.reload(); // รีเฟรชหน้าเว็บ
  }



});