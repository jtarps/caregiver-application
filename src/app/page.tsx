import MultiStepApplicationForm from "@/components/multi-step-application-form";
import Navigation from "@/components/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="py-4 sm:py-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Haven at Home
                </h1>
                <p className="text-lg sm:text-xl text-blue-600 font-semibold">
                  Caregiver Application
                </p>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                Complete this comprehensive application to join our team of
                compassionate caregivers. We&apos;re looking for dedicated
                individuals who share our commitment to providing exceptional
                care with dignity and respect.
              </p>
            </div>
            <MultiStepApplicationForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Haven at Home
            </h3>
            <p className="text-gray-600 mb-4">
              Providing compassionate care services with dignity and respect
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>© 2024 Haven at Home</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
