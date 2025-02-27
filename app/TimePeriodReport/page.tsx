import TimePeriodReport from "@/components/TimePeriodReport-component/TimePeriodReport-By-Book";
import TimePeriodReportByCarlendar from "@/components/TimePeriodReport-component/TimePeriodReport-By-Time";
const Page = () => {
  return (
    <div className="space-x-8">
      <TimePeriodReport />
      <div className="border-t-2">
        <TimePeriodReportByCarlendar />
      </div>
    </div>
  );
};

export default Page;
