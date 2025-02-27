"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DownloadExcelWithFilter } from "@/lib/xlsx"; // Import the DownloadExcel function
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const items = [
  {
    id: "ลำดับ",
    label: "ลำดับ",
  },
  {
    id: "รหัสรายการซ่อม",
    label: "รหัสรายการซ่อม"
  },
  {
    id: "รหัสหนังสือ",
    label: "รหัสหนังสือ",
  },
  {
    id: "บาร์โค้ด",
    label: "บาร์โค้ด",
  },
  {
    id: "ชื่อหนังสือ",
    label: "ชื่อหนังสือ",
  },
  {
    id: "ประเภททรัพยากร",
    label: "ประเภททรัพยากร",
  },
  {
    id: "สถานที่จัดเก็บ",
    label: "สถานที่จัดเก็บ",
  },
  {
    id: "สถานะหนังสือ",
    label: "สถานะหนังสือ",
  },
  {
    id: "เจ้าหน้าที่",
    label: "เจ้าหน้าที่",
  },
  {
    id: "รายการ",
    label: "รายการ",
  },
  {
    id: "ชื่อผู้แจ้ง",
    label: "ชื่อผู้แจ้ง",
  },
  {
    id: "วันที่ทำรายการ",
    label: "วันที่ทำรายการ",
  },
  {
    id: "สถานะทรัพยากร",
    label: "สถานะทรัพยากร",
  },
  {
    id: "วันที่อัปเดตสถานะ",
    label: "วันที่อัปเดตสถานะ",
  },
] as const;

const FormSchema = z.object({
  data: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "ต้องเลือกอย่างน้อย 1 รายการ",
  }),
});

export function XportFilter({ filteredData }: { filteredData: any }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      data: ["ลำดับ", "รหัสหนังสือ", "บาร์โค้ด", "ชื่อหนังสือ", "ประเภททรัพยากร", "สถานที่จัดเก็บ", "รายการ", "วันที่ทำรายการ", "สถานะทรัพยากร", "วันที่อัปเดตสถานะ", "ชื่อผู้แจ้ง"],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const selectedColumns = data.data;
    const filteredColumnsData = filteredData.map((row: any, index: number) => {
      const newRow: any = { ลำดับ: index + 1 };
      if (selectedColumns.includes("รหัสรายการซ่อม") && row.Repair_ID) newRow.รหัสรายการซ่อม = row.Repair_ID;
      if (selectedColumns.includes("เจ้าหน้าที่") && row.UserAdminName) newRow.เจ้าหน้าที่ = row.UserAdminName;
      if (selectedColumns.includes("บาร์โค้ด") && row.BookQR) newRow.บาร์โค้ด = row.BookQR;
      if (selectedColumns.includes("รหัสหนังสือ") && row.FK_BookID) newRow.รหัสหนังสือ = row.FK_BookID;
      if (selectedColumns.includes("ชื่อหนังสือ") && row.Bookname) newRow.ชื่อหนังสือ = row.Bookname;
      if (selectedColumns.includes("ประเภททรัพยากร") && row.BookType) newRow.ประเภททรัพยากร = row.BookType;
      if (selectedColumns.includes("สถานที่จัดเก็บ") && row.Bookaddress) newRow.สถานที่จัดเก็บ = row.Bookaddress;
      if (selectedColumns.includes("สถานะหนังสือ") && row.Bookstate) newRow.สถานะหนังสือ = row.Bookstate;
      if (selectedColumns.includes("รายการ") && row.Service) newRow.รายการ = row.Service;
      if (selectedColumns.includes("เพิ่มเติม") && row.ServiceNote) newRow.เพิ่มเติม = row.ServiceNote;
      if (selectedColumns.includes("ชื่อผู้แจ้ง") && row.ServiceByName) newRow.ชื่อผู้แจ้ง = row.ServiceByName;
      if (selectedColumns.includes("วันที่ทำรายการ") && row.ServiceDate) newRow.วันที่ทำรายการ = row.ServiceDate;
      if (selectedColumns.includes("สถานะทรัพยากร") && row.StatusName) newRow.สถานะทรัพยากร = row.StatusName;
      if (selectedColumns.includes("วันที่อัปเดตสถานะ") && row.StatusDate) newRow.วันที่อัปเดตสถานะ = row.StatusDate;
      return newRow;
    });
    DownloadExcelWithFilter(filteredColumnsData, selectedColumns);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Export Excel</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ข้อมูลทรัพยากร</DialogTitle>
          <DialogDescription>
            กรุณาเลือกข้อมูลที่ต้องการ Export
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="data"
              render={() => (
                <FormItem>
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="data"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
