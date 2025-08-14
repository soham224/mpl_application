import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openViewInferJobDialog }
) {
  return (
    <>
      {/*eslint-disable-next-line*/}
      <a
        className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
        onClick={() => openViewInferJobDialog(row.id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            title="Infer Job Information"
            src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}
          />
        </span>
      </a>
    </>
  );
}
