import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="field-group" className={cn("flex flex-col gap-6", className)} {...props} />
  )
}

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="field" className={cn("grid gap-2", className)} {...props} />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn(className)} {...props} />
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FieldSeparator({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      className={cn("relative text-center text-sm", className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2 -translate-y-1/2" />
      {children ? (
        <span className="bg-background text-muted-foreground relative px-2">
          {children}
        </span>
      ) : null}
    </div>
  )
}

export { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator }
