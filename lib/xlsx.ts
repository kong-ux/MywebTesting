import * as XLSX from "xlsx-js-style";

export async function DownloadExcel(data: any[]) {
  // Create a new workbook and add a worksheet
  const workbook = XLSX.utils.book_new();
  const dataWithNewHeaders = data.map((row, index) => {
    const newRow: any = { ลำดับ: index + 1 };
    if (row.Repair_ID) newRow.รหัสรายการซ่อม = row.Repair_ID;
    if (row.UserAdminName) newRow.เจ้าหน้าที่ = row.UserAdminName;
    if (row.BookQR) newRow.บาร์โค้ด = row.BookQR;
    if (row.FK_BookID) newRow.รหัสหนังสือ = row.FK_BookID;
    if (row.Bookname) newRow.ชื่อหนังสือ = row.Bookname;
    if (row.BookType) newRow.ประเภททรัพยากร = row.BookType;
    if (row.Bookaddress) newRow.สถานที่จัดเก็บ = row.Bookaddress;
    if (row.Bookstate) newRow.สถานะหนังสือ = row.Bookstate;
    if (row.Service) newRow.รายการ = row.Service;
    if (row.ServiceNote) newRow.เพิ่มเติม = row.ServiceNote;
    if (row.ServiceByName) newRow.ชื่อผู้แจ้ง = row.ServiceByName;
    if (row.ServiceDate) newRow.วันที่ทำรายการ = row.ServiceDate;
    if (row.StatusName) newRow.สถานะทรัพยากร = row.StatusName;
    if (row.StatusDate) newRow.วันที่อัปเดตสถานะ = row.StatusDate;
    return newRow;
  });
  const worksheet = XLSX.utils.json_to_sheet(dataWithNewHeaders);

  // Get the range of the sheet
  const range = XLSX.utils.decode_range(worksheet['!ref']!);

  // Apply styles to the header row
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell_address = XLSX.utils.encode_cell({ c: C, r: 0 });
    if (!worksheet[cell_address]) continue;

    worksheet[cell_address].s = {
      fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "FFFF00" } }, // Yellow background
      font: { bold: true, sz: 14, color: { rgb: "000000" } }, // Bold, font size 14, black color
      alignment: { horizontal: "center", vertical: "center" }, // Center align text
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
  }

  // กำหนดความกว้างของทุกคอลัมน์เป็น 20
  worksheet["!cols"] = Array(range.e.c + 1).fill({ wch: 20 });

  // กำหนดความสูงของแถว (header = 8, ที่เหลือ = 5)
  worksheet["!rows"] = [
    { hpt: 40 }, // แถวที่ 1 (header) สูง 8
    ...Array(range.e.r).fill({ hpt: 25 }), // แถวอื่นๆ สูง 5
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate a buffer for the workbook
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a blob from the buffer and trigger a download
  triggerDownload(excelBuffer, "data.xlsx");
}

function triggerDownload(buffer: any, filename: string) {
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function DownloadExcelWithFilter(data: any[], selectedColumns: string[]) {
  // Create a new workbook and add a worksheet
  const workbook = XLSX.utils.book_new();
  const dataWithSelectedColumns = data.map((row) => {
    const newRow: any = {};
    selectedColumns.forEach((col) => {
      if (row[col] !== undefined) newRow[col] = row[col];
    });
    return newRow;
  });
  const worksheet = XLSX.utils.json_to_sheet(dataWithSelectedColumns);

  // Get the range of the sheet
  const range = XLSX.utils.decode_range(worksheet['!ref']!);

  // Apply styles to the header row
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell_address = XLSX.utils.encode_cell({ c: C, r: 0 });
    if (!worksheet[cell_address]) continue;

    worksheet[cell_address].s = {
      fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "FFFF00" } }, // Yellow background
      font: { bold: true, sz: 14, color: { rgb: "000000" } }, // Bold, font size 14, black color
      alignment: { horizontal: "center", vertical: "center" }, // Center align text
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
  }

  // Set column widths and row heights
  worksheet["!cols"] = Array(range.e.c + 1).fill({ wch: 20 });
  worksheet["!rows"] = [
    { hpt: 40 }, // Header row height
    ...Array(range.e.r).fill({ hpt: 25 }), // Other rows height
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate a buffer for the workbook
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a blob from the buffer and trigger a download
  triggerDownload(excelBuffer, "ข้อมูล.xlsx");
}
