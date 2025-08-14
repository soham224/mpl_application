import React from "react";
import { CustomInput } from "reactstrap";

export function StatusColumnFormatter(
  cellContent, // display the proper content
  row,
  rowIndex, //formatter call
  { openChangeStatusDeploymentTypeDialog }
) {
  return (
    <>
      <div style={{ textAlign: "center" }} className={"mt-2"}>
        <CustomInput
          type="switch"
          id={row.id}
          checked={row.status}
          className="mb-2 mr-2 custom-pointer"
          onChange={() => {
            openChangeStatusDeploymentTypeDialog(row.id, !row.status);
          }}
        />
      </div>
    </>
  );
}
