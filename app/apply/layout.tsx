import { FormProvider } from "@/app/components/FormContext";

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormProvider>{children}</FormProvider>;
}
