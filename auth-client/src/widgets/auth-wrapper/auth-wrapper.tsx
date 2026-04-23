import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui";
import Link from "next/link";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  heading: string
  description?: string
  backButtonLabel?: string
  backButtonHref?: string
  isSocialShown?: boolean
}>

export function AuthWrapper({
  children,
  heading,
  description,
  backButtonLabel,
  backButtonHref,
  isSocialShown = false,
}: Props) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <CardTitle>{heading}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {isSocialShown && (
          <div className="grid gap-2">
            <Button variant="outline" className="w-full font-normal" type="button">
              Продолжить с Google
            </Button>
            <Button variant="outline" className="w-full font-normal" type="button">
              Продолжить с GitHub
            </Button>
          </div>
        )}
        {children}
      </CardContent>
      {backButtonLabel && backButtonHref && (
        <CardFooter>
          <Button variant="link" className="w-full font-normal" asChild>
            <Link href={backButtonHref}>{backButtonLabel}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
