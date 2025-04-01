import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Small } from "./ui/typography";
import { Heading } from "./ui/heading";
import { Badge } from "./ui/badge";

const PricingCard = ({
  title,
  price,
  duration,
  students,
  features,
  isPopular = false,
}) => (
  <Card className={`w-[300px] ${isPopular ? "border-primary" : ""}`}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>
        Perfect for {students} verified students
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold">₹{price}</div>
      <div className="text-sm text-muted-foreground">per {duration}</div>
      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="mt-auto">
      <Button className="w-full">Get Started</Button>
    </CardFooter>
  </Card>
);

export default function PricingSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 space-y-2">
          <Small
            className={
              "block text-center font-medium uppercase tracking-wide text-primary"
            }
          >
            Pricing
          </Small>
          <Heading
            title={"Simple, Transparent Pricing"}
            description={"Choose the plan that's right for your institution"}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <Card className={`w-[300px]`}>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>
                Perfect for up to 25 verified students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">₹0</div>
              <div className="text-sm text-muted-foreground">per month</div>
              <ul className="mt-4 space-y-2">
                {["Access to limited features"].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>

          <Card className={`relative w-[300px] border-primary`}>
            <Badge type="button" className="absolute right-2 top-2">
              Limited time offer
            </Badge>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <CardDescription>
                Perfect for up to 500 verified students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                <span className="line-through decoration-primary">₹999</span>{" "}
                <span>Free</span>
              </div>

              <div className="text-sm text-muted-foreground">per year</div>
              <ul className="mt-4 space-y-2">
                {["All Basic features"].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>

          <Card className={`relative w-[300px]`}>
            <Badge type="button" className="absolute right-2 top-2">
              Limited time offer
            </Badge>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>
                Perfect for 500+ verified students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                <span className="line-through decoration-primary">₹9,999</span>{" "}
                <span>Free</span>
              </div>
              <div className="text-sm text-muted-foreground">per year</div>
              <ul className="mt-4 space-y-2">
                {["All Pro features"].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
        </div>
        {/* <div className="mt-16 text-center">
          <h3 className="mb-4 text-2xl font-bold">
            Limited Time Launch Offer!
          </h3>
          <p className="mb-6 text-lg">
            Get 100% discount for the first 6 months on any plan. Don&apos;t
            miss this opportunity!
          </p>
          <Button size="lg">Claim Your Discount Now</Button>
        </div> */}
      </div>
    </section>
  );
}
