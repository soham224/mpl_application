/* eslint-disable */
import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openViewDeployedRTSPJobDialog, openStopDeploymentRTSPJobDialog }
) {
  return (
    <>
      {/*eslint-disable-next-line*/}
      <a
        className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
        onClick={() => openViewDeployedRTSPJobDialog(row.id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            title="Deployed RTSP Job Information"
            src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}
          />
        </span>
      </a>
      <a>
        <button
          type="button"
          disabled={row.instance_status === "terminated"}
          onClick={() => openStopDeploymentRTSPJobDialog(row.id)}
          className={`btn btn-danger font-weight-bold mr-2`}
        >
          Terminate
        </button>
      </a>
    </>
  );
}
