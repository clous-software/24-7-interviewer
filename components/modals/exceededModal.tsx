"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { joinWaitlist } from "@/app/api/waitlist/route"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { ToastAction } from "@/components/ui/toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
})
type JobData = {
  status: string;
};

const ModalExceeded = ({
}) => {
  const router = useRouter();
  const [joinedSuccess, setJoinedSuccess] = useState(false);
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      mixpanel.track("Invite Request");
      // Actualiza el estado a 'closed'
      const waitlistResult = await joinWaitlist(values.email);
      if (waitlistResult.success) {  // Asumiendo que joinWaitlist retorna un objeto con una propiedad 'success'
        setJoinedSuccess(true);
        // Puedes mostrar un toast de éxito aquí, si lo deseas
        toast({
          variant: "default",
          title: "Successfully joined our invite waitlist!",
          description: "We will be in contact as soon as we can.",
        });
      }
    
    }catch (error) {

      toast({
        variant: "destructive",
        title: "Couldn't join the invite waitlist",
        description: "This email is already on the invite request waitlist.",
        // We need to add 
        action: <ToastAction altText="Contact support" className="bg-secondary text-black hover:bg-secondary"><Link href="https://join.slack.com/t/clouscommunity/shared_invite/zt-2g0jfas4z-wWJdlfVF_1wGAz85~sQWfw">Contact support</Link></ToastAction>,

      });
    }
  }
  
  

  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 flex flex-col items-center justify-center gap-1 rounded-2xl">
        <h3 className="text-xl text-center font-semibold leading-none mb-4">You&apos;ve reached your daily usage limit, but you can request an invite by joining the waitlist
</h3>
{/* Here goes an image for the $10 gift */}
<img src="https://clous.s3.eu-west-3.amazonaws.com/images/ResourcesImage.png" className="h-[20rem] w-full rounded-2xl"></img>
    {joinedSuccess ? (
        <div className="items-center text-left gap-4 mt-4 w-full">
          <h3 className="text-xl font-semibold">Thank you for your interest</h3>
        <p className="text-base mt-1 mb-4">It means the world to us that people are actually interested in our solution. We&apos;ll be reaching out soon to see how we can help you. </p>
          <Button onClick={() => router.push('/')} className="w-full rounded-full">Back to Home</Button>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
      <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <section className="relative w-full">
                    <FormControl>
                    <Input placeholder=" " {...field} />
                    </FormControl>
                    <FormLabel>Work email</FormLabel>
                  </section>
                </FormItem>
              )}
            />
            <p className="text-xs">By clicking Submit you agree to our <Link target="_blank" href="https://www.clous.app/privacy" className="text-primary"> Privacy Policy.</Link></p>
        <Button type="submit" className="w-full cursor-pointer">Submit</Button>
        </div>
            )}
      </form>
    </Form>
  )
}
export default ModalExceeded;
