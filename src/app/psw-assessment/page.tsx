import PSWCompetencyAssessment from "@/components/psw-competency-assessment";
import Navigation from "@/components/navigation";

export default function PSWAssessmentPage() {
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
                  PSW Competency Assessment
                </p>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                Complete this comprehensive assessment to evaluate your personal
                support worker competencies. This helps us understand your
                comfort level with various caregiving tasks and identify areas
                where you may need additional training or support.
              </p>
            </div>
            <PSWCompetencyAssessment />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-8 sm:mt-16 py-6 sm:py-8 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Haven at Home
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Providing compassionate care services with dignity and respect
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500">
              <span>© 2024 Haven at Home</span>
              <span className="hidden sm:inline">•</span>
              <span>Privacy Policy</span>
              <span className="hidden sm:inline">•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
