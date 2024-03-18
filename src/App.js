import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { NavBar, Sidebar, ThemeSettings } from "./components";
import { Orders, Customers, Users } from "./pages";

import { useStateContext } from "./contexts/ContextProvider";

import "./App.css";
import Signin from "./pages/Signin";
import FormComponent from "./pages/FormComponent";

const App = () => {
  const {
    activeMenu,
    themeSettings,
    setThemeSettings,
    currentColor,
    currentMode,
  } = useStateContext();
  const [authenticated, setAuthenticated] = useState(true);

  const handleAuthentication = () => {
    const isAuthenticated = true;
    setAuthenticated(isAuthenticated);
  };

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Settings" position="TopCenter">
              <button
                type="button"
                className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: "50%" }}
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
          {authenticated && (
            <>
              {activeMenu ? (
                <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
                  <Sidebar />
                </div>
              ) : (
                <div className="w-0 dark:bg-secondary-dark-bg">
                  <Sidebar />
                </div>
              )}
              <div
                className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
                  activeMenu ? "md:ml-72" : "flex-2"
                }`}
              >
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                  <NavBar />
                </div>
                <div>
                  {themeSettings && <ThemeSettings />}
                  <Routes>
                    {/* Pages */}
                    <Route path="/user" element={<Users />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/form" element={<FormComponent />} />
                  </Routes>
                </div>
              </div>
            </>
          )}
          {!authenticated && (
            <div className="w-full">
              <Routes>
                <Route
                  path="/"
                  element={<Signin onAuthenticate={handleAuthentication} />} // Show Signin if not authenticated
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          )}
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
