import { DataTable } from "@/components/Homepage-components/TableComponent/data-table";
import { columns } from "@/components/Homepage-components/TableComponent/columns";

async function getData() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`, {
  });

  if (!res.ok) {
    console.log("Fetching data from:", `${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`);
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}


export default async function Home() {

  const data = await getData();
  return (
    <>
    <div className="m-4 bg-card">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
        </p>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
    </>
  );
}
