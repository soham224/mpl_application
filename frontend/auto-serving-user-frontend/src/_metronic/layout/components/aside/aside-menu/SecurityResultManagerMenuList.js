import React from "react";
  import { useLocation } from "react-router-dom";
  import { NavLink } from "react-router-dom";
  import SVG from "react-inlinesvg";
  import { checkIsActive, toAbsoluteUrl } from "../../../../_helpers";

  export function SecurityResultManagerMenuList({ layoutProps }) {
    const location = useLocation();

    const getMenuItemActive = (url, hasSubmenu = false) => {
      return checkIsActive(location, url)
          ? ` ${
              !hasSubmenu && "menu-item-active"
          } menu-item-open menu-item-not-hightlighted`
          : "";
    };

    return (
        <>
          {/* begin::Menu Nav */}
          <ul className={`menu-nav ${layoutProps.ulClasses}`}>

            <>
              {/*begin::1 Level*/}
              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                      "/dashboard"
                  )}`}
              >
                <NavLink className="menu-link" to={"/dashboard"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="View Dashboard"
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
              />
            </span>
                  <span className="menu-text">Dashboard</span>
                </NavLink>
              </li>

            </>

          </ul>
        </>
    );
  }
