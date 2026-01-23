"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@/app/components/FormContext";
import FormStepLayout from "@/app/components/FormStepLayout";

const OPTIONS = [
  "Just me",
  "2–5 people",
  "6–10 people",
  "11–20 people",
  "20+ people",
];

export default function Step6() {
  const router = useRouter();
  const { updateField } = useForm();

  const handleSelect = (value: string) => {
    updateField("teamSize", value);
    router.push("/apply/submit"); // 👈 FINAL PAGE
  };

  return (
    <FormStepLayout
      title="How big is your team right now?"
      subtitle="This helps us understand how much leverage you need."
      step={6}
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
