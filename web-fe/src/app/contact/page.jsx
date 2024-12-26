import ContactForm from "@/forms/contact";
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

export default function Page() {
  return (
    <div className="space-y-10">
      {/* bread crumbs */}
      <div className="flex h-52 flex-col items-center justify-center gap-2 bg-primary-50">
        <H1 className={"text-center"}>Contact Us</H1>
        <div className="flex items-center justify-center">
          <BreadCrumb />
        </div>
      </div>

      {/* main */}
      <div className="container py-10 pb-20">
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
      </div>
    </div>
  );
}

function MeetUs() {
  return (
    <div>
      <Large>Meet Us</Large>
      <ul className="space-y-3 rounded-lg bg-primary-25 p-4">
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
