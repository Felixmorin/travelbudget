import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SearchCard() {
  return (
    <Card className="w-full border-white/50 bg-white/95 shadow-2xl shadow-slate-950/20 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg text-slate-950">Plan from your real budget</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Budget" icon={<Wallet className="size-4" />}>
            <Input defaultValue="2400" className="h-11 bg-white" />
          </Field>
          <Field label="Currency">
            <Select defaultValue="cad">
              <SelectTrigger className="h-11 w-full bg-white">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cad">CAD</SelectItem>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Departure city" icon={<MapPin className="size-4" />}>
            <Input defaultValue="Toronto" className="h-11 bg-white" />
          </Field>
          <Field label="Duration" icon={<Calendar className="size-4" />}>
            <Select defaultValue="10">
              <SelectTrigger className="h-11 w-full bg-white">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="10">10 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Travel month">
            <Select defaultValue="october">
              <SelectTrigger className="h-11 w-full bg-white">
                <SelectValue placeholder="Travel month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="june">June</SelectItem>
                <SelectItem value="october">October</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Number of travelers" icon={<Users className="size-4" />}>
            <Select defaultValue="2">
              <SelectTrigger className="h-11 w-full bg-white">
                <SelectValue placeholder="Travelers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 traveler</SelectItem>
                <SelectItem value="2">2 travelers</SelectItem>
                <SelectItem value="4">4 travelers</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Travel style">
            <Select defaultValue="balanced">
              <SelectTrigger className="h-11 w-full bg-white">
                <SelectValue placeholder="Travel style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="comfort">Comfort</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Button asChild className="mt-5 h-12 w-full rounded-xl bg-orange-500 text-base text-white hover:bg-orange-600">
          <Link href="/results">
            Find My Best Destinations
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </Label>
      {children}
    </div>
  );
}
