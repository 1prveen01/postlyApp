import PostedCard from "@/components/dashboard/PostedCard";
import PostInputCard from "@/components/dashboard/PostInputCard";
import StatsInfoCard from "@/components/dashboard/StatsInfoCard";
import UserInfoCard from "@/components/dashboard/UserInfoCard";

const Page = () => {
  return (
    <div className="w-full min-h-screen bg-linear-to-r from-blue-100 via-white to-blue-200 flex justify-center">
      <div className="w-full max-w-4xl p-4 md:p-8 border-l-2 border-gray-400 shadow-lg shadow-gray-900 bg-transparent grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
       
        
        {/* Row 1 */}
        <div className="bg-gray-100 w-full border border-gray-400 shadow-md hover:scale-102 transition-all duration-200 shadow-gray-900/50 rounded-lg">
          <UserInfoCard />
        </div>
        <div className="bg-gray-100 w-full border border-gray-400 shadow-md shadow-gray-900/50 hover:scale-102 transition-all duration-200 rounded-lg">
          <StatsInfoCard />
        </div>

        {/* Row 2 */}
        <div className="bg-gray-100 w-full rounded-lg border hover:scale-102 transition-all duration-200 border-gray-400 shadow-md shadow-gray-900/50 md:col-span-2">
          <PostInputCard />
        </div>

        {/* Row 3 */}
        <div className="bg-gray-100 w-full border overflow-hidden border-gray-400 shadow-md shadow-gray-900/50 rounded-lg md:col-span-2">
          <PostedCard />
        </div>
      </div>
    </div>
  );
};

export default Page;