"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "./loading-skeleton";
import { EmptyState } from "./empty-state";

export interface ColumnDef<TData> {
  id: string;
  header: string;
  accessorKey?: keyof TData;
  accessorFn?: (row: TData) => React.ReactNode;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  width?: string;
  format?: (value: unknown, row: TData) => React.ReactNode;
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  title?: string;
  subtitle?: string;
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  onRowSelect?: (selectedRows: TData[]) => void;
  onExportCsv?: () => void;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<TData extends Record<string, unknown>>({
  columns,
  data,
  title,
  subtitle,
  pageSize = 8,
  searchable = true,
  searchPlaceholder = "Search records...",
  selectable = false,
  onRowSelect,
  onExportCsv,
  isLoading = false,
  emptyTitle = "No Records Found",
  emptyMessage = "No matching rows found in the current dataset.",
  className,
}: DataTableProps<TData>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? "").toLowerCase().includes(q)
      )
    );
  }, [data, searchQuery]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    const col = columns.find((c) => c.id === sortColumn);
    if (!col) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = col.accessorKey ? a[col.accessorKey] : undefined;
      const bVal = col.accessorKey ? b[col.accessorKey] : undefined;

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (colId: string) => {
    if (sortColumn === colId) {
      if (sortDirection === "asc") setSortDirection("desc");
      else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(colId);
      setSortDirection("asc");
    }
  };

  const handleToggleRow = (idx: number, row: TData) => {
    const updated = new Set(selectedIds);
    if (updated.has(idx)) updated.delete(idx);
    else updated.add(idx);
    setSelectedIds(updated);
    if (onRowSelect) {
      onRowSelect(Array.from(updated).map((i) => data[i]));
    }
  };

  const handleExportCsv = () => {
    if (onExportCsv) {
      onExportCsv();
      return;
    }
    // Default CSV exporter
    if (!data.length) return;
    const headers = columns.map((c) => c.header).join(",");
    const rows = sortedData.map((row) =>
      columns
        .map((c) => {
          const val = c.accessorKey ? row[c.accessorKey] : "";
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title?.toLowerCase().replace(/\s+/g, "_") || "dataset"}_export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <TableSkeleton rows={pageSize} cols={columns.length} />;
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface overflow-hidden shadow-xs flex flex-col justify-between",
        className
      )}
    >
      {/* Table Header & Controls */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-3 flex-wrap bg-surface-elevated">
        <div className="space-y-0.5">
          {title && (
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {searchable && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="h-8 pl-8 pr-3 rounded-lg bg-surface border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary/60 font-medium"
              />
            </div>
          )}

          <button
            onClick={handleExportCsv}
            className="h-8 px-2.5 rounded-lg bg-surface border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse" role="table">
          <thead className="bg-surface-elevated/70 text-muted-foreground border-b border-border sticky top-0 select-none">
            <tr>
              {selectable && (
                <th className="p-3 w-8 text-center">
                  <span className="sr-only">Select</span>
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortColumn === col.id;
                return (
                  <th
                    key={col.id}
                    style={{ width: col.width }}
                    onClick={() => col.sortable !== false && handleSort(col.id)}
                    className={cn(
                      "p-3 font-semibold text-[11px] tracking-wider uppercase",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.sortable !== false && "cursor-pointer hover:text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5",
                        col.align === "right" && "justify-end"
                      )}
                    >
                      <span>{col.header}</span>
                      {col.sortable !== false && (
                        <span className="text-muted-foreground">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ChevronUp className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-primary" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center"
                >
                  <EmptyState
                    title={emptyTitle}
                    description={emptyMessage}
                    icon={Database}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => {
                const isSelected = selectedIds.has(rIdx);
                return (
                  <tr
                    key={rIdx}
                    className={cn(
                      "transition-colors hover:bg-surface-elevated/50",
                      isSelected && "bg-primary/5"
                    )}
                  >
                    {selectable && (
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRow(rIdx, row)}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const rawValue = col.accessorKey
                        ? row[col.accessorKey]
                        : col.accessorFn
                        ? col.accessorFn(row)
                        : null;

                      const rendered = col.format
                        ? col.format(rawValue, row)
                        : rawValue;

                      return (
                        <td
                          key={col.id}
                          className={cn(
                            "p-3 text-foreground whitespace-nowrap",
                            col.align === "right" && "text-right tabular-nums",
                            col.align === "center" && "text-center"
                          )}
                        >
                          {rendered !== undefined && rendered !== null
                            ? (rendered as React.ReactNode)
                            : "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Count Footer */}
      <div className="p-3 border-t border-border bg-surface-elevated flex items-center justify-between text-xs text-muted-foreground font-mono">
        <div>
          Showing {paginatedData.length ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 w-7 rounded-md border border-border bg-surface flex items-center justify-center hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium text-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 w-7 rounded-md border border-border bg-surface flex items-center justify-center hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
