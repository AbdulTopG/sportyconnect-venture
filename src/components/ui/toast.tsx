import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { SafeSlot } from './safe-slot';

// For Toast components using asChild, use SafeSlot instead of the regular Slot
// This ensures that React.Children.only() always receives a single valid element

// Example usage would be:
// <ToastAction asChild>
//   <Button>Action</Button> {/* Single child element */}
// </ToastAction>

// Not:
// <ToastAction asChild>
//   Click <span>here</span> {/* Multiple children */}
// </ToastAction>

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
