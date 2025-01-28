const Uplaod = async (data) => {
  console.log("Uploading data:", data);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post_data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Error Response:", errorMessage);
      throw new Error(`HTTP error! status: ${response.status} - ${errorMessage}`);
    }
  
    const result = await response.json();
    console.log("Result:", result);
    
    window.location.reload();
  } catch (error) {
    console.error("Upload Error:", error.message);
    throw error;
  }
};

export default Uplaod;
