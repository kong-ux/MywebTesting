// ฟังก์ชัน getData ใช้สำหรับดึงข้อมูลจาก API
async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata/property`);

  if (!res.ok) {
    console.log(
      "Fetching data from:",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata/property`
    );
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}

// ฟังก์ชัน fetchTypeBooks_AddressBook ใช้สำหรับดึงข้อมูลประเภทหนังสือและที่อยู่หนังสือ
export default async function fetchTypeBooks_AddressBook() {
  try {
    const data = await getData();
    const type_books = [...new Set(data.map((item) => item.BookType))].map(
      (type) => ({
        value: type,
        label: type,
      })
    );

    const address_book = [...new Set(data.map((item) => item.Bookaddress))].map(
      (address) => ({
        value: address,
        label: address,
      })
    );

    const status = [...new Set(data.map((item) => item.StatusName))].map(
      (status) => ({
        value: status,
        label: status,
      })
    );
    const service = [...new Set(data.map((item) => item.Service))].map(
      (service) => ({
        value: service,
        label: service,
      })
    );

    return { type_books, address_book, status, service };
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
    return { type_books: [], address_book: [] };
  }
}
