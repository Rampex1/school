"use client";

import * as React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export interface ColumnDef<T> {
  /** Unique key for this column, also used as the accessor into the row data */
  key: string;
  /** Header label displayed in the table head */
  header: string;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Custom cell renderer. Receives the row data. */
  cell?: (row: T) => React.ReactNode;
  /** Additional className for the header cell */
  headerClassName?: string;
  /** Additional className for the body cell */
  cellClassName?: string;
}

export interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Array of data rows */
  data: T[];
  /** Optional key extractor for unique row keys. Defaults to index. */
  getRowKey?: (row: T, index: number) => string | number;
  /** Called when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Message to show when data is empty */
  emptyMessage?: string;
}

type SortDirection = "asc" | "desc" | null;

interface SortState {
  key: string;
  direction: SortDirection;
}

function DataTableInner<T extends Record<string, unknown>>(
  {
    columns,
    data,
    getRowKey,
    onRowClick,
    emptyMessage = "No data available.",
    className,
    ...props
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [sort, setSort] = React.useState<SortState>({
    key: "",
    direction: null,
  });

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      if (prev.direction === "desc") return { key: "", direction: null };
      return { key, direction: "asc" };
    });
  };

  const sortedData = React.useMemo(() => {
    if (!sort.key || !sort.direction) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sort.direction === "desc" ? -comparison : comparison;
    });
  }, [data, sort]);

  const getSortIcon = (key: string) => {
    if (sort.key !== key || !sort.direction) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground/50" />;
    }
    if (sort.direction === "asc") {
      return <ArrowUp className="h-4 w-4" />;
    }
    return <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div ref={ref} className={cn("rounded-md border", className)} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  col.sortable && "cursor-pointer select-none",
                  col.headerClassName
                )}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <div className="flex items-center gap-2">
                  {col.header}
                  {col.sortable && getSortIcon(col.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, index) => (
              <TableRow
                key={getRowKey ? getRowKey(row, index) : index}
                className={cn(onRowClick && "cursor-pointer")}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.cellClassName}>
                    {col.cell
                      ? col.cell(row)
                      : (row[col.key] as React.ReactNode) ?? ""}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// forwardRef with generics requires a cast
export const DataTable = React.forwardRef(DataTableInner) as <
  T extends Record<string, unknown>
>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

(DataTable as { displayName?: string }).displayName = "DataTable";
