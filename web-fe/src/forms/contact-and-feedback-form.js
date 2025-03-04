"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import ContactForm from "./contact";
import FeedbackForm from "./feedback";
import { H1, H2, H3, Muted } from "@/components/ui/typography";

export default function ContactAndFeedbackForm() {
  const [isRightPanelActive, setRightPanelActive] = useState(false);
  return (
    <div className="relative mx-auto h-[calc(100vh-20vh)] overflow-hidden rounded-lg bg-gradient-to-r from-gradient-from to-gradient-to shadow-lg">
      <div
        className={cn(
          `duration-600 absolute left-0 top-0 z-20 flex h-full w-1/2 flex-col items-center justify-center gap-2 transition-transform ease-in-out`,
          { "translate-x-full opacity-0": isRightPanelActive },
        )}
      >
        <H2 className={"border-none text-4xl font-extrabold lg:text-5xl "}>
          Feedback
        </H2>
        <Muted className={"text-balance text-center"}>
          We value your feedback! Share your thoughts to help us improve our
          services. Let us know what you liked or what we can do better.
        </Muted>
        <Button onClick={() => setRightPanelActive(true)}>Feedback</Button>
      </div>
      <div
        className={cn(
          `duration-600 absolute left-0 top-0 z-10 flex h-full w-1/2 flex-col items-center justify-center gap-2 opacity-0 transition-opacity ease-in-out`,
          { "z-50 translate-x-full opacity-100": isRightPanelActive },
        )}
      >
        <H2 className={"border-none text-4xl font-extrabold lg:text-5xl "}>
          Contact Us
        </H2>
        <Muted className={"text-balance text-center"}>
          Have questions or need assistance? Get in touch with us! Fill out the
          form, and our team will get back to you as soon as possible.
        </Muted>
        <Button onClick={() => setRightPanelActive(false)}>Contact Us</Button>
      </div>
      <div
        className={cn(
          `duration-600 z-100 absolute left-1/2 top-0 h-full w-1/2 overflow-hidden transition-transform ease-in-out`,
          { "-translate-x-full": isRightPanelActive },
        )}
      >
        <div
          className={cn(
            `duration-600 relative left-[-100%] h-full w-[200%] transform bg-white bg-cover bg-left-top bg-no-repeat text-white transition-transform ease-in-out`,
            { "translate-x-1/2": isRightPanelActive },
          )}
        >
          <div
            className={cn(
              `duration-600 -translate-x-1/5 absolute top-0 flex h-full w-1/2 transform flex-col items-center justify-center p-10 text-center transition-transform ease-in-out`,
              { "translate-x-0": isRightPanelActive },
            )}
          >
            <FeedbackForm />
          </div>
          <div
            className={cn(
              `duration-600 absolute right-0 top-0 flex h-full w-1/2 translate-x-0 transform flex-col items-center justify-center p-10 text-center transition-transform ease-in-out`,
              { "translate-x-1/5": isRightPanelActive },
            )}
          >
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
