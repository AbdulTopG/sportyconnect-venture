
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

interface SafeSlotProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

/**
 * SafeSlot is a wrapper around Radix UI's Slot component that ensures
 * it always receives a single child when asChild is true, preventing
 * "React.Children.only expected to receive a single React element child" errors.
 */
const SafeSlot = React.forwardRef<
  HTMLDivElement,
  SafeSlotProps
>(({ children, asChild = false, ...props }, ref) => {
  // Only apply special handling when asChild is true
  if (asChild) {
    // Ensure we have a single child when using asChild
    const child = React.Children.toArray(children).length === 1
      ? React.Children.only(children as React.ReactElement)
      : <span>{children}</span>
    
    return <Slot {...props} ref={ref}>{child}</Slot>
  }
  
  // When not using asChild, pass through as normal
  return <div {...props} ref={ref}>{children}</div>
})
SafeSlot.displayName = "SafeSlot"

export { SafeSlot }
