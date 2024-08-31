"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
 "flex px-1 select-none  pointer-events-none absolute font-normal peer-placeholder-shown:h-0 !overflow-visible truncate leading-tight peer-focus:leading-tight peer-disabled:text-transparent transition-all -top-2 left-4 z-40 bg-background  peer-placeholder-shown:text-sm text-xs peer-focus:text-xs  peer-placeholder-shown:leading-[4] peer-focus:text-primary  peer-disabled:peer-placeholder-shown:text-primary peer-focus:h-4 peer-disabled:h-4"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
