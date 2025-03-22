
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport, ToastAction } from "./toast-primitives"

// Define types from the primitives for export
type ToastActionElement = React.ReactElement<typeof ToastAction>
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

export {
  type ToastProps,
  type ToastActionElement,
  Toast,
  ToastAction,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
}
