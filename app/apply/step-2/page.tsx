"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@/app/components/FormContext";
import FormStepLayout from "@/app/components/FormStepLayout";

export default function Step2() {
  const router = useRouter();
  const { data, updateField } = useForm();

  const isValid =
    data.email.trim().length > 0 && data.phone.trim().length > 0;

  return (
    <FormStepLayout
      title="How can we contact you?"
      subtitle="We’ll only use this to follow up about your enquiry."
      step={2}
      totalSteps={6}
    >
      <div className="space-y-6 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Email address"
          value={data.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white"
        />

        <input
          type="tel"
          placeholder="Phone number"
          value={data.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-5 text-white"
        />

        <button
          disabled={!isValid}
          onClick={() => router.push("/apply/step-3")}
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
