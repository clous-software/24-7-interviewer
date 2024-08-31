"use client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { ToastAction } from "@/components/ui/toast"


const ModalShortcuts = ({
}) => {
  const router = useRouter();
  const { toast } = useToast()
  
  return (

      <div className="py-4 w-full flex flex-col items-center justify-center gap-1 rounded-2xl">
        <h3 className="text-2xl text-left font-semibold leading-none mb-4">Keyboard shortcuts for productivity
        </h3>
    {/* Here goes an image for the $10 gift */}
    
        <section className="grid grid-cols-2 mt-5 space-y-2 w-full gap-y-4 gap-x-6">
        <div className="flex justify-between items-center">
            <p>Open Peer</p>
            <div className="flex gap-2 items-center">
              <p className="border rounded-lg p-2">
              ⌘
              </p>
              <p className="border rounded-lg p-2">
              P
              </p>
            </div>

          </div>
          <div className="flex justify-between items-center">
            <p>Go to Boards</p>
            <div className="flex gap-2 items-center">
              <p className="border rounded-lg p-2">
              ⌘
              </p>
              <p className="border rounded-lg p-2">
              B
              </p>
            </div>

          </div>
          <div className="flex justify-between items-center">
            <p>Read Research</p>
            <div className="flex gap-2 items-center">
              <p className="border rounded-lg p-2">
              ⌘
              </p>
              <p className="border rounded-lg p-2">
              R
              </p>
            </div>

          </div>
          <div className="flex justify-between items-center">
            <p>Give feedback</p>
            <div className="flex gap-2 items-center">
              <p className="border rounded-lg p-2">
              ⌘
              </p>
              <p className="border rounded-lg p-2">
              F
              </p>
            </div>

          </div>
    
                  
        </section>
      </div>
  )
}
export default ModalShortcuts;
