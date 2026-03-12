import { Bell, Search, Menu } from "lucide-react";

const TopNavbar = ({ setOpen }) => {
  return (
    <div className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">

      <div className="flex items-center gap-4">

        <Menu
          className="md:hidden cursor-pointer"
          onClick={() => setOpen(true)}
        />

        <div className="hidden md:flex items-center bg-slate-800 px-3 py-2 rounded-lg">
          <Search size={18} />
          <input
            className="bg-transparent outline-none ml-2"
            placeholder="Search..."
          />
        </div>

      </div>

      <div className="flex items-center gap-5">
        <Bell />
        <div className="w-8 h-8 rounded-full bg-blue-500"></div>
      </div>

    </div>
  );
};

export default TopNavbar;