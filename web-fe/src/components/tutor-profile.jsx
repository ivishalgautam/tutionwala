"use client";
import EnquiryForm from "@/forms/enquiry";
import Review from "@/components/review";
import { H3, H4, Muted } from "@/components/ui/typography";
import Image from "next/image";
import DialogEnquiryForm from "@/forms/enquiry-dialog";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  GraduationCap,
  Languages,
  MapPin,
  MonitorPlay,
  User,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MapStatic from "@/components/map-static";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";

export default function TutotProfile({
  tutorId,
  user: tutor,
  courses,
  avg_ratings,
  total_reviews,
  ...teacher
}) {
  const [fullAddr, setFullAddr] = useState("");
  return (
    <>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col items-start gap-6 rounded-lg border bg-white p-6 md:flex-row">
            <div className="flex size-36 items-center justify-center rounded-full bg-primary/10 text-primary">
              <figure className="">
                <Image
                  src={tutor.profile_picture}
                  width={150}
                  height={150}
                  alt={tutor.fullname}
                  className={
                    "h-full w-full rounded-full object-cover object-center shadow-lg"
                  }
                />
              </figure>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{tutor.fullname}</h1>
                <Badge variant="outline" className="ml-2">
                  {teacher.type.charAt(0).toUpperCase() + teacher.type.slice(1)}
                </Badge>
              </div>
              <Review rating={avg_ratings} reviews={total_reviews} />
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {fullAddr && <span>{fullAddr ?? ""}</span>}
                <span className="mx-2">•</span>
                <span>Travels up to {teacher.enquiry_radius} km</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 uppercase">
                <Badge variant="secondary">
                  <Calendar className="mr-1 h-3 w-3" />
                  {teacher.availability.charAt(0).toUpperCase() +
                    teacher.availability.slice(1)}{" "}
                  availability
                </Badge>
                <Badge variant="secondary">
                  <User className="mr-1 h-3 w-3" />
                  {teacher.preference}
                </Badge>
              </div>
              <div className="mt-2">
                <DialogEnquiryForm tutorId={tutorId} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Education */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{teacher.degree.name}</h3>
                      {teacher.degree.status === "yes" && (
                        <p className="text-sm text-muted-foreground">
                          Graduated: {teacher.degree.year}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="h-fit">
                      {teacher.degree.status === "yes"
                        ? "Completed"
                        : "Persuing"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Languages className="mr-2 h-5 w-5" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-16">
                  <div className="space-y-1">
                    {teacher.languages.map((language, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="capitalize">{language.name}</span>
                        <Badge
                          variant={
                            language.proficiency === "proficient"
                              ? "default"
                              : "outline"
                          }
                        >
                          {language.proficiency.charAt(0).toUpperCase() +
                            language.proficiency.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{teacher.experience}</p>
              </CardContent>
            </Card>

            {/* intro video */}
            {tutor.intro_video && (
              <Card className="md:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <MonitorPlay className="mr-2 h-5 w-5" />
                    Intro Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <video
                    src={tutor.intro_video}
                    controls
                    className="mx-auto w-96 rounded-lg"
                    muted
                  ></video>
                </CardContent>
              </Card>
            )}

            {courses?.map((courseData, ind) => (
              <div key={ind} className="md:col-span-3">
                <CourseDetails courseData={courseData} />
              </div>
            ))}
          </div>

          {/* Location Map */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Location & Coverage Area
              </CardTitle>
              <CardDescription className="sr-only">
                Located at coordinates: {teacher.coords[0]}, {teacher.coords[1]}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
              <MapStatic
                coordinates={teacher.coords}
                fullAddr={fullAddr}
                setFullAddr={setFullAddr}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function CourseDetails({ courseData }) {
  const [selectedMode, setSelectedMode] = useState("online");
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Format subject names to be capitalized
  const formatSubjectName = (subject) => {
    return subject.charAt(0).toUpperCase() + subject.slice(1);
  };

  // Filter budgets based on selected mode and location
  const filteredBudgets = courseData.details.budgets.filter((budget) => {
    if (selectedMode === "online") {
      return budget.mode === "online";
    } else {
      return budget.mode === "offline" && budget.location === selectedLocation;
    }
  });

  return (
    <div className="">
      <div className="grid gap-6">
        {/* Course Overview */}
        <div className="">
          <Card className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {courseData.details.is_demo_class && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Demo Available
                  </Badge>
                )}
                <Badge variant="outline" className="capitalize">
                  One-to-One
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="mb-2 text-lg font-semibold">
                    {courseData.name}
                  </h2>
                  {courseData.details.boards.map((board, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium uppercase">
                          {board.board_name}
                        </span>
                      </div>
                      <div className="ml-6 flex flex-wrap gap-2">
                        {board.subjects.map((subject, idx) => (
                          <Badge key={idx} variant="outline">
                            {formatSubjectName(subject)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Options */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Pricing Options</CardTitle>
              <CardDescription>
                Choose your preferred mode and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs
                defaultValue="online"
                onValueChange={(value) => setSelectedMode(value)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="online"
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Online
                  </TabsTrigger>
                  <TabsTrigger
                    value="offline"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Offline
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="online"
                  className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 pt-4"
                >
                  {filteredBudgets.map((budget, index) => (
                    <PricingCard key={index} budget={budget} />
                  ))}
                </TabsContent>

                <TabsContent value="offline" className="space-y-4 pt-4">
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <Button
                      variant={
                        selectedLocation === "tutorPlace"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setSelectedLocation("tutorPlace")}
                      className="flex items-center justify-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Tutor&apos;s Place
                    </Button>
                    <Button
                      variant={
                        selectedLocation === "studentPlace"
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setSelectedLocation("studentPlace")}
                      className="flex items-center justify-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Student&apos;s Place
                    </Button>
                  </div>

                  <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 pt-4">
                    {selectedLocation ? (
                      filteredBudgets.map((budget, index) => (
                        <PricingCard key={index} budget={budget} />
                      ))
                    ) : (
                      <div className="py-4 text-center text-muted-foreground">
                        Please select a location
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            {/* <CardFooter>
              <Button className="w-full">Enroll Now</Button>
            </CardFooter> */}
          </Card>
        </div>
      </div>
    </div>
  );
}

// Pricing Card Component
function PricingCard({ budget }) {
  const formatCosting = (costing) => {
    switch (costing) {
      case "per_hour":
        return "Per Hour";
      case "per_month":
        return "Per Month";
      case "per_course":
        return "Full Course";
      default:
        return costing;
    }
  };

  const getIcon = (costing) => {
    switch (costing) {
      case "per_hour":
        return <Clock className="h-4 w-4" />;
      case "per_month":
        return <Calendar className="h-4 w-4" />;
      case "per_course":
        return <BookOpen className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="border-2 transition-colors hover:border-primary/50">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon(budget.costing)}
            <span className="text-sm font-medium">
              {formatCosting(budget.costing)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize text-muted-foreground">
              {budget.type === "oneToOne" ? "one-to-one" : budget.type}
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">₹{budget.budget}</div>
          <p className="text-sm text-muted-foreground">
            {formatCosting(budget.costing)}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        {/* <Button variant="outline" className="w-full">
          Select
        </Button> */}
      </CardFooter>
    </Card>
  );
}
