import { Search, X } from "lucide-react";
import useGlobalStore from "../store/globalStore";
import { cn } from "../utils/clsx";
import { NavLink } from "react-router";

export default function MobileMenu() {
  const { isMobileMenu, turnMobileMenuOff, turnSeachOn } =
    useGlobalStore((state) => state);

  return (
    <>
      <div
        className={`md:hidden absolute inset-0 z-10 h-screen  bg-black/40 overflow-hidden transition-all duration-100 ${
          isMobileMenu ? "block" : "invisible"
        } `}></div>
      <div>
        <div
          className={`md:hidden absolute inset-0 h-screen overflow-hidden transition-all duration-00 flex ${
            isMobileMenu ? "block" : "invisible"
          } `}>
          <div
            onClick={turnMobileMenuOff}
            className="empty grow-1 z-20"></div>
          {/* devide */}
          <div
            className={`relative z-50 duration-600 ease ${cn(
              isMobileMenu ? "translate-x-[0]" : "translate-x-[100%]"
            )} menu grow-1 sm:grow-2 sm:max-w-[350px] bg-white py-3 px-2`}>
            <nav className="w-full flex justify-between px-6 mb-8 border-b border-gray-100 pb-2">
              <button
                onClick={() => {
                  turnMobileMenuOff();
                  turnSeachOn();
                }}
                className="ease duration-200 hover:bg-red-500 hover:text-white p-2 rounded-full">
                <Search className="" />
              </button>
              <button
                onClick={turnMobileMenuOff}
                className="ease duration-200 hover:bg-red-500 hover:text-white p-2 rounded-full">
                <X />
              </button>
            </nav>
            <div className="links w-full py-3">
              <ul className="flex flex-col gap-4 text-lg text-gray-700">
                <NavLink
                  onClick={turnMobileMenuOff}
                  to={"/"}
                  className="mblMenuLink">
                  Home
                </NavLink>
                <NavLink
                  onClick={turnMobileMenuOff}
                  to={"/about"}
                  className="mblMenuLink">
                  About
                </NavLink>
                <NavLink
                  onClick={turnMobileMenuOff}
                  to={"/services"}
                  className="mblMenuLink">
                  Services
                </NavLink>
                <NavLink
                  onClick={turnMobileMenuOff}
                  to={"contact"}
                  className="mblMenuLink">
                  Contact
                </NavLink>
                <NavLink
                  onClick={turnMobileMenuOff}
                  to={"socials"}
                  className="mblMenuLink">
                  Socials
                </NavLink>
              </ul>
            </div>
            <div className="logo w-full p-4 my-4 text-center">
              <button className="text-3xl font-extrabold px-4 text-black h-full">
                <span className="p-1 bg-red-500 text-white px-3">
                  V
                </span>{" "}
                blog
              </button>
            </div>
            <div className="footer w-full absolute left-0 bottom-0 bg-gray-100 p-3 text-center">
              www.vblog.com All right reserved
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
