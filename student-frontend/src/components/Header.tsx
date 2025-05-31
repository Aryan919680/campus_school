
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm px-4 py-3 fixed top-0 w-full z-10">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-blue-600">
          <ShieldCheck className="h-6 w-6" />
          <span className="font-bold text-lg">Exam Guardian</span>
        </Link>
      </div>
    </header>
  );
}
