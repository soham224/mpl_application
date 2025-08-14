/* eslint-disable */
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import {shallowEqual, useSelector} from "react-redux";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import {Col, Row} from "react-bootstrap";

export function UserProfileDropdown() {
  const { user } = useSelector((state) => state.auth);
  const uiService = useHtmlClassService();
  const regexImage = /\.(gif|jpe?g|tiff?|png|webp|bmp|ico|svg)$/i
  const layoutProps = useMemo(() => {
    return {
      light:
        objectPath.get(uiService.config, "extras.user.dropdown.style") !==
        "light",
    };
  }, [uiService]);
  const {userRole} = useSelector(
      ({auth}) => ({
        userRole: auth.user?.roles?.length && auth.user.roles[0]?.role
      }),
      shallowEqual
  );

  return (
      <Dropdown drop="down" alignRight>
        <Dropdown.Toggle
            as={DropdownTopbarItemToggler}
            id="dropdown-toggle-user-profile"
        >
          {userRole !== "superadmin" && userRole !== "resultmanager" ?
          <div
          >
          <span>
            Hi,
          </span>{" "}
            <span className="font-weight-bolder">
            {user?.company?.company_name}
            </span>{" "}
            <span className="symbol symbol-35">
              <span className="text-white symbol-label font-size-h5 font-weight-bold cursor-pointer" style={{backgroundColor : "#147b82"}}>
              {user?.company?.company_name[0]}
            </span>
          </span>
          </div> :
              <div className="navi-footer px-8 py-5 text-right">
                <Link
                    to="/logout"
                    className="btn btn-light-primary font-weight-bold"
                >
                  Sign Out
                </Link>
              </div>}
        </Dropdown.Toggle>
        <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
          <>
            {/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
            {layoutProps.light && (
                <>
                  <div className="d-flex align-items-center p-8 rounded-top" style={{minHeight: '100px'}}>
                    <div className="d-flex align-items-center w-100">
                      <div className="symbol symbol-50 symbol-light mr-5">
                        <img
                            className="h-50 align-self-center"
                            style={{
                              maxWidth: '100px',
                              height: 'auto',
                              objectFit: 'contain'
                            }}
                            alt="Logo"
                            src={userRole !== "superadmin" && userRole !== "resultmanager" && (regexImage).test(user?.company?.company_description) ? user?.company?.company_description : toAbsoluteUrl("/media/logos/mpl_logo.png")}
                        />
                      </div>
                      <div className="d-flex flex-column">
                        {userRole !== "superadmin" && userRole !== "resultmanager" && (
                          <>
                            <span className="font-weight-bolder font-size-lg text-dark-75 mb-1">
                              {user.company?.company_name || 'N/A'}
                            </span>
                            <span className="text-muted font-weight-bold">
                              {user.user_email || ''}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="separator separator-solid"></div>

                </>
            )}

          </>

          <div className="navi-footer px-8 py-5 text-right">
            <Link
                to="/logout"
                className="btn btn-light-primary font-weight-bold"
            >
              Sign Out
            </Link>
          </div>
        </Dropdown.Menu>
      </Dropdown>
  );
}
