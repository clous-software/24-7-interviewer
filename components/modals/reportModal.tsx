"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/router";
import { joinWaitlist } from "@/lib/waitlist";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";

const formSchema = z.object({
  option: z.string(), // Define schema for the selected option
});

const ModalReport = () => {
  const [joinedSuccess, setJoinedSuccess] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      option: "", // Set default value for the selected option
    },
  });

  async function onSubmit() {
    try {
      // Actualiza el estado a 'closed'
      const reportResult = await joinWaitlist(form.getValues("option")); // Pass the selected option to the API call
      if (reportResult.success) { // Asumiendo que joinWaitlist retorna un objeto con una propiedad 'success'
        setJoinedSuccess(true);
        // Puedes mostrar un toast de éxito aquí, si lo deseas
        toast({
          variant: "default",
          title: "Successfully joined our invite waitlist!",
          description: "We will be in contact as soon as we can.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Couldn't join the invite waitlist",
        description: "This email is already on the invite request waitlist.",
        // We need to add 
        action: <ToastAction altText="Contact support" className="bg-secondary text-black hover:bg-secondary"><Link href="https://join.slack.com/t/clouscommunity/shared_invite/zt-2g0jfas4z-wWJdlfVF_1wGAz85~sQWfw">Contact support</Link></ToastAction>,
      });
    }
  }

  const handleOptionClick = (option: string) => {
    form.setValue("option", option); // Set the selected option in the form
    onSubmit(); // Submit the form when an option is selected
  };

  const options = [
    { label: "Animal welfare", value: "Animal welfare" },
    { label: "Data protection and privacy violations", value: "Data protection and privacy violations" },
    { label: "Illegal or harmful speech", value: "Illegal or harmful speech" },
    { label: "Intellectual property infringements", value: "Intellectual property infringements" },
    { label: "Negative effects on civic discourse or elections", value: "Negative effects on civic discourse or elections" },
    { label: "Non-consensual behavior", value: "Non-consensual behavior" },
    { label: "Pornography or sexualized content", value: "Pornography or sexualized content" },
    { label: "Protection of minors", value: "Protection of minors" },
    { label: "Risk for public security", value: "Risk for public security" },
    { label: "Scams and/or fraud", value: "Scams and/or fraud" },
    { label: "Self-harm", value: "Self-harm" },
    { label: "Unsafe, non-compliant or prohibited products", value: "Unsafe, non-compliant or prohibited products" },
    { label: "Violence", value: "Violence" }
  ];
   

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="py-4 flex flex-col items-center justify-center gap-1 rounded-2xl"
      >
        <h3 className="text-2xl text-left font-semibold leading-none mb-4">
          Report illegal content or abuse
        </h3>
        {/* Here goes an image for the $10 gift */}
        {/* Replace the email input field with clickable buttons representing each option */}
        <div className="grid grid-cols-1 w-full border rounded-2xl">

        {options.map((option) => (
          <Button
            key={option.label}
            className="bg-transparent rounded-none text-[#333333] text-sm border-0 divide-y-2 hover:bg-muted/10 rounded-2xl border-b"
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </Button>
        ))}
          </div>
        {/* Add more buttons for each option */}
        <p className="text-xs">
          By clicking Submit you agree to our{" "}
          <Link target="_blank" href="https://www.clous.app/privacy" className="text-primary">
            Privacy Policy.
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default ModalReport;

