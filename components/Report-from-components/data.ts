async function getData() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`);

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

export default async function fetchServiceByName() {
    try {
        const data = await getData();

        // ✅ ใช้ Set() เพื่อลดค่าซ้ำ

        const ServiceByName = Array.from(new Set(data.map(item => item.ServiceByName).filter(Boolean)));
    

        return { ServiceByName };
    } catch (error) {
        console.error("Error fetching dropdown options:", error);
        return { ServiceByName: [] };
    }
}
