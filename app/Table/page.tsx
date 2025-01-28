"use client";
import { useAlert } from "@/hooks/use-alert";

const Page = () => {
  const { showAlert } = useAlert();

  const handleAction = () => {
    showAlert(
      "Error",
      "This action is not allowed. Please try again.",
      "Close"
    );
  };

  return (
    <div>
      <button onClick={handleAction} className="btn-primary">
        Show Alert
      </button>
    </div>
  );
  };
  

export default Page;
