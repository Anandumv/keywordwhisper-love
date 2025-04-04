
import { Skeleton } from "@/components/ui/skeleton";

const TrendLoadingSkeleton = () => {
  return (
    <div className="flex-1 p-6 bg-[#efeae2] overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-5 w-full mb-3" />
          <Skeleton className="h-5 w-full mb-3" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendLoadingSkeleton;
