import Image from "next/image";
import { Button, buttonVariants } from "@/src/components/ui/button";
import  Link  from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export default function Home() {
  return (
    <Card>
      <CardContent>
      <Link href="/form" className={buttonVariants({size: "lg", variant: "outline" })}>Formulaire</Link>
      </CardContent>
      </Card>
  );
}