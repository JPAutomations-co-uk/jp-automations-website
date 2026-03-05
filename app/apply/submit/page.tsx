"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@/app/components/FormContext";
import { useState } from "react";

// 👇 PASTE YOUR GOOGLE SCRIPT WEB APP URL HERE
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyF_Jnx4K0k9fDgar4b0p9OcCYbSuFkWVIbYrUF2LD2RtOR7VFNO-obfy1U7en_w6dC/exec"; 

export default function SubmitPage() {
  const router = useRouter();
  const { data } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Point to YOUR Next.js API route
      const response = await fetch("/api/submit-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      router.push("/apply/next-steps");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-black/40 border border-white/10 rounded-3xl p-10 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Almost done</h1>

        <p className="text-gray-400 text-center mb-8">
          Confirm your details below, then submit to receive your booking link
          via email.
        </p>

        <div className="space-y-3 text-gray-300">
          <div>
            <strong>Name:</strong> {data.name}
          </div>
          <div>
            <strong>Email:</strong> {data.email}
          </div>
          <div>
            <strong>Phone:</strong> {data.phone}
          </div>
          <div>
            <strong>Business:</strong> {data.businessName} ({data.businessType})
          </div>
          <div>
            <strong>Revenue:</strong> {data.revenue}
          </div>
          <div>
            <strong>Main Challenge:</strong> {data.bottleneck}
          </div>
          <div>
            <strong>Team Size:</strong> {data.teamSize}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`mt-10 w-full text-center py-4 rounded-3xl font-bold transition ${
            isSubmitting
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-teal-400 text-black hover:bg-teal-300"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit & Receive Booking Link →"
          )}
        </button>

        <p className="mt-4 text-center text-gray-500 text-sm">
          We'll send you an email within seconds with your booking link
        </p>
      </div>
    </main>
  );
}