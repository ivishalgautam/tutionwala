"use client";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import { BiCategory } from "react-icons/bi";
import { MdOutlineCategory } from "react-icons/md";
import Title from "@/components/Title";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";

const getReports = async () => {
  return (await http().get(`${endpoints.reports.getAll}/all`)) ?? {};
};
const get30DaysReports = async () => {
  return (await http().get(`${endpoints.reports.getAll}/last-30-days`)) ?? {};
};

export default function Home() {
  const {
    data: report = {},
    isLoading: isReportLoading,
    isError: isReportError,
    error: reportError,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });
  console.log({ report });
  const {
    data: last30DaysReport = {},
    isLoading: isLast30DaysReportLoading,
    isError: isLast30DaysReportError,
    error: last30DaysReportError,
  } = useQuery({
    queryKey: ["last-30-days-reports"],
    queryFn: get30DaysReports,
  });

  return (
    <PageContainer className={"space-y-4 bg-white"}>
      <Heading title={"Dashboard"} description={"Dashboard reports"} />

      <Reports
        {...{
          data: report,
          isError: isReportError,
          isLoading: isReportLoading,
          error: reportError,
        }}
      />

      <div className="space-y-1">
        <Title text={"Report of 30 days"} />
        <Reports
          {...{
            data: last30DaysReport,
            isError: isLast30DaysReportError,
            isLoading: isLast30DaysReportLoading,
            error: last30DaysReportError,
          }}
        />
      </div>
    </PageContainer>
  );
}

function Reports({ data, isError, isLoading, error }) {
  if (isLoading) <Skelotons />;
  if (isError) return error?.message ?? "Error fetching reports";
  const size = 25;

  return (
    <div className="space-y-4">
      <GridContainer>
        <Card
          count={data?.total_tutor}
          title="Tutors"
          icon={<FaChalkboardTeacher size={size} className="text-primary" />}
          href="/users?role=tutor&limit=10"
        />
        <Card
          count={data?.total_student}
          title="Student"
          icon={<PiStudentBold size={size} className="text-primary" />}
          href="/users?role=student&limit=10"
        />
        <Card
          count={data?.total_category}
          title="Categories"
          icon={<BiCategory size={size} className="text-primary" />}
          href="/categories?limit=10"
        />
        <Card
          count={data?.total_sub_category}
          title="Sub Categories"
          icon={<MdOutlineCategory size={size} className="text-primary" />}
          href="/sub-categories?limit=10"
        />
      </GridContainer>

      <GridContainer>
        <Card
          count={data?.queries?.total ?? 0}
          title="Total Queries"
          icon={<CircleHelp size={size} className="text-primary" />}
          href="/queries?limit=10"
          className="border-blue-300 bg-blue-100"
        />
        <Card
          count={data?.queries?.pending ?? 0}
          title="Pending Queries"
          icon={<CircleHelp size={size} className="text-primary" />}
          href="/queries?limit=10&status=pending"
          className="border-red-300 bg-red-100"
        />
        <Card
          count={data?.queries?.resolved ?? 0}
          title="Resolved queries"
          icon={<CircleHelp size={size} className="text-primary" />}
          href="/queries?limit=10&status=resolved"
          className="border-green-300 bg-green-100"
        />
        <Card
          count={data?.queries?.inProgress ?? 0}
          title="In Progress Queries"
          icon={<CircleHelp size={size} className="text-primary" />}
          href="/queries?limit=10&status=in+progress"
          className="border-yellow-300 bg-yellow-100"
        />
      </GridContainer>
    </div>
  );
}

function GridContainer({ children }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,1fr))] gap-4">
      {children}
    </div>
  );
}

function Card({
  count = 0,
  title = "",
  icon = "",
  href = "#",
  className = "",
}) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center justify-start gap-2 rounded-lg border bg-primary-light p-4 py-3",
          className,
        )}
      >
        <div className="rounded-full border bg-white p-3">{icon}</div>
        <div className="flex flex-col items-start justify-start">
          <span className="text-xs font-medium tracking-wide">{title}</span>
          <span className="text-3xl font-semibold text-primary">{count}</span>
        </div>
      </div>
    </Link>
  );
}

function Skelotons({ length = 4 }) {
  return Array.from({ length }).map((_, key) => (
    <Skeleton className={"h-[74.6px] bg-gray-200"} key={key} />
  ));
}
