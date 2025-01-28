// import Uplaod from "./upload-service";
// import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";

interface BookData {
  BIBID: string;
  TITLE: string;
  COLLECTIONNAME: string;
  ITEMCLASSNAME: string;
}

interface ItemData {
  data: {
    message: {
      iteminfo: BookData[];
    };
  };
}

const submitform = () =>{
  const form = document.getElementById("form");
  console.log(form)
}


const Create_Form_Service = ({ data }: { data: ItemData[] }) => {
  console.log("create_Form_Service", data);
  if (data === null) {
    return <>ไม่พบค่า</>;
  } else {
    return (
      <div className="flex-col ">
        {data.map((item, index) => {
          const formcolum = item.data.message.iteminfo[0];
          return (
            <form key={index} className="border-card bg-card">
              <Label htmlFor={`bookid${index}`}>รหัสหนังสือ</Label>
              <Input type="text" id={`bookid${index}`} placeholder="รหัสหนังสือ" value={formcolum?.BIBID} ></Input>

              <Label htmlFor={`booknaome${index}`}>ชื่อหนังสือ</Label>
              <Input type="text" id={`booknaome${index}`} placeholder="ชื่อหนังสือ" value={formcolum?.TITLE} ></Input>

              <Label htmlFor={`booktype${index}`}>ชนิดหนังชื่อ</Label>
              <Input type="text" id={`booktype${index}`} placeholder="ชนิดหนังชื่อ" value={formcolum?.ITEMCLASSNAME} ></Input>

              <Label htmlFor={`bookaddress${index}`}>ที่อยู่หนังสื่อ</Label>
              <Input type="text" id={`bookaddress${index}`} placeholder="ที่อยู่หนังสื่อ" value={formcolum?.COLLECTIONNAME} ></Input>

              <Label htmlFor={`servicebyname${index}`}>ชื่อผู้แจ้ง</Label>
              <Input type="text" id={`servicebyname${index}`} placeholder="ชื่อผู้แจ้ง"></Input>

              <Label htmlFor={`dateservice${index}`}>วันที่</Label>
              <Input type="date" id={`dateservice${index}`}></Input>
            </form>

          );
        })}
      </div>
    );
  }
};

export default Create_Form_Service;