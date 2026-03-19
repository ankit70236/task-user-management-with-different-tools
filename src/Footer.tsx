
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Left - Logo / About */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">MyApp</h2>
          <p className="text-sm">
            Manage your tasks and users efficiently with our modern system.
          </p>
        </div>

        {/* Middle - Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Profile</li>
            <li className="hover:text-white cursor-pointer">Tasks</li>
            <li className="hover:text-white cursor-pointer">Users</li>
          </ul>
        </div>

        {/* Right - Legal */}
        <div>
          <h3 className="text-white font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-white cursor-pointer">
              Privacy Policy
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </div>
    </footer>
  )
}