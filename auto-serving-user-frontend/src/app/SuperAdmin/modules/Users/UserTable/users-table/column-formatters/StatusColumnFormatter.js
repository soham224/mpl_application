import React from "react";
import { CustomInput } from "reactstrap";

export function StatusColumnFormatter(
  cellContent, // display the proper content
  row,
  rowIndex, //formatter call
  { openChangeStatusDialog }
) {
  return (
    <>
      <div style={{ textAlign: "center" }} className={"mt-2"}>
        <CustomInput
          type="switch"
          id={row.id}
          checked={row.user_status}
          className="mb-2 mr-2 custom-pointer"
          onChange={() => openChangeStatusDialog(row.id, !row.user_status)}
        />
      </div>
    </>
  );
}
