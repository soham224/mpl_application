import React from "react";
import {useSubheader} from "../../../_metronic/layout";
import Locations from "../modules/Locations";

export const LocationPage = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Location");

  return <Locations/>;
};
