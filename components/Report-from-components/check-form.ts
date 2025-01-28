"use client";
interface DataProps {
  data: {
    message: string | null;
    status: string | null; 
  };

}

interface CheckFormProps {
  data: DataProps[];
  showAlert: (title: string, description: string, cancelText: string) => void;
}

const CheckForm = ({ data, showAlert }: CheckFormProps) => {
  console.log("dataCheckForm", data)
  let isAllNotNull = true;
  const textout: string[] = [];

  if (data == null) {
    console.log("ไม่พบ Data ใน CheckForm");
    return null;
  } else {
    data.forEach((item, index) => {
      if (item.data.message === null) {
        textout.push(`อันที่ ${index + 1} ไม่พบข้อมูล`);
        isAllNotNull = false;
      }
    });

    if (!isAllNotNull) {
      showAlert("ไม่สามารถสร้างได้", textout.join("\n"), "Close");
      return null;
    } else {
      console.log("พบค่าทั้งหมด");
      return data;
    }
  }
};

export default CheckForm;
