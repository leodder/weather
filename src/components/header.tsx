import { useTheme } from "../context/theme-provider";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import CitySearch from "./city-search";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"}>
          <img
            src={theme === "dark" ? "/logo1.png" : "/logo2.png"}
            alt="kuro1"
            className="h-14"
          ></img>
        </Link>
        <div className="flex gap-2">
          {/* search */}
          <CitySearch />
          {/* theme toggle */}
          <div
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`flex items-center cursor-pointer transition-transform duration-500
            ${theme === 'dark' ? "rotate-180" : "rotate-0"}
            `}
          >
            {theme === "dark" ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />
            ) : (
              <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
