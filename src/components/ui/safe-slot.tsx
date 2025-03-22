
import React, { type ComponentPropsWithoutRef, forwardRef, isValidElement, cloneElement } from "react";

type ComponentWithAsChild = {
  asChild?: boolean;
}

// This is a utility component for shadcn components that use the "asChild" prop pattern
export const SafeSlot = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & ComponentWithAsChild
>(({ asChild, children, ...props }, ref) => {
  // When asChild is true, clone the child and pass it the props
  if (asChild && isValidElement(children)) {
    // Pass the props to the child element, but handle ref separately
    return cloneElement(
      children,
      {
        ...props,
        // Only forward ref if it's not a fragment
        ...(children.type !== React.Fragment && {
          ref: (val: unknown) => {
            // Handle function refs
            if (typeof ref === "function") ref(val as HTMLDivElement);
            // Handle object refs
            else if (ref !== null) (ref as React.MutableRefObject<HTMLDivElement>).current = val as HTMLDivElement;
          }
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
