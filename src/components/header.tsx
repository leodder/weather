import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"}>
          <img src="/logo1.png" alt="kuro1" className="h-14"></img>
        </Link>
        <div>
          {/* search */}
          {/* theme toggle */}
        </div>
      </div>
    </header>
  );
};

export default Header;
