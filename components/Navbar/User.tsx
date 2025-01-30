"use client";

import { useEffect, useState } from "react";
import { CircleUserRound } from "lucide-react";

const getdata = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/User`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "USER" }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to USER");
    }
    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error USER:", error);
    return null; // Return null in case of error
  }
};

export default function UserAvata({ state }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getdata();
      if (result) {
        console.log("ขอมูลดิบ", result);
        setData(result);
      } else {
        console.log("ขอมูลดิบ is null");
      }
    };
    fetchData();
  }, []);

  if (state === "logining") {
    return (
      <div className="user-avata flex items-center space-x-4">
        <CircleUserRound size={32} />

        <div className="user-avata__dropdown text-2xl font-extrabold">
          {data?.Username}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
