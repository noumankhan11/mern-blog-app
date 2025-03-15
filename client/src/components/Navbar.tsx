import { Menu, Search } from "lucide-react";

import useGlobalStore from "../store/globalStore.ts";
import LargeMenu from "./LargeMenu";
import UpperNav from "./UpperNav";
import { NavLink } from "react-router";
import useUserStore from "../store/userStore.ts";

export default function Navbar() {
  const { turnSeachOn, turnMobileMenuOn, isMobileMenu, isSearch } =
    useGlobalStore((state) => state);
  const authUser =
    JSON.parse(localStorage.getItem("blog-app-user")!) ||
    useUserStore((state) => state.authUser);

  if (isMobileMenu || isSearch) {
    document.body.style.height = "100vh";
    document.body.style.overflowY = "hidden";
  } else if (!isMobileMenu || !isSearch) {
    document.body.style.height = "auto";
    document.body.style.overflowY = "auto";
  }

  return (
    <div>
      <UpperNav />
      <div className="flex flex-wrap w-full  justify-between items-center bg-black h-[70px] md:h-24">
        <div className="logo h-full">
          <NavLink to="/" className={""}>
            <button className="text-3xl cursor-pointer font-extrabold px-4 text-white h-full">
              <span className="p-1 bg-red-500 px-3">V</span> blog
            </button>
          </NavLink>
        </div>
        <LargeMenu />

        <div className="nav-righ h-full flex items-center gap-6">
          {authUser ? (
            <div className="h-full py-2 sm:block hidden">
              <NavLink to={"/profile"} className={"text-center"}>
                <img
                  src="https://avatar.iran.liara.run/public/15"
                  className="size-11 md:size-14 bg-white rounded-full border-3 border-white"
                />
                <p className="Firstname text-white font-semibold text-sm">
                  Nomi
                </p>
              </NavLink>
            </div>
          ) : (
            ""
          )}
          <button
            className="md:inline hidden bg-red-500 text-white h-full w-16 md:w-24 cursor-pointer"
            onClick={turnSeachOn}>
            <Search className="inline" />
          </button>
          <button
            onClick={turnMobileMenuOn}
            className="md:hidden inline ml-1 bg-red-500 text-white h-full w-[70px] md:w-[100px] cursor-pointer">
            <Menu className="inline size-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
