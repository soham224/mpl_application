import React from "react";
import { Link, Redirect, Switch } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../../_metronic/layout";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import "../../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";
import RegistrationCompany from "./Registration";
import RegistrationUser from "./RegistrationUser";
import { connect, shallowEqual, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import Cookies from "universal-cookie";

function AuthPage(props) {
  const [path, setPath] = React.useState(window.location.pathname);
  // const user = useSelector((state) => state.auth.user, shallowEqual); //used to get roles
  const today = new Date().getFullYear();
  // eslint-disable-next-line

  const getToggledPath = () => {
    if (path === "/auth/login") return "/auth/registration";
    else if (path === "/auth/registration") return "/auth/login";
    else if (path === "/") setPath("/auth/login");
    else return "/auth/login";
  };

  const togglePath = () => {
    setPath(getToggledPath);
  };

  // eslint-disable-next-line
  const { isAuthorized = false, user } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user?.id && new Cookies().get("access_token"),
      user: auth.user
    }),
    shallowEqual
  );
  const handleClick = (event) => {
    event.preventDefault();
    if (window.location.host === "beta.tusker.ai") {
      window.location.href = "http://tusker.ai/";
    }
  };

  return (
    <>
      <div className="d-flex flex-column flex-root">
        {/*begin::Login*/}
        <div
          className="login login-1 login-signin-on d-flex flex-column flex-md-row flex-lg-row flex-sm-row flex-row-fluid bg-white "
          id="kt_login"
        >
          {/*begin::Aside*/}
          <div
            className=" displays1 login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"
            style={{
              backgroundImage: `url(${toAbsoluteUrl(
                "/media/bg/main-banner.jpg"
              )})`
            }}
          >
            {/*begin: Aside Container*/}
            <div className="d-flex flex-row-fluid flex-column justify-content-between">
              {/* start:: Aside header */}

              {/* end:: Aside header */}

              {/* start:: Aside content */}
              <div className="flex-column-fluid d-flex flex-column justify-content-center text-center px-4">
                {/* Company Name */}
                <div className="mb-6">
                  <a 
                    href="#"  
                    onClick={handleClick} 
                    target="_blank"
                    className="text-decoration-none d-inline-block text-center w-100"
                  >
                    <h3
                        className="text-white mb-2"
                        style={{
                          fontSize: '3.5rem',
                          lineHeight: '1',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Maithon Power Limited
                    </h3>
                  </a>
                </div>

                {/* Tagline and Description */}
                <div className="mb-5">
                  <div className="d-flex flex-column align-items-center">
                    <h2 
                      className="text-white mb-2"
                      style={{
                        fontSize: '1.7rem',
                        fontWeight: 500,
                        lineHeight: '1.3',
                        letterSpacing: '0.5px'
                      }}
                    >
                      No-Code AI Computer Vision Platform
                    </h2>
                    <h3
                      className="text-white"
                      style={{
                        fontSize: '1.7rem',
                        fontWeight: 500,
                        lineHeight: '1.3',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Image and Video Analytics
                    </h3>
                  </div>
                </div>
              </div>
              {/* end:: Aside content */}

              {/* start:: Aside footer for desktop */}
              {/*<div className="d-none flex-column-auto d-lg-flex justify-content-between mt-10">*/}
              <div className="mt-10 d-flex">
                <div className={"flex-column-fluid justify-content-left mr-2"}>
                  <span className="opacity-70 font-weight-bold text-white">
                    &copy; 2021-{today}{' '}
                  </span>
                  <span className="opacity-70 font-weight-bold	text-white">
                    powered by{' '}
                    <a
                      href="#"
                      onClick={handleClick}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-hover-primary"
                    >
                      Tusker AI
                    </a>
                  </span>
                </div>
              </div>
              {/* end:: Aside footer for desktop */}
            </div>
            {/*end: Aside Container*/}
          </div>
          <div className="flex-row-fluid d-flex flex-column position-relative p-7 overflow-hidden">
            <div className="delete_large d-flex justify-content-center" style={{marginTop: '100px'}}>

                  <img
                      className=" justify-content-center align-self-center"
                      style={{
                        maxWidth: '100px',
                        height: 'auto',
                        objectFit: 'contain'
                      }}
                      alt="Logo"
                      src={toAbsoluteUrl("/media/logos/mpl_logo.png")}
                  />
            </div>
            {/*begin::Aside*/}

            {/*begin::Content*/}

            {/*give the css for not scrolling autoserving and keep scrolling register page*/}

            {/*begin::Content header*/}

            <div className="position-absolute top-0 right-0 text-right mt-5 mb-15 mb-lg-0 flex-column-auto justify-content-center py-5 px-10">
              {!isAuthorized && path !== "/auth/registration" ? (
                <>
                  <span className="font-weight-bold text-dark-50">
                    {" "}
                    Don't have an account yet?
                  </span>
                  <Link
                    to={`${getToggledPath()}`}
                    onClick={togglePath}
                    className="font-weight-bold ml-2"
                    id="kt_login_signup"
                  >
                    Sign Up!
                  </Link>
                </>
              ) : (
                <>
                  <span className="font-weight-bold text-dark-50">
                    Already have an account?
                  </span>
                  <Link
                    to={`${getToggledPath()}`}
                    onClick={togglePath}
                    className="font-weight-bold ml-2"
                    id="kt_login_signup"
                  >
                    Log In!
                  </Link>
                </>
              )}
            </div>

            <div className="d-flex flex-column-fluid flex-center mt-lg-0">
              <Switch>
                <ContentRoute path="/auth/login" component={Login} />
                <ContentRoute
                  path="/auth/registration"
                  component={RegistrationCompany}
                />
                <ContentRoute
                  path="/auth/user-registration"
                  component={RegistrationUser}
                />
                <ContentRoute
                  path="/auth/forgot-password"
                  component={ForgotPassword}
                />

                <Redirect exact to="/auth/login" />
              </Switch>
            </div>
            {/*end::Content body*/}

            {/* begin::Mobile footer */}
            <div className="displays1 d-flex d-lg-none flex-column-auto flex-column flex-sm-row justify-content-between align-items-center mt-5 p-5">
              <div>
                <span className="delete_large text-dark-50 font-weight-bold order-2 order-sm-1 my-2">
                  {" "}
                  &copy; 2021-{today}
                  <a
                    href="http://tusker.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 text-dark-75 font-weight-bold ml-2 text-hover-primary"
                  >
                    powered by Tusker AI
                  </a>
                </span>
              </div>
            </div>
            <div className="delete_large">
              <div className="d-flex">
                <span className="opacity-70 font-weight-bold  flex-column-fluid flex-left">
                  {" "}
                  &copy; 2021-{today} powered by Tusker AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default injectIntl(connect(null, auth.actions)(AuthPage));
