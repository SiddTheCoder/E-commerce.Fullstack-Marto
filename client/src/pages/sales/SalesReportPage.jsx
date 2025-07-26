import React from "react";
import SalesReportGraph from "../../components/SalesReportGraph";
import PageBacker from "../../components/PageBacker";

function SalesReportPage() {
  const [loading, setLoading] = React.useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);
  // Sample mood logs data
  const moodLogs = [
    { date: "Jul 1", level: 1 },
    { date: "Jul 2", level: 4 },
    { date: "Jul 3", level: 2 },
    { date: "Jul 4", level: 5 },
    { date: "Jul 10", level: 2 },
    { date: "Jul 13", level: 3 },
    { date: "Jul 15", level: 4 },
    { date: "Jul 25", level: 5 },
  ];
  return (
    <div className="h-full w-full flex flex-col bg-slate-100/10">
      {/* Header */}
      <header className="bg-slate-100/10 shadow-md pl-4 flex justify-between items-center h-14 w-full pr-5 py-4 sticky top-0 z-50">
        <PageBacker />
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-3 z-10 relative">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Sales Report</h1>
        <div className="h-[500px] w-[100vw] bg-white rounded-lg shadow-md p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <SalesReportGraph moodLogs={moodLogs} />
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesReportPage;
