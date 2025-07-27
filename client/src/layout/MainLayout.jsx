import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MobileMenuBar from "../components/MobileMenuBar";
import { setScreenView } from "../features/localState/localStateSlice";
import LoaderModal from "../components/LoaderModal";

const MainLayout = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const { loading } = useSelector((state) => state.user);
  const { isSideBarCollapsed } = useSelector((state) => state.localState);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    setScreenView(window.innerWidth < 768 ? "mobile" : "desktop");
    dispatch(setScreenView(window.innerWidth < 768 ? "mobile" : "desktop"));

    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);

  

  if (loading) return <LoaderModal />;

  // Sidebar width depends on collapse state
  const sidebarWidth = isSideBarCollapsed ? 75 : 250;

  if (!isMobile) {
    return (
      <div className="w-screen h-screen overflow-hidden flex">
        {/* Sidebar fixed on the left */}
        <Sidebar />

        {/* Main content shifted to the right of sidebar */}
        <div
          className="h-full overflow-y-auto bg-gray-50 flex-1"
          style={{ marginLeft: sidebarWidth }}
        >
          <Outlet />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen overflow-hidden flex">
        {/* Main content shifted to the center top */}
        <div className="h-full overflow-y-auto bg-gray-50 flex-1">
          <Outlet />
        </div>

        {/* Sidebar fixed on the left */}
        <div className="mt-14">
          <MobileMenuBar />
        </div>
      </div>
    );
  }
};

export default MainLayout;
