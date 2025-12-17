import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden font-sans">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      {/* Watermark Logo */}
      {/* <div
        className="fixed inset-0 mt-16 flex items-center justify-center pointer-events-none z-0"
        style={{ opacity: 0.04 }}
      >
        <Image
          src="/logo-aii.png"
          alt="Organization Logo"
          width={700}
          height={700}
          className="object-contain"
        />
      </div> */}

      {/* Navigation */}
      <header className="w-full z-20 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-100 fixed top-0 left-0">
        <div className=" mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <Image
              src="/logo-aii.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            /> */}
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">D</span>
            </div>
            <h1 className="text-xl font-semibold text-primary tracking-wide hidden sm:block">
              Driving Evaluation System
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white 
                bg-primary hover:bg-primary/90 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                transition-all duration-200 shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex justify-center items-center min-h-screen z-10 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Professional Driver Assessment Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Streamline Your
            <span className="block text-primary mt-2">
              Driving Evaluations
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6 leading-relaxed">
            A comprehensive platform designed for driving schools and organizations 
            to assess, track, and manage driver evaluations with precision and efficiency. 
            Ensure safety standards and maintain compliance effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl 
                shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 
                hover:bg-primary/90 transition-all duration-200 text-lg"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 bg-white text-primary font-semibold rounded-xl 
                border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5
                transition-all duration-200 text-lg"
            >
              Learn More
            </Link>
          </div>

           
        </div>
      </main>

      

       
    </div>
  );
}