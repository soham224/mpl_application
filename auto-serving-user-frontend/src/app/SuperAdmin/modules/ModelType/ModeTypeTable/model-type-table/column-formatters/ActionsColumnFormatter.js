import React from "react";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../_metronic/_helpers";

export function ActionsColumnFormatter(
  cellContent,
  row,
  rowIndex,
  { openEditModelTypeDialog }
) {
  return (
    <>
      {/*eslint-disable-next-line*/}
      <a
        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
        onClick={() => openEditModelTypeDialog(row.id)}
      >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG
            title="Edit Model Type"
            src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
          />
        </span>
      </a>
    </>
  );
}
