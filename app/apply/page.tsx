"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@/app/components/FormContext";
import FormStepLayout from "@/app/components/FormStepLayout";

export default function ApplyPage() {
  const router = useRouter();
  const { data, updateField } = useForm();
  const isValid = data.name.trim().length > 0;


  return (
    <FormStepLayout
      title="Let's get started. What's your name?"
      subtitle="So we know who we are building this roadmap for."
      step={1}
      totalSteps={6}
    >
      <div className="space-y-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="First name"
          value={data.name ?? ""}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white text-lg placeholder:text-gray-500"
        />
<button
  type="button"
  disabled={!isValid}
  onClick={() => router.push("/apply/step-2")}
  className={`w-8/25 py-5 rounded-3xl font-semibold text-lg transition
    ${
      isValid
        ? "bg-teal-400 text-black hover:bg-teal-300"
        : "bg-gray-700 text-gray-400 cursor-not-allowed"
    }`}
>
  Next →
</button>

      </div>
    </FormStepLayout>
  );
}
