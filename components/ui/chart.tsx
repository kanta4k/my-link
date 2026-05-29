"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-tooltip-cursor]:fill-muted [&_.recharts-tooltip-cursor]:opacity-50 [&_.recharts-wrapper]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps extends React.ComponentProps<"div"> {
  active?: boolean
  payload?: Array<{
    color?: string
    dataKey?: string | number
    name?: string | number
    value?: string | number
  }>
  formatter?: (value: string | number | undefined) => React.ReactNode
  labelFormatter?: (label: string | number | undefined) => React.ReactNode
}

function ChartTooltipContent({
  active,
  payload,
  className,
  formatter,
  labelFormatter,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "grid min-w-32 gap-1.5 rounded-lg border bg-background px-2.5 py-2 text-xs shadow-xl",
        className
      )}
    >
      {labelFormatter ? (
        <div className="font-medium">{labelFormatter(payload[0]?.name)}</div>
      ) : null}
      <div className="grid gap-1.5">
        {payload.map((item) => {
          const key = `${item.dataKey || item.name || "value"}`
          const itemConfig = config[key]

          return (
            <div
              key={item.dataKey?.toString() || item.name?.toString()}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">
                  {itemConfig?.label || item.name}
                </span>
              </div>
              <span className="font-mono font-medium tabular-nums text-foreground">
                {formatter
                  ? formatter(item.value)
                  : Number(item.value).toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }
