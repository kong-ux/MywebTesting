async function getData(from: Date, to: Date) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`);

    if (!res.ok) {
      console.log("Fetching data from:", `${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`);
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data.filter(item => {
      const itemDate = new Date(item.ServiceDate); // Assuming the data has a 'ServiceDate' field
      return itemDate >= from && itemDate <= to;
    });
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
}

export default async function dataCardDashboard(from: Date, to: Date) {
  try {
    const data = await getData(from, to);

    const countInProgresone = data.filter(
      (item) => item.StatusName === "อยู่ละหว่างรับเรื่อง"
    ).length;

    const countProcestwo = data.filter(
      (item) =>
        item.StatusName !== "อยู่ละหว่างรับเรื่อง" &&
        item.StatusName !== "ดำเนินการเสร็จสิ้นพร้อมนำออกให้บริการ" &&
        item.StatusName !== "เตรียมจำหน่ายออก"
    ).length;

    const countProcesthree = data.filter(
      (item) => item.StatusName === "เตรียมจำหน่ายออก"
    ).length;

    const countProcesfour = data.filter(
      (item) => item.StatusName === "ดำเนินการเสร็จสิ้นพร้อมนำออกให้บริการ"
    ).length;

    const DataCardReporting = [
      { state: "อยู่ละหว่างรับเรื่อง", num: countInProgresone },
      { state: "อยู่หว่างดำเนินการ", num: countProcestwo },
      { state: "เตรียมจำหน่ายออก", num: countProcesthree },
      { state: "ส่งคืนไปแล้ว", num: countProcesfour },
    ];

    return { DataCardReporting };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { DataCardReporting: [] };
  }
}