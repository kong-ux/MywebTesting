import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps {
  data: {
    Repair_ID: number;
    FK_BookID: string;
    BookQR: string;
    Bookname: string;
    BookType: string;
    Bookaddress: string;
    Bookstate: string;
    ServiceByName: string;
    Service: string;
    ServiceNote: string | null;
    UserAdminName: string;
    ServiceDate: string;
    StatusName: string;
    StatusDate: string;
  }[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <Table>
      <TableCaption>📚 รายการ</TableCaption>
      <TableHeader className="bg-primary/20 ">
        <TableRow className="font-bold text-base text-black dark:text-white">
          <TableHead>ลำดับ</TableHead>
          <TableHead>รหัสหนังสือ</TableHead>
          <TableHead>บาร์โค้ด</TableHead>
          <TableHead>ชื่อหนังสือ</TableHead>
          <TableHead>ประเภททรัพยากร</TableHead>
          <TableHead>สถานที่จัดเก็บ</TableHead>
          <TableHead>สถานะหนังสือ</TableHead>
          <TableHead>ชื่อผู้แจ้ง</TableHead>
          <TableHead>รายการ</TableHead>
          <TableHead>เพิ่มเติม</TableHead>
          <TableHead>เจ้าหน้าที่</TableHead>
          <TableHead>วันที่ทำรายการ</TableHead>
          <TableHead>สถานะทรัพยากร</TableHead>
          <TableHead>วันที่อัปเดตสถานะ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.Repair_ID}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{item.FK_BookID}</TableCell>
            <TableCell>{item.BookQR}</TableCell>
            <TableCell>{item.Bookname}</TableCell>
            <TableCell>{item.BookType}</TableCell>
            <TableCell>{item.Bookaddress}</TableCell>
            <TableCell>{item.Bookstate}</TableCell>
            <TableCell>{item.ServiceByName}</TableCell>
            <TableCell>{item.Service}</TableCell>
            <TableCell>{item.ServiceNote ? item.ServiceNote : "-"}</TableCell>
            <TableCell>{item.UserAdminName}</TableCell>
            <TableCell>{new Date(item.ServiceDate).toLocaleDateString()}</TableCell>
            <TableCell>{item.StatusName}</TableCell>
            <TableCell>{new Date(item.StatusDate).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
