"use client";

import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";

export default function Formlogin() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      setLoading(false);
      return;
    }

    const data = { username, password };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        console.error("Error Response:", errorMessage);
        throw new Error(errorMessage.message || "Login failed");
      }

      const result = await response.json();
      console.log("Result:", result);
      if(result.status === 401){
        setErrorMessage(result.message)
        return
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Login Error:", error.message);
      setErrorMessage(error.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitLogin}>
      <div>
        <Label htmlFor="username">Username:</Label>
        <Input type="text" id="username" name="username" ref={usernameRef} />
      </div>
      <br />
      <div>
        <Label htmlFor="password">Password:</Label>
        <Input
          type="password"
          id="password"
          name="password"
          ref={passwordRef}
        />
      </div>
      <br />
      {errorMessage && (
        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
