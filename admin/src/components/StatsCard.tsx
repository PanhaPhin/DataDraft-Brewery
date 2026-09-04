
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Link } from "lucide-react";


interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  href?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  className,
  href,
}: StatsCardProps) {
  const cardContent = (
    <Card
      className={cn(
        "group relative overflow-hidden border bg-card",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
        "hover:border-primary/30",
        className
      )}
    >
      {/* Top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/40" />

      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-300 group-hover:bg-primary/10" />

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>

          <div className="text-3xl font-bold tracking-tight">
            {value}
          </div>
        </div>

        {icon && (
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center",
              "rounded-xl border bg-primary/10 text-primary",
              "transition-all duration-300",
              "group-hover:scale-110 group-hover:bg-primary/15"
            )}
          >
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {description && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {href && (
          <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View details
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Make the whole card clickable only when href exists
  if (href) {
    return (
      <Link
        to={href}
        className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`View ${title} details`}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

