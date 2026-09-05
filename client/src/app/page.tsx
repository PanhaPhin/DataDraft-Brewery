export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Vattanac Brewery Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Modern platform for Vattanac Brewery management and customer services
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            🍺 Vattanac Brewery - Client Website
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                🚀 Technology Stack
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js 14 with TypeScript</li>
                <li>• TailwindCSS for styling</li>
                <li>• shadcn/ui components</li>
                <li>• Zustand for state management</li>
                <li>• React Hook Form + Zod validation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                ✨ Features
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Brewery product catalog</li>
                <li>• Product search & filtering</li>
                <li>• Customer authentication</li>
                <li>• Order management</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            🛠️ Ready to Start Development?
          </h3>
          <p className="text-amber-700 mb-4">
            This is the starting page for the Vattanac Brewery platform.
            You can now replace this content with your actual brewery features
            and business functionality.
          </p>

          <div className="bg-white rounded p-4 text-left">
            <p className="text-sm text-gray-600 mb-2">
              Quick start command:
            </p>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              npm run dev
            </code>
            <span className="text-gray-500 ml-2">
              - Start development server
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-medium text-gray-800">
              🖥️ Admin Dashboard
            </h4>
            <p className="text-gray-600">localhost:5173</p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 shadow border-2 border-amber-200">
            <h4 className="font-medium text-amber-800">
              🍺 Client Website
            </h4>
            <p className="text-amber-600">
              localhost:3000 (You are here)
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h4 className="font-medium text-gray-800">
              🔧 Backend API
            </h4>
            <p className="text-gray-600">localhost:8000</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            📖 Check README.md for complete setup instructions and documentation
          </p>
        </div>
      </div>
    </div>
  );
}