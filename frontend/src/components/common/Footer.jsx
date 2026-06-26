export default function Footer() {
  return (
    <footer className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Wholesale Management System. CMPE-341 DB Lab Project.</p>
        <p>Built with React + Tailwind CSS</p>
      </div>
    </footer>
  );
}
