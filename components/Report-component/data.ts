async function getData() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata/property`);

        if (!res.ok) {
            console.error("Fetching data failed:", res.status, res.statusText);
            throw new Error(`Failed to fetch data: ${res.status}`);
        }

        const data = await res.json();
        
        // ✅ ตรวจสอบว่า `data` เป็น array หรือไม่
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

export default async function fetchTypeBooks_AddressBook() {
    try {
        const data = await getData();

        // ✅ ใช้ Set() เพื่อลดค่าซ้ำ
        const BookType = Array.from(new Set(data.map(item => item.BookType).filter(Boolean)));
        const Bookaddress = Array.from(new Set(data.map(item => item.Bookaddress).filter(Boolean)));
        const Bookstate = Array.from(new Set(data.map(item => item.Bookstate).filter(Boolean)));
        const ServiceByName = Array.from(new Set(data.map(item => item.ServiceByName).filter(Boolean)));
        const Service = Array.from(new Set(data.map(item => item.Service).filter(Boolean)));
        const StatusName = Array.from(new Set(data.map(item => item.StatusName).filter(Boolean)));
        const User = Array.from(new Set(data.map(item => item.UserAdminName).filter(Boolean)));

        return { BookType, Bookaddress, Bookstate, ServiceByName, Service, StatusName, User };
    } catch (error) {
        console.error("Error fetching dropdown options:", error);
        return { BookType: [], Bookaddress: [], Bookstate: [], ServiceByName: [], Service: [], StatusName: [], User: [] };
    }
}
