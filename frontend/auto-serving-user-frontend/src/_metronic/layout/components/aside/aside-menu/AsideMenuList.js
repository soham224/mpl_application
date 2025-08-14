/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { checkIsActive, toAbsoluteUrl } from "../../../../_helpers";
import { ADMIN_URL } from "../../../../../enums/constant";
import {useSelector} from "react-redux";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();

  const getMenuItemActive = (url) => {
     return checkIsActive(location, url) ? "menu-item-active" : "";
  };

  const subscriptions = useSelector((state) => {
    return state.subscription.subscriptions;
  });


  return (
    <>
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        {subscriptions && (
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
        )}

        {subscriptions && (
          <li
            className={`menu-item menu-item-rel ${getMenuItemActive(
              "/my-results"
            )}`}
          >
            <NavLink className="menu-link" to={"/my-results"}>
              <span className="svg-icon menu-icon">
                <SVG
                  title="Add Vioaltions"
                  src={toAbsoluteUrl("/media/svg/icons/Files/Folder-check.svg")}
                />
              </span>
              <span className="menu-text">Results</span>
            </NavLink>
          </li>
        )}

        <li
          className={`menu-item menu-item-rel ${getMenuItemActive(
              ADMIN_URL +  "/locations"
          )}`}
        >
          <NavLink className="menu-link" to={ADMIN_URL + "/locations"}>
            <span className="svg-icon menu-icon">
              <SVG
                title="Add Locations"
                src={toAbsoluteUrl("/media/svg/icons/Home/Building.svg")}
              />
            </span>
            <span className="menu-text">Locations</span>
          </NavLink>
        </li>
        <li
          className={`menu-item menu-item-rel ${getMenuItemActive(
            ADMIN_URL + "/addSupervisor"
          )}`}
        >
          <NavLink className="menu-link" to={ADMIN_URL + "/addSupervisor"}>
            <span className="svg-icon menu-icon">
              <SVG
                title="Add Supervisor"
                src={toAbsoluteUrl(
                  "/media/svg/icons/Communication/Shield-user.svg"
                )}
              />
            </span>
            <span className="menu-text">Supervisor</span>
          </NavLink>
        </li>
        <li
            className={`menu-item menu-item-rel ${getMenuItemActive(
                "/notification-manager"
            )}`}
        >
          <NavLink className="menu-link" to={"/notification-manager"}>
            <span className="svg-icon menu-icon">
              <SVG
                  title="Notification Manager"
                  src={toAbsoluteUrl("/media/svg/icons/General/User.svg")}
              />
            </span>
            <span className="menu-text">Notification Manager</span>
          </NavLink>
        </li>
      </ul>
      </>

  );
}
