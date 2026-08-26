"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Table, TableBody, TableHeader } from "@/components/ui/table"

export function DataTable<T>({
  data,
  header,
  renderRow,
  emptyMessage,
  pageSizeOptions = [10, 25, 50],
}: {
  data: T[]
  header: React.ReactNode
  renderRow: (item: T) => React.ReactNode
  emptyMessage: string
  pageSizeOptions?: number[]
}) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])

  if (data.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const pageData = data.slice(start, start + pageSize)
  const desde = start + 1
  const hasta = Math.min(start + pageSize, data.length)

  return (
    <div className="flex flex-col">
      <Table>
        <TableHeader>{header}</TableHeader>
        <TableBody>{pageData.map(renderRow)}</TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-end gap-4 border-t border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <label className="font-label-mono text-xs text-muted-foreground" htmlFor="filas-por-pagina">
            Filas por página
          </label>
          <select
            id="filas-por-pagina"
            className="cursor-pointer rounded-lg border border-white/10 bg-card px-2 py-1 text-xs outline-none focus:border-primary"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <span className="font-label-mono text-xs text-muted-foreground">
          {desde}–{hasta} de {data.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md border border-white/10 text-muted-foreground hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="font-label-mono w-16 text-center text-xs text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md border border-white/10 text-muted-foreground hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            aria-label="Página siguiente"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
