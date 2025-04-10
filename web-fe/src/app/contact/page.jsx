import ContactForm from "@/forms/complain-us";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { H1, Large } from "@/components/ui/typography";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import config from "@/config";
import FeedbackForm from "@/forms/feedback";
import ContactAndFeedbackForm from "@/forms/contact-and-feedback-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="space-y-10">
      {/* bread crumbs */}
      <div className="flex h-32 flex-col items-center justify-center gap-2 bg-white">
        <H1 className={"text-center"}>Contact Us</H1>
        <div className="flex items-center justify-center">
          <BreadCrumb />
        </div>
      </div>

      {/* main */}
      {/* <div className="container py-10 pb-20">
        <div className="mx-auto max-w-5xl space-y-4 rounded-lg bg-white p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-primary p-10 py-6 md:-mt-12">
              <ContactForm />
            </div>
            <div className="rounded-lg bg-primary p-10 py-6 md:-mt-12">
              <FeedbackForm />
            </div>
          </div>
          <MeetUs />
        </div>
      </div> */}

      <div className="container pb-20">
        <div className="block md:hidden">
          <FormWithTabs />
        </div>

        <div className="hidden md:block">
          <ContactAndFeedbackForm />
        </div>
        <div className="mt-4">
          <MeetUs />
        </div>
      </div>
    </div>
  );
}

function FormWithTabs() {
  return (
    <Tabs defaultValue="contact" className="bg-white">
      <TabsList className="flex bg-gray-50">
        <TabsTrigger
          value="contact"
          className="w-full data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Contact
        </TabsTrigger>
        <TabsTrigger
          value="feedback"
          className="w-full data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          Feedback
        </TabsTrigger>
      </TabsList>
      <TabsContent value="contact" className="p-8">
        <ContactForm />
      </TabsContent>
      <TabsContent value="feedback" className="p-8">
        <FeedbackForm />
      </TabsContent>
    </Tabs>
  );
}

function MeetUs() {
  return (
    <div className="space-y-3 rounded-lg bg-white p-4 shadow-lg">
      <Large>Meet Us</Large>
      <ul className="space-y-2">
        <li className="flex items-start justify-start gap-2">
          <Phone size={20} className="text-primary" />
          <span className="text-sm font-medium">{config.phone}</span>
        </li>
        <li className="flex items-start justify-start gap-2">
          <Mail size={20} className="text-primary" />
          <span className="text-sm font-medium">{config.email}</span>
        </li>
        <li className="sr-only flex items-start justify-start gap-2">
          <MapPin size={25} className="text-primary" />
          <span className="text-sm font-medium">
            F 314, Street No 8, Samaspur Road, Pandav Nagar, New Delhi, 110091
          </span>
        </li>
      </ul>
    </div>
  );
}

function BreadCrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Contact Us</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
