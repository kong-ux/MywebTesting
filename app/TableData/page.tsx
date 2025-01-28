'use client';

import useSWR from 'swr';
import { DataTable } from '@/components/Homepage-components/TableComponent/data-table';
import { columns } from '@/components/Homepage-components/TableComponent/columns';
import { Progress } from '@/components/ui/progress';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

export default function page() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getdata`,
    fetcher,
    {
      revalidateOnFocus: false, // Prevent re-fetching on focus
      dedupingInterval: 60000, // Cache data for 60 seconds on the client side
    }
  );

  if (isLoading) {
    return (
      <div className="m-4">
        <h1 className="text-lg font-medium mb-4">Loading...</h1>
        <Progress value={50} className="w-full h-2 bg-gray-300" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div>ไม่พบข้อมูล</div>;
  }

  return (
    <div className="m-4">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
