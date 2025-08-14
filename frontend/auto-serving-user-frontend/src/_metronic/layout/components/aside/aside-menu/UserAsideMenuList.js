/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive, toAbsoluteUrl } from "../../../../_helpers";
import { ADMIN_URL } from "../../../../../enums/constant";

export function UserAsideMenuList({ layoutProps }) {
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
                      ADMIN_URL + "/dashboard"
                  )}`}
              >
                  <NavLink className="menu-link" to={ADMIN_URL + "/dashboard"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="View Dashboard"
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
              />
            </span>
                      <span className="menu-text">Dashboard</span>
                  </NavLink>
              </li>


              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                      "/my-results"
                  )}`}
              >
                  <NavLink className="menu-link" to={"/my-results"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="Add Results"
                  src={toAbsoluteUrl("/media/svg/icons/Files/Folder-check.svg")}
              />
            </span>
                      <span className="menu-text">Results</span>
                  </NavLink>
              </li>


              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                      ADMIN_URL + "/ANPRManager"
                  )}`}
              >
                  <NavLink className="menu-link" to={ADMIN_URL + "/ANPRManager"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="Vehicle Details"
                  src={toAbsoluteUrl("/media/svg/icons/Devices/Camera.svg")}
              />
            </span>
                      <span className="menu-text">Vehicle Details</span>
                  </NavLink>
              </li>
              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                      ADMIN_URL + "/ANPRViolation"
                  )}`}
              >
                  <NavLink className="menu-link" to={ADMIN_URL + "/ANPRViolation"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="ANPR Violatation"
                  src={toAbsoluteUrl("/media/svg/icons/Code/Warning-2.svg")}
              />
            </span>
                      <span className="menu-text">ANPR Violation</span>
                  </NavLink>
              </li>
              <li
                  className={`menu-item menu-item-rel ${getMenuItemActive(
                       "/notification-manager"
                  )}`}
              >
                  <NavLink className="menu-link" to={ "/notification-manager"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="Notification Manager"
                  src={toAbsoluteUrl("/media/svg/icons/General/User.svg")}
              />
            </span>
                      <span className="menu-text">Notification Manager</span>
                  </NavLink>
              </li>
          </>

      </ul>
    </>
  );
}
