"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@/app/components/FormContext";
import FormStepLayout from "@/app/components/FormStepLayout";

export default function ApplySummary() {
  const router = useRouter();
  const { data } = useForm();

  return (
    <FormStepLayout
      title="Quick check before we continue"
      subtitle="Make sure everything looks right."
      step={5}
      totalSteps={5}
    >
      <div className="max-w-md mx-auto space-y-6 text-left">

      <SummaryItem label="Email" value={data.email} />
<SummaryItem label="Phone" value={data.phone} />
<SummaryItem label="Business Name" value={data.businessName} />
        <SummaryItem label="Name" value={data.name} />
        <SummaryItem label="Business Type" value={data.businessType} />
        <SummaryItem label="Monthly Revenue" value={data.revenue} />
        <SummaryItem label="Team Size" value={data.teamSize} />
        <SummaryItem label="Biggest Bottleneck" value={data.bottleneck} />

        <button
  onClick={() => router.push("/apply/submit")}
  className="w-full mt-8 py-5 rounded-xl bg-teal-400 text-black font-semibold text-lg hover:bg-teal-300 transition"
>
  Submit & Continue →
</button>
      </div>
    </FormStepLayout>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 rounded-xl p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white font-medium">{value || "—"}</p>
    </div>
  );
}
