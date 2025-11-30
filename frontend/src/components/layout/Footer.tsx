import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            to="/"
            className="text-green-600 hover:text-green-700 font-semibold text-lg transition-colors"
          >
            conduit
          </Link>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a
              href="https://github.com/gothinkster/realworld"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://realworld-docs.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              Docs
            </a>
          </div>

          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RealWorld. An interactive learning project from Thinkster.
          </p>
        </div>
      </div>
    </footer>
  );
}
