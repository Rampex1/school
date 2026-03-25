import * as React from "react";

import { cn } from "@/lib/utils";

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
}

interface StatusConfig {
  label: string;
  className: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  // General statuses
  active: {
    label: "Active",
    className: "bg-green-500/15 text-green-500 border-green-500/25",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-500/15 text-gray-400 border-gray-500/25",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/25",
  },
  approved: {
    label: "Approved",
    className: "bg-green-500/15 text-green-500 border-green-500/25",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/15 text-red-400 border-red-500/25",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-500/15 text-gray-400 border-gray-500/25",
  },

  // Game statuses
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  },
  completed: {
    label: "Completed",
    className: "bg-green-500/15 text-green-500 border-green-500/25",
  },
  postponed: {
    label: "Postponed",
    className: "bg-yellow-500/15 text-yellow-500 border-yellow-500/25",
  },

  // Team statuses
  open: {
    label: "Open",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  },
  full: {
    label: "Full",
    className: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  },
  disbanded: {
    label: "Disbanded",
    className: "bg-red-500/15 text-red-400 border-red-500/25",
  },

  // League statuses
  registration: {
    label: "Registration",
    className: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  },
  draft: {
    label: "Draft",
    className: "bg-gray-500/15 text-gray-400 border-gray-500/25",
  },
  playoffs: {
    label: "Playoffs",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  },
};

function getStatusConfig(status: string): StatusConfig {
  const normalized = status.toLowerCase().replace(/[\s-]/g, "_");
  return (
    STATUS_MAP[normalized] || {
      label: status,
      className: "bg-gray-500/15 text-gray-400 border-gray-500/25",
    }
  );
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, className, ...props }, ref) => {
    const config = getStatusConfig(status);

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
          config.className,
          className
        )}
        {...props}
      >
        {config.label}
      </span>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

export { StatusBadge };
