"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header =() => {
  const pathname = usePathname();

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Company", path: "/contact" },
  ];

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* LEFT: LOGO */}
        <div className="text-xl font-bold">
          <Link href="/">CompanyLogo</Link>
        </div>

        {/* MIDDLE: NAVIGATION */}
        <nav className="flex gap-8">
          {links.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative font-medium transition-all
                  ${isActive ? "text-red-400" : "text-white"}
                `}
              >
                {link.name}

                {/* UNDERLINE ANIMATION */}
                <span
                  className={`absolute -bottom-1 h-0.5 w-0 bg-red-400 transition-all duration-300
                    ${
                      isActive
                        ? "w-full left-0"
                        : "group-hover:w-full group-hover:left-0"
                    }
                  `}
                ></span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}


export default Header;