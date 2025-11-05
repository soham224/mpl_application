import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "../app/Admin/modules/Auth/_redux/authRedux";

import { DeploymentJobsSlice } from "../app/Admin/modules/Subscriptions/_redux/DeploymentJobs/DeploymentJobsSlice";
import { DeploymentRTSPJobsSlice } from "../app/Admin/modules/Subscriptions/_redux/DeploymentRTSPJobs/DeploymentRTSPJobsSlice";
import { DeployedJobsSlice } from "../app/Admin/modules/Subscriptions/_redux/DeployedJobs/DeployedJobsSlice";
import { DeployedRTSPJobsSlice } from "../app/Admin/modules/Subscriptions/_redux/DeployedRTSPJobs/DeployedRTSPJobsSlice";
import { MyResultSlice } from "../app/Admin/modules/MyResults/_redux/MyResultSlice";
import { LocationSlice } from "../app/Admin/modules/Locations/_redux/LocationSlice";
import userReducer from "./subscriptionReducer";

//super admin slices
import { AiModelSlice } from "../app/SuperAdmin/modules/AIModel/_redux/AiModelSlice";
import { S3DataHandlerSlice } from "../app/SuperAdmin/modules/AIModelWizard/_redux/S3DataHandler/S3DataHandlerSlice";
import { TrainingSettingsSlice } from "../app/SuperAdmin/modules/AIModelWizard/_redux/TrainingSettings/TrainingSettingsSlice";
import { ModelBannerImageSlice } from "../app/SuperAdmin/modules/AIModelWizard/_redux/ModelBannerImage/ModelBannerImageSlice";
import { ModelResultImageSlice } from "../app/SuperAdmin/modules/AIModelWizard/_redux/ModelResultImage/ModelResultImageSlice";
import { DeviceSlice } from "../app/SuperAdmin/modules/Device/_redux/DeviceSlice";
import { UserSlice } from "../app/SuperAdmin/modules/Users/_redux/UserSlice";
import { ModelTypeSlice } from "../app/SuperAdmin/modules/ModelType/_redux/ModelTypeSlice";
import { FrameworkDetailsSlice } from "../app/SuperAdmin/modules/FrameworkDetails/_redux/FrameworkDetailsSlice";
import { DeploymentTypeSlice } from "../app/SuperAdmin/modules/DeploymentType/_redux/DeploymentTypeSlice";
import { DeploymentJobsSlice1 } from "../app/SuperAdmin/modules/DeploymentDetails/_redux/DeploymentJobs/DeploymentJobsSlice";
import { InferJobsSlice } from "../app/SuperAdmin/modules/InferJobs/_redux/InferJobsSlice";
import { DeploymentRTSPJobsSlice1 } from "../app/SuperAdmin/modules/DeploymentDetails/_redux/DeploymentRTSPJobs/DeploymentRTSPJobsSlice";
import { DeployedJobsSlice1 } from "../app/SuperAdmin/modules/DeployedDetails/_redux/DeployedJobs/DeployedJobsSlice";
import { DeployedRTSPJobsSlice1 } from "../app/SuperAdmin/modules/DeployedDetails/_redux/DeployedRTSPJobs/DeployedRTSPJobsSlice";
import { MyResultSlice1 } from "../app/SuperAdmin/modules/MyResult/_redux/MyResultSlice";

//result manager slices
import { MyResultSliceResultManager } from "../app/ResultManager/modules/MyResults/_redux/MyResultSlice";
import {MyEventSliceResultManager} from "../app/ResultManager/modules/MyEvents/_redux/MyEventSlice";
import {AnprManagerSlice} from "../app/Admin/modules/ANPRManager/_redux/AnprManagerSlice";
import {NotificationManagerSlice} from "../app/Admin/modules/NotificationManager/_redux/NotificationManagerSlice";

export const rootReducer = combineReducers({
  auth: auth.reducer,

  deploymentJobs: DeploymentJobsSlice.reducer,
  deploymentRTSPJobs: DeploymentRTSPJobsSlice.reducer,
  deployedJobs: DeployedJobsSlice.reducer,
  deployedRTSPJobs: DeployedRTSPJobsSlice.reducer,
  myResult: MyResultSlice.reducer,
  location: LocationSlice.reducer,
  notificationManager:NotificationManagerSlice.reducer,
  subscription: userReducer,

  //super admin reducers
  aiModel: AiModelSlice.reducer,
  s3DataHandler: S3DataHandlerSlice.reducer,
  trainingSettings: TrainingSettingsSlice.reducer,
  modelBannerImage: ModelBannerImageSlice.reducer,
  modelResultImage: ModelResultImageSlice.reducer,
  device: DeviceSlice.reducer,
  users: UserSlice.reducer,
  modelType: ModelTypeSlice.reducer,
  frameworkDetails: FrameworkDetailsSlice.reducer,
  deploymentType: DeploymentTypeSlice.reducer,
  inferJobs: InferJobsSlice.reducer,
  deploymentJobs1: DeploymentJobsSlice1.reducer,
  deploymentRTSPJobs1: DeploymentRTSPJobsSlice1.reducer,
  deployedJobs1: DeployedJobsSlice1.reducer,
  deployedRTSPJobs1: DeployedRTSPJobsSlice1.reducer,
  myResult1: MyResultSlice1.reducer,

  //result manager reducers
  myResultSliceResultManager: MyResultSliceResultManager.reducer,
  MyEventSliceResultManager: MyEventSliceResultManager.reducer,
  anprManager: AnprManagerSlice.reducer

});

export function* rootSaga() {
  yield all([auth.saga()]);
}
