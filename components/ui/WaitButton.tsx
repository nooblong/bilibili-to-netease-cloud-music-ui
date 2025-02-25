'use client'

import * as React from "react"
import {Slot} from "@radix-ui/react-slot"

import {cn} from "@/lib/utils"
import {ButtonProps} from "@/components/ui/button";
import {buttonVariants} from "@/components/ui/button";
import {useState} from "react";

const WaitButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
     className, variant, size,
     asChild = false, ...props
   }, ref) => {
    const Comp = asChild ? Slot : "button"
    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 10000)
    };
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        disabled={loading}
        onClick={handleClick}
        {...props}
      >
        {loading ? '加载中...' : props.children}
      </Comp>
    )
  }
)
WaitButton.displayName = "Button"

export {WaitButton}
