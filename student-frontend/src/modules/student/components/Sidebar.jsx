import { useContext, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "@/auth/context/AuthContext";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BadgeIndianRupee,
  CalendarClock,
  GraduationCap,
  LayoutDashboard,
  Library,
  LibraryBig,
  LogOut,
  MessageCircleMore,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Sidebar = ({ sidebar, boxRef }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const scriptRef = useRef(false); // Initialize the ref
  const { data } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!scriptRef.current) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
        scriptRef.current = true; // Mark script as added
      }
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages:
            "en,hi",
        },
        "google_translate_element"
      );

      // Apply styles to hide branding
      const style = document.createElement('style');
      style.innerHTML = `
        #google_translate_element .goog-logo-link {
          display: none !important;
        }
        #google_translate_element .goog-logo {
          display: none !important;
        }
        #goog-te-banner-frame {
          display: none !important;
        }
          #goog-te-banner-frame {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div
      ref={boxRef}
      className={`sidebar z-[1] h-screen w-60 py-6 px-8 flex-col justify-between rounded-r-2xl shadow-xl bg-white ${
        sidebar ? "flex absolute z-[1]" : "hidden"
      } lg:flex lg:sticky lg:top-0`}
    >
      <div>
      <Avatar className="size-24 lg:size-28">
          <AvatarImage src={data.logo} />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <ul className="text-lg font-semibold">
          <li>
            <Link to="/" className="flex gap-4 my-6 items-center">
              <LayoutDashboard /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/timetable" className="flex gap-4 my-6 items-center">
            <Library /> TimeTable
            </Link>
          </li>
          {/* <li>
            <Link to="/academics" className="flex gap-4 my-6 items-center">
              <GraduationCap /> Academics
            </Link>
          </li>
          <li>
            <Link to="/events" className="flex gap-4 my-6 items-center">
              <CalendarClock /> Notices/Events
            </Link>
          </li>
          <li>
            <Link to="/library" className="flex gap-4 my-6 items-center">
              <LibraryBig /> Library
            </Link>
          </li>
          <li>
            <Link to="/fees" className="flex gap-4 my-6 items-center">
              <BadgeIndianRupee /> Fee Payment
            </Link>
          </li>
          <li>
            <Link to="/support" className="flex gap-4 my-6 items-center">
              <MessageCircleMore /> Support
            </Link>
          </li> */}
        </ul>
      </div>
      <div>
        <ul className="text-lg font-semibold">
        <li class="dropdown" style={{ padding: "0px", } }>
  <a href="#">
    <span>Language</span>
    <i class="bi bi-chevron-down toggle-dropdown"></i>
  </a>
  <ul
    id="google_translate_element"
    style={{ top: "180%", visibility: "visible", left: "0px", padding: "0px 4px", height:"20px", overflowY: "hidden"}}
  ></ul>
</li>

          <li className="flex gap-4 my-6 items-center cursor-pointer">
            <Dialog>
              <DialogTrigger className="flex gap-4 my-6 items-center cursor-pointer">
                <LogOut /> Logout
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to log out of the platform?
                  </DialogDescription>
                </DialogHeader>
                <Button onClick={handleLogout}>Logout</Button>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
