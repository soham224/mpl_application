import React, {useEffect, useState} from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./Admin/modules/Auth";
import ErrorsPage from "./Admin/modules/ErrorsExamples/ErrorsPage";
import Cookies from "universal-cookie";
import AdminBasePage from "./AdminBasePage";
import SuperAdminBasePage from "./SuperAdminBasePage";
import ResultManagerBasePage from "./ResultManagerBasePage";
import {
    ADMIN_ROLE,
    ADMIN_URL, REPORTER_MANAGER_ROLE,
    RESULT_MANAGER_ROLE, SECURITY_MANAGER_ROLE,
    SUPER_ADMIN_ROLE
} from "../enums/constant";
import {getAllDeployedRTSPJobsDetails} from "./Admin/modules/Subscriptions/_redux/DeployedRTSPJobs/DeployedRTSPJobsApi";
import {setSubscription} from "../redux/subscriptionReducer";
import {warningToast} from "../utils/ToastMessage";
import SecurityResultManagerBasePage from "./SecurityManagerBasePage";
import SecurityManagerBasePage from "./SecurityManagerBasePage";

export function Routes() {

    const [user1, setUser] = useState("");
  const { isAuthorized = false, user } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user?.id && new Cookies().get("access_token"),
      user: auth.user
    }),
    shallowEqual
  );
    const dispatch = useDispatch();

    useEffect(() => {
        if (user1 === "") {
            getAllDeployedRTSPJobsDetails()
                .then(response => {
                    if (response && response.isSuccess) {
                        dispatch(setSubscription(true));
                        setUser(true);
                    }
                })
                .catch(error => {
                    setUser(false);
                    dispatch(setSubscription(false));
                    if (error.detail) {
                        warningToast(error.detail);
                    } else {
                        warningToast("Something went Wrong");
                    }
                });
        }

    }, []);

  return (
    <Switch>
      {!isAuthorized && (
        <Route>
          <AuthPage />
        </Route>
      )}
      <Route path="/error" component={ErrorsPage} />
      <Route path="/logout" component={Logout} />
      <Route path="/auth/login" component={AuthPage} />
      <Redirect exact from="/" to="/auth/login" />
      <Redirect
        exact
        from={ADMIN_URL + "/subscriptions"}
        to={ADMIN_URL + "/subscriptions/deployedJobsPage"}
      />
      {!isAuthorized ? (
        user?.company ? (
          <Redirect to="/auth/user-registration" />
        ) : (
          <Redirect to="/auth/login" />
        )
      ) : (
<>
        <Layout>
          {user?.roles[0].role === ADMIN_ROLE ? (
            <AdminBasePage />
          ) : user?.roles[0].role === SUPER_ADMIN_ROLE ? (
            <SuperAdminBasePage />
          ) : user?.roles[0].role === RESULT_MANAGER_ROLE ? (
            <ResultManagerBasePage />
          ) : user?.roles[0].role === REPORTER_MANAGER_ROLE ? (
              <SecurityManagerBasePage />
          ) : (
            <BasePage />
          )}
        </Layout>
</>
      )}
    </Switch>
  );
}
