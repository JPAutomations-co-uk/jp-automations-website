import ConversionEvents from "@/app/components/ConversionEvents"

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function NextStepsPage() {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-6">
      <ConversionEvents />
        <div className="max-w-xl w-full text-center bg-black/40 border border-white/10 rounded-3xl p-12 text-white">
  
          <h1 className="text-4xl font-bold mb-6">
            You’re all set check your email
          </h1>
  
          <p className="text-gray-400 mb-8">
            We’ve sent you an email with a link to choose a time that works best for you.
          </p>
  
          <div className="text-gray-300 space-y-3 mb-10 font-bold">
            <p>Next steps:</p>
            <ul className="list-disc list-inside text-left max-w-md mx-auto">
              <li>Pick a time that suits your schedule (takes under 30 seconds)</li>
              <li>We’ll review your details before the call</li>
              <li>No prep needed, just show up</li>
            </ul>
          </div>
  
          <p className="text-gray-400 text-sm mb-6">
            This is a strategy call, not a hard pitch. <div>
        </div>
                If we’re not a good fit, we’ll tell you.
          </p>
  
          <p className="text-gray-500 text-sm">
            Didn’t receive the email? Check your spam folder or contact us at{" "}
            <span className="text-teal-400">jp@jpautomations.co.uk</span>
          </p>
  
        </div>
      </main>
    );
  }
  