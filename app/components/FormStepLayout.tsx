type FormStepLayoutProps = {
    title: string;
    subtitle?: string;
    step: number;
    totalSteps: number;
    children: React.ReactNode;
  };
  
  export default function FormStepLayout({
    title,
    subtitle,
    step,
    totalSteps,
    children,
  }: FormStepLayoutProps) {
    const progress = (step / totalSteps) * 100;
  
    return (
      <main className="relative min-h-screen bg-[#0B0F14] flex items-center justify-center px-6">
        
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_70%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
  
        {/* Progress */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
          <div
            className="h-full bg-teal-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
  
        {/* Content */}
        <section className="relative z-10 w-full max-w-3xl text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            Step {step} of {totalSteps}
          </p>
  
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {title}
          </h1>
  
          {subtitle && (
            <p className="text-gray-400 text-lg mb-12">
              {subtitle}
            </p>
          )}
  
          {children}
        </section>
      </main>
    );
  }
  