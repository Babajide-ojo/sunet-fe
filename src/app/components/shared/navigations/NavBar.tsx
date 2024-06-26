"use client";
import Button from "../buttons/Button";
import NavLink from "./NavLink";
import Logo from "../../../../../public/images/Logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import Link from "next/link";

const navItems = [
  // { text: "Home", route: "/" },
  { text: "Home", route: "/" },
  { text: "About us", route: "/#about-us" },
  // { text: "Why choose us", route: "/#why-choose-us" },
  { text: "Rooms", route: "/#rooms" },
  { text: "Services", route: "/#services" },
  { text: "Contact us", route: "/#contact-us" },
];

// Create a component to render the navigation items
const Navigation = () => (
  <nav className="flex flex-col lg:flex-row items-center justify-center gap-16">
    {navItems.map(({ text, route }, index) => (
      <div key={index}>
        <div>
          <NavLink href={route}>{text}</NavLink>
        </div>
      </div>
    ))}
  </nav>
);

const NavBar = () => {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [userData, setUserData] = useState(false);
  const [openUserDropDown, setOpenUserDropDown] = useState(false);

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    userData && setUserData(true);
  }, []);

  const handleSignOut = () => {
    setUserData(false);
    localStorage.removeItem("userData");
    localStorage.removeItem("roomBookingDetails");
    router.push("/");
  };

  return (
    <div className="w-full gap-2 fixed top-0 left-0 bg-white z-[100] flex justify-between items-center py-4 px-5 md:px-12 border-b-2 border-jsPrimary100">
      <NavLink href="/">
        <Image src={Logo} alt="logo" className="h-14 w-auto" />
      </NavLink>

      <div className="lg:flex hidden items-center">
        <Navigation />
      </div>

      <div className="flex gap-5 items-center">
        {!userData && (
          <div className="lg:flex hidden gap-8 items-center">
            <NavLink className="pt-2" href="/sign-in">
              Sign In
            </NavLink>
            <Button
              size="large"
              variant="primary"
              showIcon={false}
              onClick={() => router.push("/sign-up")}
            >
              Get Started
            </Button>
          </div>
        )}

        <div className="block lg:hidden text-jsPrimary100">
          {!navOpen ? (
            <MdOutlineKeyboardDoubleArrowDown
              onClick={() => setNavOpen(true)}
              size={35}
            />
          ) : (
            <MdOutlineKeyboardDoubleArrowUp
              size={35}
              onClick={() => setNavOpen(false)}
            />
          )}
        </div>
        {navOpen && (
          <div
            className={`absolute left-0 w-full top-full mt-1 p-5 bg-white ${
              navOpen ? "min-h-10" : "h-0"
            }`}
          >
            <div className="pt-8">
              <div className=" items-center">
                <Navigation />
              </div>

              <div className="pt-8 justify-center flex gap-8 items-center">
                <NavLink className="pt-2" href="/sign-in">
                  Sign In
                </NavLink>
                <Button
                  size="large"
                  variant="primary"
                  showIcon={false}
                  onClick={() => router.push("/sign-up")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}

        {userData && (
          <div className="relative">
            <div
              className="text-jsPrimary100 cursor-pointer"
              onClick={() => setOpenUserDropDown(!openUserDropDown)}
            >
              <IoPersonCircleOutline size={50} />
            </div>

            {openUserDropDown && (
              <div
                className={`absolute w-[12rem] -right-5 top-full mt-7 p-3 bg-white rounded-md border ${
                  openUserDropDown ? "min-h-10" : "h-0"
                }`}
              >
                <div className="w-full flex flex-col">
                  <Link
                    href={"/bookings"}
                    className="w-full hover:bg-yellow-50 rounded-md p-3"
                  >
                    Bookings
                  </Link>

                  <div
                    className="w-full hover:bg-yellow-50 rounded-md p-3 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Sign-out
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
