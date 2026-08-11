"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { ChevronDownIcon, CheckIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type Option = { value: string; label: string }

function toOptions(items: Record<string, string>): Option[] {
  return Object.entries(items).map(([value, label]) => ({ value, label }))
}

function Combobox({
  items,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  children,
}: {
  items: Record<string, string>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
  children: React.ReactNode
}) {
  const options = React.useMemo(() => toOptions(items), [items])
  const findOption = React.useCallback(
    (v: string | undefined) => options.find((o) => o.value === v) ?? null,
    [options]
  )

  return (
    <ComboboxPrimitive.Root
      items={options}
      itemToStringValue={(item: Option | null) => item?.value ?? ""}
      autoHighlight
      name={name}
      disabled={disabled}
      value={value !== undefined ? findOption(value) : undefined}
      defaultValue={defaultValue !== undefined ? findOption(defaultValue) : undefined}
      onValueChange={(item: Option | null) => onValueChange?.(item?.value ?? "")}
    >
      {children}
    </ComboboxPrimitive.Root>
  )
}

function ComboboxTrigger({
  className,
  id,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return (
    <ComboboxPrimitive.Trigger
      id={id}
      data-slot="combobox-trigger"
      className={cn(
        "flex h-8 w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxValue({ placeholder }: { placeholder?: string }) {
  return (
    <ComboboxPrimitive.Value>
      {(selected: Option | null) => (
        <span className="flex-1 truncate text-left">
          {selected ? selected.label : (placeholder ?? "")}
        </span>
      )}
    </ComboboxPrimitive.Value>
  )
}

function ComboboxContent({
  className,
  emptyText = "No se encontraron resultados.",
  searchPlaceholder = "Buscar...",
}: {
  className?: string
  emptyText?: string
  searchPlaceholder?: string
}) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side="bottom"
        sideOffset={4}
        align="start"
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            "isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-56 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
        >
          <div className="flex items-center gap-2 border-b border-border px-2.5 py-2">
            <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <ComboboxPrimitive.Input
              placeholder={searchPlaceholder}
              className="h-5 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ComboboxPrimitive.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
            {emptyText}
          </ComboboxPrimitive.Empty>
          <ComboboxPrimitive.List className="max-h-64 overflow-x-hidden overflow-y-auto scroll-my-1 p-1">
            {(item: Option) => (
              <ComboboxPrimitive.Item
                key={item.value}
                value={item}
                className="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1.5 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
              >
                <span className="flex-1 truncate">{item.label}</span>
                <ComboboxPrimitive.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
                  <CheckIcon className="size-3.5" />
                </ComboboxPrimitive.ItemIndicator>
              </ComboboxPrimitive.Item>
            )}
          </ComboboxPrimitive.List>
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

export { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent }
