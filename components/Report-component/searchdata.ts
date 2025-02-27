async function getData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`);

    if (!res.ok) {
      console.error("Fetching data failed:", res.status, res.statusText);
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Invalid data format:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default async function  searchdata(
  inputValue: string,
  selectedBookState: string[] | null,
  selectedBookType: string[] | null,
  selectedBookAddress: string[] | null,
  selectedService: string[] | null,
  selectedServiceByName: string[] | null,
  selectedStatusName: string[] | null,
  selectedUser: string[] | null,
  fromDate: string,
  toDate: string
) {
  const data = await getData();
  console.log("📥 Data from API:", data);

  if (!Array.isArray(data)) {
    console.error("🚨 Data is not an array:", data);
    return [];
  }

  // ✅ แปลงวันที่ให้เป็น YYYY-MM-DD
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };
  const from = formatDate(fromDate);
  const to = formatDate(toDate);
  const inputLower = (inputValue || "").trim().toLowerCase();

  return data.filter((item: any) => {
    const StatusDate = item.StatusDate ? formatDate(item.StatusDate) : null;

    const matchesInputValue =
      inputValue === "" ||
      (item.Bookname?.toLowerCase().includes(inputLower) ?? false) ||
      (item.BookQR?.toLowerCase().includes(inputLower) ?? false) ||
      (item.FK_BookID?.toLowerCase().includes(inputLower) ?? false);

    const matchesBookState =
      !selectedBookState || selectedBookState.length === 0 || selectedBookState.some(state => item.Bookstate?.trim().toLowerCase() === state.trim().toLowerCase());

    const matchesBookType =
      !selectedBookType || selectedBookType.length === 0 || selectedBookType.some(type => item.BookType?.trim().toLowerCase() === type.trim().toLowerCase());

    const matchesBookAddress =
      !selectedBookAddress || selectedBookAddress.length === 0 || selectedBookAddress.some(address => item.Bookaddress?.trim().toLowerCase() === address.trim().toLowerCase());

    const matchesService =
      !selectedService || selectedService.length === 0 || selectedService.some(service => item.Service?.trim().toLowerCase() === service.trim().toLowerCase());

    const matchesServiceByName =
      !selectedServiceByName || selectedServiceByName.length === 0 || selectedServiceByName.some(name => item.ServiceByName?.trim().toLowerCase() === name.trim().toLowerCase());

    const matchesStatusName =
      !selectedStatusName || selectedStatusName.length === 0 || selectedStatusName.some(status => item.StatusName?.trim().toLowerCase() === status.trim().toLowerCase());

      const matchesUser =
      !selectedUser || selectedUser.length === 0 || selectedUser.some(user => item.UserAdminName?.trim().toLowerCase() === user.trim().toLowerCase());
    

    // ✅ เปรียบเทียบเฉพาะ YYYY-MM-DD
    const matchesDateRange =
      !from || !to || (StatusDate && StatusDate >= from && StatusDate <= to);

    // ✅ ถ้าไม่ได้เลือกอันไหนเลยก็ให้หาทั้งหมด
    const noFiltersSelected =
      !inputValue &&
      (!selectedBookState || selectedBookState.length === 0) &&
      (!selectedBookType || selectedBookType.length === 0) &&
      (!selectedBookAddress || selectedBookAddress.length === 0) &&
      (!selectedService || selectedService.length === 0) &&
      (!selectedServiceByName || selectedServiceByName.length === 0) &&
      (!selectedStatusName || selectedStatusName.length === 0) &&
      (!selectedUser || selectedUser.length === 0) &&
      !fromDate &&
      !toDate;

    return (
      noFiltersSelected ||
      (
        matchesInputValue &&
        matchesBookState &&
        matchesBookType &&
        matchesBookAddress &&
        matchesService &&
        matchesServiceByName &&
        matchesStatusName &&
        matchesUser &&
        matchesDateRange
      )
    );
  });
}
