"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ButtonLogOut = () => {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/User`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "LOGIN" }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch session data");
        }

        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error("Error fetching session:", error);
        setSession(null);
      }
    };
    fetchSession();
  }, []);

  const handleButtonClick = () => {
    if (!session) {
      router.push("/login");
    } else {
      logout();
    }
  };

  return (
    <Button onClick={handleButtonClick}>
      {session ? "LOGOUT" : "LOGIN"}
    </Button>
  );
};

const logout = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/User`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "LOGOUT" }),
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
