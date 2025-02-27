import jsPDF from "jspdf";
import "jspdf-autotable";
import { thSarabunFont } from "./THSarabunNew-normal"; // นำเข้า Base64 ฟอนต์

function formatThaiDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('th-TH', options);
}

export function generatePDF(data: any[]) {
  const doc = new jsPDF();
  try {
    doc.addFileToVFS("THSarabunNew.ttf", thSarabunFont);
    doc.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
    doc.setFont("THSarabunNew");

    doc.setFontSize(16);
    doc.text("รายงานทรัพยากร", 14, 15);

    doc.autoTable({
      head: [["ลำดับ", "บาร์โค้ด", "เจ้าหน้าที่", "รายการ", "สถานะทรัพยากร", "วันที่อัปเดตสถานะ"]],
      body: data.map((item, index) => [
        index + 1, item.BookQR, item.UserAdminName, item.Service, item.StatusName, formatThaiDate(item.StatusDate)
      ]),
      startY: 20,
      styles: { font: "THSarabunNew", fontSize: 14 },
    });

    doc.save("report.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}
