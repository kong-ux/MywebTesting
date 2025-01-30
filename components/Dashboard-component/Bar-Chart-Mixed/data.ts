"use client";

async function getData(from: Date, to: Date) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`);

    if (!res.ok) {
      console.log("Fetching data from:", `${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`);
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data.filter(item => {
      const itemDate = new Date(item.ServiceDate);
      return itemDate >= from && itemDate <= to;
    });
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
}

export default async function dataCardBarChart(from: Date, to: Date) {
  try {
    const data = await getData(from, to);

    // นับจำนวน Service แต่ละประเภท
    const serviceCounts = data.reduce((acc, item) => {
      const service = item.Service;
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {});

    // นับจำนวน FK_BookID แต่ละประเภท
    const FK_BookIDCounts = data.reduce((acc, item) => {
      const bookID = item.FK_BookID;
      acc[bookID] = (acc[bookID] || 0) + 1;
      return acc;
    }, {});

    // นับจำนวน BookType แต่ละประเภท
    const BookTypeCounts = data.reduce((acc, item) => {
      const bookType = item.BookType;
      acc[bookType] = (acc[bookType] || 0) + 1;
      return acc;
    }, {});

    // นับจำนวน Bookaddress แต่ละประเภท
    const BookaddressCounts = data.reduce((acc, item) => {
      const bookaddress = item.Bookaddress;
      acc[bookaddress] = (acc[bookaddress] || 0) + 1;
      return acc;
    }, {});

    // แปลงเป็นรูปแบบที่กราฟต้องการ
    const DataService = Object.entries(serviceCounts).map(([state, num]) => ({
      state,
      num,
    }));

    const DataFK_BookID = Object.entries(FK_BookIDCounts).map(([state, num]) => ({
      state,
      num,
    }));

    const DataBookType = Object.entries(BookTypeCounts).map(([state, num]) => ({
      state,
      num,
    }));

    const DataBookaddress = Object.entries(BookaddressCounts).map(([state, num]) => ({
      state,
      num,
    }));

    return { DataService, DataFK_BookID, DataBookType, DataBookaddress };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { DataService: [], DataFK_BookID: [], DataBookType: [], DataBookaddress: [] };
  }
}
