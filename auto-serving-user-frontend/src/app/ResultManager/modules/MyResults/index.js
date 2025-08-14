import React from "react";
import DeployedRTSPJobs from "./components/DeployedRTSPJobs";
import { useSubheader } from "../../../../_metronic/layout";

export function MyResults() {
  const subheader = useSubheader();
  subheader.setTitle("Violation");

  return <DeployedRTSPJobs />;
}
