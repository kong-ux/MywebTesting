async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`);

  if (!res.ok) {
    console.log("Fetching data from:", `${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`);
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}


export default async function SheetData() {
  try {
    const data = await getData();
    const Reported = data.filter(item => item.Service === "รับเรื่องแจ้งแล้ว" && item.Bookstate === "อยู่ในละหว่างดำเนินการ").map(item => ({
      BookQR: item.BookQR,
      BookID: item.FK_BookID,
      Service: item.Service,
      ServiceDate: item.ServiceDate
    }));

    const Working = data.filter(item => item.Service !== "รับเรื่องแจ้งแล้ว" && item.StatusName !== "เตรียมจำหน่ายออก" && item.StatusName !== "ดำเนินการเสร็จสิ้นพร้อมนำออกให้บริการ" && item.Bookstate === "อยู่ในละหว่างดำเนินการ").map(item => ({
      BookQR: item.BookQR,
      BookID: item.FK_BookID,
      Service: item.Service,
      ServiceDate: item.ServiceDate,
      Status: item.StatusName,
      StatusDate: item.StatusDate
    }));

    return { Working, Reported };
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
    return { type_books: [], address_book: [] }; 
  }
}