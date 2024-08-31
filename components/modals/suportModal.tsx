"use client"
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import FileInputButton from "@/components/ui/FileInputButton";
import Image from "next/image";
import { ArrowUpRight, Minus, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { IoHelpCircleOutline, IoCalendarOutline, IoFlag } from "react-icons/io5";
import { FaKeyboard } from "react-icons/fa6";
import { GrHelpBook } from "react-icons/gr";
import { IoChatbubblesOutline } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import ModalShortcuts from "./shortcutsModal";
import ModalReport from "./reportModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { LuExternalLink } from "react-icons/lu";
import Link from "next/link"

// Define a type for the possible values of type_account
type TypeAccount = "I need help using ClousH" | "I need help with my account" | "I need to report an issue";

const formSchema = z.object({
  subject: z.string().min(5, { message: "Must be 5 or more characters long" }),
  reason: z.enum(
    ["I need help using ClousH", "I need help with my account", "I need to report an issue"]
    ),
  message: z.string().min(10, { message: "Must be 10 or more characters long" }),
  images: z.array(z.string()).nullable().refine((images) => !images || images.length <= 4, {
    message: "You can only upload up to 4 images",
  }),
});


const SupportModal = () => {
  const trackButtonClick = (Property: any) => {
    mixpanel.track('Trigger', {
    Name : Property,
    Property: Property, });
  };
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isShortcuts, setIsShortcuts] = useState(false);
  const [isReportContent, setIsReportContent] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false); 
  const [isSupportFormOpen, setIsSupportFormOpen] = useState(false); 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selected = Array.from(files).slice(0, 4);
      setSelectedImages(selected);
      form.setValue("images", selected.map((file) => URL.createObjectURL(file)));
    }
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "" as TypeAccount, // Provide a default value based on your use case
      subject:"",
      message:"",
      images: [], // Puedes inicializar con un array vacío
    },
  });

  const typeAccountOptions: TypeAccount[] = ["I need help using ClousH", "I need help with my account", "I need to report an issue"];



  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Manejar la respuesta del backend según sea necesario
      console.log(values);
      setFormSubmitted(true); // Cambia el estado a formulario enviado

      // Mostrar un mensaje de éxito

    } catch (error) {
      // Manejar errores de la solicitud
      console.error("Error creating user:", error);

      // Mostrar un mensaje de error
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-background">{JSON.stringify(values, null, 2)}</code>
          </pre>
        ),
      });

    }
  };
  
  const handleIconClick = () => {
    setIsSectionVisible(!isSectionVisible);
    trackButtonClick("Support"); // Llama a trackButtonClick con el nombre del evento
  };

  const handleCallTeam = () => {
    setIsMinimized(false);
    setIsSchedulingOpen(true);
  };

  const handleSupportForm = () => {
    setIsMinimized(false);
    setIsSupportFormOpen(true);
  };
  
  const handleCloseClick = () => {
    setIsSectionVisible(false);
    setIsMinimized(false); // Ensure the card is maximized when closed
  };

  const handleMinimizeClick = () => {
    setIsMinimized(true);
  };

  const handleMaximizeClick = () => {
    setIsMinimized(false);
  };

  const handleReportContent = () => {
    if (!isReportContent) {
      setIsReportContent(true);
    } else {
      setIsReportContent(false);
    }
  };

  const handleShortcuts = () => {
    if (!isShortcuts) {
      setIsShortcuts(true);
    } else {
      setIsShortcuts(false);
    }
  };

  return (
    <>
    {isShortcuts && (<Dialog defaultOpen>
            <DialogTrigger asChild >
              
            </DialogTrigger>
            <DialogContent className="px-8 py-5 z-50">
              <ModalShortcuts />
              {/* This Should be to Modal Exceeded with Additional Usage they claim if they input their email */}
            </DialogContent>
          </Dialog>)}
          {isReportContent && (<Dialog defaultOpen>
            <DialogTrigger asChild >
              
            </DialogTrigger>
            <DialogContent className="px-8 py-5 z-50">
              <ModalReport />
              {/* This Should be to Modal Exceeded with Additional Usage they claim if they input their email */}
            </DialogContent>
          </Dialog>)}
    <main>        
        <Card
          className={`fixed lg:bottom-4 lg:top-auto lg:block hidden right-4 rounded-2xl z-40 border-0 ${
            isMinimized ? "minimized rounded-full" : "w-[28rem]"
          }`}
        >
          <CardContent className={`flex z-10 font-medium justify-between py-2 border-t border-l border-r w-full items-center ${isMinimized ? "px-2 border-b rounded-full" : "px-6 rounded-t-3xl"}`}>
          <h3 className={` ${
            isMinimized ? "hidden" : "text-xl my-2"
          } ${isSupportFormOpen ? "" : "hidden"}`}>Ready to help!</h3>
          <h3 className={` ${
            isMinimized ? "hidden" : "text-xl my-2"
          } ${isSchedulingOpen ? "" : "hidden"}`}>See you in 15 minutes!</h3>
          <div className="flex gap-3">
              {isMinimized ? (
                <>
                <Popover>
                  <PopoverTrigger asChild>
                  <div className="cursor-pointer h-full w-full" >
                         <IoHelpCircleOutline  className="w-5 h-5" />
                </div>
                                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-2 rounded-2xl">
                    <div className="flex flex-col gap-2">
                    <Link href="https://clous.substack.com/" target="_blank" className="flex cursor-pointer items-center gap-2 py-1.5 px-3 rounded-lg w-full hover:bg-muted/10 transition:hover duration-200 delay-100">
                            <LuExternalLink />
                            Release notes
                        
                        </Link>
                        <Link href="https://www.clous.app/terms" target="_blank" className="flex cursor-pointer items-center gap-2 py-1.5 px-3 rounded-lg w-full hover:bg-muted/10 transition:hover duration-200 delay-100">
                            <LuExternalLink />
                            Terms and policies
                        
                        </Link>
                        <div onClick={handleSupportForm} className="flex cursor-pointer items-center gap-2 py-1.5 px-3 rounded-lg w-full hover:bg-muted/10 transition:hover duration-200 delay-100">
                            <GrHelpBook />
                            User support
                        </div>
                        <Link href="https://join.slack.com/t/clouscommunity/shared_invite/zt-2g0jfas4z-wWJdlfVF_1wGAz85~sQWfw " target="_blank" className="flex cursor-pointer items-center gap-2 py-1.5 px-3 rounded-lg w-full hover:bg-muted/10 transition:hover duration-200 delay-100">
                            <IoChatbubblesOutline />
                            Chat with the founders
                        
                        </Link>
                        <div onClick={handleCallTeam} className="flex cursor-pointer items-center gap-2 py-1.5 px-3 rounded-lg w-full hover:bg-muted/10 transition:hover duration-200 delay-100">
                            <IoCalendarOutline />
                            Call the team
                        
                        </div>
                        <div className="flex cursor-pointer items-center gap-2 py-1.5 px-3 rounded-lg w-full hover:bg-muted/10 transition:hover duration-200 delay-100" onClick={handleShortcuts}>
                        <FaKeyboard />

                            Keyboard shortcuts
                        
                        </div>
                        <div className="flex hidden cursor-pointer items-center gap-2 py-1.5 px-3 rounded-lg w-full hover:bg-muted/10 transition:hover duration-200 delay-100" onClick={handleReportContent}>
                            <IoFlag />
                            Report content
                        
                        </div>
                        
                    </div>
                  </PopoverContent>
                </Popover>
                
                </>
              ) : (
                <>
                <Minus onClick={handleMinimizeClick} className="cursor-pointer my-2 w-4 h-4" />
                <X onClick={handleCloseClick} className="hidden cursor-pointer my-2 w-4 h-4" />
                </>
              )}
            </div>
            
          </CardContent>
          {!isMinimized && isSchedulingOpen && (
                      <CardContent className="min-h-[20rem] border rounded-2xl rounded-t-none p-0 overflow-hidden">
                      <iframe src="https://zcal.co/i/aYQocCkR?embed=1&embedType=iframe" loading="lazy" className="border-none w-full h-full min-h-[30rem] overflow-none bg-transparent" id="zcal-invite"></iframe>
                      </CardContent>
          )}
          {!isMinimized && isSupportFormOpen && (
            <CardContent className="border rounded-2xl rounded-t-none">
               <Form {...form}>
    {formSubmitted ? ( // Si el formulario se ha enviado, muestra el mensaje de agradecimiento
          <div>
          <h3 className="text-xl font-semibold">We heard you out loud!</h3>
          <p className="text-lg">
          We will work tirelessly to solve your issue.
          </p>
        </div>
        ) : (
         
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mt-2 text-muted w-full h-full"
      >
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
             <section>
                <Select
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select the reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    {typeAccountOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                
                </SelectContent>
              </Select>
              </section>
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <section className="relative ">
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormLabel>Subject</FormLabel>
              </section>
            </FormItem>
          )}
        />
<FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <section className="relative ">
                <FormControl>
                  <Textarea rows={5} placeholder="" {...field} />
                </FormControl>
                <FormLabel>How can we help?</FormLabel>
              </section>
            </FormItem>
          )}
        />



        <div className="bg-muted/5 h-20 border border-primary border-dashed rounded-2xl flex items-center justify-center text-sm gap-2">
            <FileInputButton onChange={handleImageChange} />
            </div>
        <div className="flex flex-wrap gap-2">
          {selectedImages.map((image, index) => (
            <Image width={60} height={60}
            key={index}
            src={URL.createObjectURL(image)}
            alt={`Selected Image ${index + 1}`}
            className="rounded-lg cover"
            />
            ))}
        </div>
<div className="flex mt-2">
  

<Button type="submit" className="text-lg font-semibold ">Submit</Button>
</div>

      </form>
       )}
    </Form>
            </CardContent>
          )}
        </Card>
    </main>
    </>
  );
};

export default SupportModal;