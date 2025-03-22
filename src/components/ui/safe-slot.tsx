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
    // Handle differently based on the type of the child component
    if (children.type === React.Fragment) {
      // Don't try to forward ref to Fragment
      return React.cloneElement(children, props);
    }
    
    // For regular components, clone with props and ref
    return React.cloneElement(children, {
      ...props,
      ref: ref as React.Ref<unknown>, // Cast to help TypeScript
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
