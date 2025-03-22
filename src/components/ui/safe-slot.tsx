
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

    if (asChild && !isFragment) {
      return (
        <Slot {...props}>
          {React.isValidElement(children) ? 
            React.cloneElement(children, {
              ...(children.props as object),
              ref: ref as React.Ref<HTMLElement>
            }) : 
            children}
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
