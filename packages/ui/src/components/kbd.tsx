import * as React from "react"
import { cn } from "../lib/utils"

/**
 * This component is based on the `kbd` element and supports all of its props
 */
const Kbd = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"kbd">
>(({ children, className, ...props }, ref) => {
  return (
    <kbd
      {...props}
      ref={ref}
      className={cn(
        "inline-flex h-5 w-fit min-w-[20px] items-center justify-center rounded border px-1",
        "bg-muted text-muted-foreground border-muted-foreground",
        "text-xs font-medium",
        className
      )}
    >
      {children}
    </kbd>
  )
})
Kbd.displayName = "Kbd"

export { Kbd }
