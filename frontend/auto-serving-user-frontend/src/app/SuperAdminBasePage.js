import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute, LayoutSplashScreen } from "../_metronic/layout";
import { DashboardPage } from "./Admin/pages/DashboardPage";
import { MyResultPage } from "./SuperAdmin/modules/MyResult/MyResultTable/MyResultPage";
import Device from "./SuperAdmin/modules/Device";
import ModelType from "./SuperAdmin/modules/ModelType";
import FrameworkDetails from "./SuperAdmin/modules/FrameworkDetails";
import DeploymentType from "./SuperAdmin/modules/DeploymentType";
import InferJobs from "./SuperAdmin/modules/InferJobs";
import DeploymentDetails from "./SuperAdmin/modules/DeploymentDetails";
import DeployedDetails from "./SuperAdmin/modules/DeployedDetails";
import AIModel from "./SuperAdmin/modules/AIModel";
import {CompanyServicePage} from "./Admin/pages/companyService";
import {NotificationSendPage} from "./Admin/pages/NotificationSendPage";

export default function SuperAdminBasePage(props) {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/myResult" component={MyResultPage} />
        {/*<ContentRoute path="/users" component={Users} />*/}
        <ContentRoute path="/device" component={Device} />
        <ContentRoute path="/modelType" component={ModelType} />
        <ContentRoute path="/frameworkDetails" component={FrameworkDetails} />
        <ContentRoute path="/deploymentType" component={DeploymentType} />
        <ContentRoute path="/inferJobs" component={InferJobs} />
        <ContentRoute path="/aiModel" component={AIModel} {...props} />
        <ContentRoute path="/deploymentDetails" component={DeploymentDetails} />
        <ContentRoute path="/deployedDetails" component={DeployedDetails} />
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/users" component={CompanyServicePage} />
        <ContentRoute path="/NotificationSend" component={NotificationSendPage} />
        {/*<ContentRoute path="/my-page" component={MyPage}/>*/}
        <Redirect to="error/error-v3" />
      </Switch>
    </Suspense>
  );
}
