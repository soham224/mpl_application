import React from "react";
import DeployedRTSPJobs from "./components/DeployedRTSPJobs";
import { useSubheader } from "../../../../_metronic/layout";

export function MyEventView() {
  const subheader = useSubheader();
  subheader.setTitle("Events Manager");

  return <DeployedRTSPJobs />;
}
