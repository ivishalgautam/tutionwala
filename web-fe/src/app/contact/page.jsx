import ContactForm from "@/components/forms/contact";
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
import React from "react";

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
        <div className="mx-auto grid max-w-5xl gap-4 rounded-lg bg-white p-8 md:grid-cols-2">
          <div className="grid grid-rows-3 gap-3">
            <div className="order-2 row-span-2 overflow-hidden rounded-lg shadow-lg md:order-1">
              <MapIFrame />
            </div>
            <div className="order-1 row-span-1 md:order-2">
              <MeetUs />
            </div>
          </div>
          <div className="pt-10 md:pt-0">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function MapIFrame() {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.468332874635!2d77.28399527495618!3d28.615722584844846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3588836f4bd%3A0x28a9c8ce5f2624d6!2sSamaspur%20Rd%2C%20Delhi%2C%20110091!5e0!3m2!1sen!2sin!4v1728902304257!5m2!1sen!2sin"
      allowFullscreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-full w-full"
    ></iframe>
  );
}

function MeetUs() {
  return (
    <>
      <Large>Meet Us</Large>
      <ul className="space-y-3 rounded-lg bg-primary-25 p-4">
        <li className="flex items-start justify-start gap-2">
          <Phone size={20} className="text-primary" />
          <span className="text-sm font-medium">+91 9535133513</span>
        </li>
        <li className="flex items-start justify-start gap-2">
          <Mail size={20} className="text-primary" />
          <span className="text-sm font-medium">tech.tutionwala@gmail.com</span>
        </li>
        <li className="flex items-start justify-start gap-2">
          <MapPin size={25} className="text-primary" />
          <span className="text-sm font-medium">
            F 314, Street No 8, Samaspur Road, Pandav Nagar, New Delhi, 110091
          </span>
        </li>
      </ul>
    </>
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