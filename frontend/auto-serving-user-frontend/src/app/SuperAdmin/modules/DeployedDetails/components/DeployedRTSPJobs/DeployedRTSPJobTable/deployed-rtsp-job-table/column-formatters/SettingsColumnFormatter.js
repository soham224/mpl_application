import React from "react";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import LabelIcon from "@material-ui/icons/Label";

export function SettingsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openViewLabelSettingsDialog, openViewCameraSettingsDialog }
) {
  return (
    <>
      {/*eslint-disable-next-line*/}
      <a
        title="Label Settings"
        className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
        onClick={() => openViewLabelSettingsDialog(row.id)}
      >
        <span
          title="Open Lable Settings"
          className="svg-icon svg-icon-md svg-icon-light-inverse"
          style={{ color: "#147b82", transform: "rotate(180deg)" }}
        >
          <LabelIcon />
        </span>
      </a>
      {/*eslint-disable-next-line*/}
      <a
        title="Label Settings"
        className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
        onClick={() => openViewCameraSettingsDialog(row.id)}
      >
        <span
          title="Open Camera Settings"
          className="svg-icon svg-icon-md svg-icon-light-inverse"
          style={{ color: "#147b82" }}
        >
          <CameraEnhanceIcon />
        </span>
      </a>
    </>
  );
}
