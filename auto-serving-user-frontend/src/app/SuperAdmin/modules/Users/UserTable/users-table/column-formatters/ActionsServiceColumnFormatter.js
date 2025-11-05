import React from "react";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../../../_metronic/_helpers";

export function ActionsServiceColumnFormatter(
    cellContent,
    row,
    rowIndex,
    {openUserServiceDialog}
) {
    return (
        <>
            {/*eslint-disable-next-line*/}
            <a
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => openUserServiceDialog(row.id)}
            >
        <span className="svg-icon svg-icon-md svg-icon-primary">
          <SVG title="Edit Framework" src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}/>
        </span>
            </a>
        </>
    );
}
