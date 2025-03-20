
import React from 'react';

/**
 * Utility function to ensure that when using asChild with Radix UI components,
 * there is only a single React element as a child.
 * 
 * This helps prevent "React.Children.only expected to receive a single React element child" errors
 * that can occur with improper usage of asChild.
 * 
 * @param children The children to wrap if multiple
 * @returns A single React element
 */
export function useSingleChild(children: React.ReactNode): React.ReactElement {
  // If children is already a valid element, return it
  if (React.isValidElement(children)) {
    return children;
  }
  
  // If we have multiple children or a non-element, wrap it in a fragment
  return <React.Fragment>{children}</React.Fragment>;
}

/**
 * Higher-order component to ensure a component always receives a single child when using asChild
 * 
 * @param Component The component to wrap
 * @returns A wrapped component that ensures a single child for asChild usage
 */
export function withSingleChild<P>(Component: React.ComponentType<P>): React.FC<P> {
  return (props: P) => {
    // @ts-ignore - We need to access children even if not in the props type
    const children = props.children;
    
    if (children && 
        // @ts-ignore - Check for asChild prop
        props.asChild === true) {
      // @ts-ignore - Return component with updated children
      return <Component {...props} children={useSingleChild(children)} />;
    }
    
    return <Component {...props} />;
  };
}
