/* eslint-disable */
import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../../_metronic/_helpers";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openViewDeploymentJobDialog, openStartDeploymentJobBtnClick }
) {
  return (
    <>
      {/*eslint-disable-next-line*/}
      <a
        className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
        onClick={() => openViewDeploymentJobDialog(row.id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            title="Deployment Information"
            src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}
          />
        </span>
      </a>
      <a>
        <button
          type="button"
          disabled={row.status}
          onClick={() => openStartDeploymentJobBtnClick(row.id)}
          className={`btn btn-primary font-weight-bold mr-2`}
        >
          Deploy
        </button>
      </a>
    </>
  );
}
