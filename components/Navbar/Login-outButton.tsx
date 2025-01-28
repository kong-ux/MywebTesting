"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import LoginformDialog from "@/components/loging-component/crad-Dialog";
import { useSearchParams } from 'next/navigation'; // Added useSearchParams
import UserAvata from "./User";

export const ButtonState = () => {
  const [session, setSession] = useState<any>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);

  const searchParams = useSearchParams(); // Get search params
  const user = searchParams.get('user'); // Get 'user' query parameter

  useEffect(() => {
    if (user === 'login') {
      setLoginDialogOpen(true);
    } else {
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
    }
  }, [user]); // Added user as dependency

  const handleButtonClick = () => {
    if (session) {
      logout();
    } else {
      setLoginDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setLoginDialogOpen(false);
    if(user === 'login') {
      const url = new URL('/', window.location.href);
      url.searchParams.delete('user');
      window.history.replaceState({}, '', url);
    }
  };

  return (
    <>
      <UserAvata state={session ? 'logining' : ''} />
      <Button onClick={handleButtonClick}>
        {session ? "LOGOUT" : "LOGIN"}
      </Button>
      <LoginformDialog state={loginDialogOpen} onClose={handleCloseDialog} />
    </>
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
