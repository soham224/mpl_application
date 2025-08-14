import { shallowEqual, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { warningToast } from "../../../../utils/ToastMessage";
import SelectCameraPlot from "./selectCameraPlot";

export function PlotRegionPage({ openROIModal, id, setOpenROIModal }) {
  const { entities } = useSelector(
    state => ({
      entities: state.deployedRTSPJobs.entities
    }),
    shallowEqual
  );

  const [deployedJobsFetchedById, setDeployedJobsFetchedById] = useState({});

  // eslint-disable-next-line
  const [cameraOptions, setCameraOptions] = useState([]);
  // eslint-disable-next-line
  const [selectedCamera, setSelectedCamera] = useState([]);

  useEffect(() => {
    if (id && entities) {
      const deployedJob = entities.filter(d => d.id === id * 1);
      if (deployedJob.length) {
        setDeployedJobsFetchedById(deployedJob[0]);
      } else warningToast("No deployed job found with that id");
    }
  }, [id, entities, openROIModal, cameraOptions, selectedCamera]);

  const totalCameras =
    deployedJobsFetchedById?.deployment_job_rtsp_details?.camera_settings;

  return (
    <>
      <SelectCameraPlot
        totalCameras={totalCameras}
        openModal={openROIModal}
        setOpenROIModal={setOpenROIModal}
      />
    </>
  );
}
