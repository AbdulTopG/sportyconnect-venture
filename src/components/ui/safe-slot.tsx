
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
    // Use type assertion to fix the TypeScript error
    return React.cloneElement(children, {
      ...props,
      // TypeScript needs help understanding that the ref can be assigned
      ref: ref as React.Ref<unknown>,
    });
  }

  // Otherwise, render a div with the props
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

SafeSlot.displayName = "SafeSlot";
