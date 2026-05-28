import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Dziękujemy za rejestrację!
              </CardTitle>
              <CardDescription>Sprawdź email, aby potwierdzić</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Rejestracja przebiegła pomyślnie. Sprawdź swoją skrzynkę email,
                aby potwierdzić konto przed zalogowaniem.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
