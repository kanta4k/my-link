import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-0.5 select-none",
          className
        )}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
