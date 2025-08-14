// please be familiar with react-bootstrap-table-next column formaters
// https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Work%20on%20Columns&selectedStory=Column%20Formatter&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import SVG from "react-inlinesvg/lib";
import {toAbsoluteUrl} from "../../../../../../../../../_metronic/_helpers";

export function ActionsColumnFormatter(
    cellContent,
    row,
    rowIndex,
    {openEditAIModelDialog, openViewAIModelsDetailsDialog}
) {
    return (
        <>
            {/*eslint-disable-next-line*/}
            <a
                title="Edit user"
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => openEditAIModelDialog(row.id)}
            >
                <span className="svg-icon svg-icon-md svg-icon-primary">
                  <SVG title="Edit Model Data" src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}/>
                </span>
            </a>

            {/*eslint-disable-next-line*/}
            <a
                title="Information"
                className="btn btn-icon btn-light btn-hover-light-inverse btn-sm mx-3"
                onClick={() => openViewAIModelsDetailsDialog(row.id)}
            >
                <span className="svg-icon svg-icon-md svg-icon-light-inverse">
                  <SVG title="View Model Data" src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}/>
                </span>
            </a>
        </>
    );
}
