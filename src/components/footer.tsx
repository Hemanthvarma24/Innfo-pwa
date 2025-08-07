import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white ">
      <div className="container mx-auto px-2 py-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Innfo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
