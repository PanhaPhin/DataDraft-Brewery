import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { StatsData } from "@/lib/type";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import {
  ShoppingBag,
  Users,
  Tag,
  Bookmark,
  Package,
  DollarSign,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StatColor = "blue" | "indigo" | "violet" | "amber" | "emerald" | "rose";

const COLOR_STYLES: Record<
  StatColor,
  { bg: string; ring: string; icon: string; accent: string }
> = {
  blue: {
    bg: "bg-blue-50",
    ring: "ring-blue-100",
    icon: "text-blue-600",
    accent: "#2563eb",
  },
  indigo: {
    bg: "bg-indigo-50",
    ring: "ring-indigo-100",
    icon: "text-indigo-600",
    accent: "#4f46e5",
  },
  violet: {
    bg: "bg-violet-50",
    ring: "ring-violet-100",
    icon: "text-violet-600",
    accent: "#7c3aed",
  },
  amber: {
    bg: "bg-amber-50",
    ring: "ring-amber-100",
    icon: "text-amber-600",
    accent: "#d97706",
  },
  emerald: {
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
    icon: "text-emerald-600",
    accent: "#059669",
  },
  rose: {
    bg: "bg-rose-50",
    ring: "ring-rose-100",
    icon: "text-rose-600",
    accent: "#e11d48",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const PIE_COLORS = ["#2563eb", "#0f172a"];


const StatCard = ({
  title,
  value,
  icon,
  color,
  href,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: StatColor;
  href?: string;
}) => {
  const styles = COLOR_STYLES[color];
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 opacity-80"
        style={{ backgroundColor: styles.accent }}
      />
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.bg} ring-1 ${styles.ring}`}
        >
          <span className={styles.icon}>{icon}</span>
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </p>
      {href && (
        <span className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors group-hover:text-gray-600">
          View details
          <ArrowUpRight className="h-3 w-3" />
        </span>
      )}
    </Wrapper>
  );
};

const ChartCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
  >
    <div className="mb-5">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
    {children}
  </motion.div>
);

const chartTooltipStyle = {
  borderRadius: "0.75rem",
  border: "1px solid #f1f5f9",
  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
  fontSize: "0.8rem",
};

const EmptyChartState = ({ label }: { label: string }) => (
  <div className="flex h-[260px] flex-col items-center justify-center gap-1 text-center">
    <p className="text-sm font-medium text-gray-400">No data yet</p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

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

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Unable to load dashboard statistics.
        </p>
      </div>
    );
  }

  const categoriesChartData = stats.categories ?? [];
  const userRolesChartData = stats.roles ?? [];
  const brandChartData = stats.brands ?? [];

  const totalUserRoles = userRolesChartData.reduce(
    (sum, entry) => sum + (entry.value ?? 0),
    0
  );

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-200">
              <LayoutDashboard className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Dashboard overview
              </h1>
              <p className="text-sm text-gray-500">
                Overview of your business statistics
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400">{today}</p>
        </div>

        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={cardVariants}>
            <StatCard
              title="Total Users"
              value={stats.counts.users}
              icon={<Users className="h-5 w-5" />}
              color="indigo"
              href="/dashboard/users"
            />
          </motion.div>

          <motion.div variants={cardVariants}>
            <StatCard
              title="Total Products"
              value={stats.counts.products}
              icon={<ShoppingBag className="h-5 w-5" />}
              color="blue"
              href="/dashboard/products"
            />
          </motion.div>

          <motion.div variants={cardVariants}>
            <StatCard
              title="Categories"
              value={stats.counts.categories}
              icon={<Tag className="h-5 w-5" />}
              color="violet"
              href="/dashboard/categories"
            />
          </motion.div>

          <motion.div variants={cardVariants}>
            <StatCard
              title="Brands"
              value={stats.counts.brands}
              icon={<Bookmark className="h-5 w-5" />}
              color="amber"
              href="/dashboard/brands"
            />
          </motion.div>

          <motion.div variants={cardVariants}>
            <StatCard
              title="Total Orders"
              value={stats.counts.orders}
              icon={<Package className="h-5 w-5" />}
              color="rose"
              href="/dashboard/orders"
            />
          </motion.div>

          <motion.div variants={cardVariants}>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats.counts.totalRevenue ?? 0)}
              icon={<DollarSign className="h-5 w-5" />}
              color="emerald"
              href="/dashboard/orders"
            />
          </motion.div>
        </motion.div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Categories Distribution"
            subtitle="Products grouped by category"
          >
            {categoriesChartData.length === 0 ? (
              <EmptyChartState label="Add products to a category to see this chart." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoriesChartData} barSize={48}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={chartTooltipStyle}
                  />
                  <Bar
                    dataKey="value"
                    name="Products"
                    fill="#2563eb"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard
            title="User Roles Distribution"
            subtitle={`${totalUserRoles} total users`}
          >
            {userRolesChartData.length === 0 ? (
              <EmptyChartState label="User roles will appear here once accounts exist." />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={userRolesChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={64}
                    outerRadius={100}
                    paddingAngle={2}
                    cornerRadius={6}
                  >
                    {userRolesChartData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-sm capitalize text-gray-600">
                        {value}
                      </span>
                    )}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Brand Distribution */}
        <ChartCard
          title="Brand Distribution"
          subtitle="Products grouped by brand"
        >
          {brandChartData.length === 0 ? (
            <EmptyChartState label="Assign products to a brand to see this chart." />
          ) : (
            <ResponsiveContainer
              width="100%"
              height={Math.max(220, brandChartData.length * 56)}
            >
              <BarChart data={brandChartData} layout="vertical" barSize={28}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={chartTooltipStyle}
                />
                <Bar
                  dataKey="value"
                  name="Products"
                  fill="#2563eb"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;