"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@/app/components/FormContext";
import FormStepLayout from "@/app/components/FormStepLayout";

const OPTIONS = [
  "Under £10k / month",
  "£10k – £30k / month",
  "£30k – £75k / month",
  "£75k – £150k / month",
  "£150k+ / month",
];

export default function Step4() {
  const router = useRouter();
  const { updateField } = useForm();

  const handleSelect = (value: string) => {
    updateField("revenue", value);
    router.push("/apply/step-5");
  };

  return (
    <FormStepLayout
      title="What’s your average monthly revenue?"
      subtitle="Rough numbers are fine — this helps us tailor the systems."
      step={4}
      totalSteps={6}
    >
      <div className="space-y-4 max-w-md mx-auto">
        {OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className="w-full text-left px-6 py-5 rounded-xl border border-white/10 text-white bg-black/40 hover:border-teal-400 hover:bg-teal-400/10 transition"
          >
            {option}
          </button>
        ))}
      </div>
    </FormStepLayout>
  );
}
