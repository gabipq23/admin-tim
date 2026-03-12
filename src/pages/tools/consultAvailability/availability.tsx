import SearchAvailability from "./components/searchAvailability/searchAvailability";
import ImportXLSX from "./components/bulkAvailability/importXLSX";
import ConsultAvailability from "./components/consultAvailability/consultAvailability";

export default function Availability() {
  return (
    <div className="flex flex-col gap-6 px-6 md:px-8 lg:px-10">
      <div className="flex flex-row flex-wrap lg:flex-nowrap gap-6 w-full">
        <ConsultAvailability />
        <ImportXLSX />
      </div>

      <SearchAvailability />
    </div>
  );
}
