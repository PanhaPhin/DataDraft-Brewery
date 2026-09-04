
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { StatsData } from "@/lib/type";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";

type StatColor = "blue" | "indigo" | "purple" | "red" | "green";

const COLOR_STYLES: Record<
  StatColor,
  { bg: string; icon: string; text: string }
> = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    text: "text-blue-600",
  },
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    text: "text-indigo-600",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    text: "text-purple-600",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    text: "text-red-600",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    text: "text-green-600",
  },
};

const Dashboard = () => {
  const axiosPrivate = useAxiosPrivate();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosPrivate.get<StatsData>("/stats");

        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error);

        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [axiosPrivate]);

  // Show skeleton while loading
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Show error if stats cannot be loaded
  if (!stats) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Unable to load dashboard statistics.
        </p>  
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your business statistics
          </p>
        </div>

        
        <div className="mt-6">
       
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

