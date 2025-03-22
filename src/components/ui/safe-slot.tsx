
import React, { type ComponentPropsWithoutRef } from "react";

type ComponentWithAsChild = {
  asChild?: boolean;
}

// This is a utility component for shadcn components that use the "asChild" prop pattern
export const SafeSlot = React.forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & ComponentWithAsChild
>(({ asChild, children, ...props }, ref) => {
  // When asChild is true, clone the child and pass it the props
  if (asChild && React.isValidElement(children)) {
    // Pass the ref and props to the child element
    return React.cloneElement(
      children,
      {
        ...props,
        // For ref forwarding to work correctly with any component
        ref: (children.type === React.Fragment)
          ? undefined 
          : ((val: unknown) => {
              // Handle function refs
              if (typeof ref === "function") ref(val);
              // Handle object refs
              else if (ref !== null) (ref as React.MutableRefObject<unknown>).current = val;
            })
      }
    );
  }

  // Otherwise, render a div with the props
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

SafeSlot.displayName = "SafeSlot";
