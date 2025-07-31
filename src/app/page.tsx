import MultiStepApplicationForm from "@/components/multi-step-application-form";
import Navigation from "@/components/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Haven at Home
                </h1>
                <p className="text-xl text-blue-600 font-semibold">
                  Caregiver Application
                </p>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join our team of compassionate caregivers and make a difference
                in people's lives. Complete the form below to apply for a
                caregiver position with Haven at Home.
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
