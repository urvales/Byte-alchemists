import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-7xl font-bold text-indigo-600">404</p>
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <p className="text-gray-500">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
      >
        Back to Home
      </Link>
    </main>
  );
}
