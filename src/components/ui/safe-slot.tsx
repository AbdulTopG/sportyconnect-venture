
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

interface SafeSlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  asChild?: boolean;
}

/**
 * SafeSlot component that safely handles the Radix UI Slot component
 * with proper TypeScript typing to avoid ref forwarding issues with fragment children
 */
const SafeSlot = React.forwardRef<HTMLDivElement, SafeSlotProps>(
  ({ children, asChild = false, ...props }, ref) => {
    // Don't forward ref for fragments or primitive values
    const isFragment = 
      React.isValidElement(children) && 
      (children.type === React.Fragment || typeof children.type !== 'function');

    if (asChild && !isFragment && React.isValidElement(children)) {
      return (
        <Slot {...props}>
          {React.cloneElement(children, {
            ...children.props,
            // Only add ref if it's a valid element that can accept refs
            ...(typeof children.type !== 'string' ? { ref } : {})
          })}
        </Slot>
      );
    }

    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

SafeSlot.displayName = "SafeSlot";

export { SafeSlot };
