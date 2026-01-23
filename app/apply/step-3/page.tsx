"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@/app/components/FormContext";
import FormStepLayout from "@/app/components/FormStepLayout";

export default function Step3() {
  const router = useRouter();
  const { data, updateField } = useForm();

  const isValid =
    data.businessName.trim().length > 0 &&
    data.businessType.trim().length > 0;

  return (
    <FormStepLayout
      title="Tell us about your business"
      subtitle="This helps us tailor the systems correctly."
      step={3}
      totalSteps={6}
    >
      <div className="space-y-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Business name"
          value={data.businessName}
          onChange={(e) => updateField("businessName", e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white"
        />

        <input
          type="text"
          placeholder="Business type (e.g. Plumbing, Electrical)"
          value={data.businessType}
          onChange={(e) => updateField("businessType", e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white"
        />

        <button
          disabled={!isValid}
          onClick={() => router.push("/apply/step-4")}
          className={`w-8/25 py-5 rounded-3xl font-semibold transition ${
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
