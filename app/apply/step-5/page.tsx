"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@/app/components/FormContext";
import FormStepLayout from "@/app/components/FormStepLayout";

const options = [
  "Too many enquiries, no structure",
  "Admin and follow-ups take too much time",
  "Marketing is inconsistent",
  "Everything depends on me",
];

export default function Step5() {
  const router = useRouter();
  const { data, updateField } = useForm();

  return (
    <FormStepLayout
      title="What’s your biggest problem you're facing right now?"
      subtitle="Where do you feel the most pressure?"
      step={5}
      totalSteps={6}
    >
      <div className="space-y-4 max-w-md mx-auto">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              updateField("bottleneck", option);
              router.push("/apply/step-6");
            }}
            className={`w-full py-5 rounded-xl border transition ${
              data.bottleneck === option
                ? "bg-teal-400 text-black border-teal-400"
                : "border-white/10 text-white hover:border-teal-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </FormStepLayout>
  );
}
