import React from "react";
import { CustomInput } from "reactstrap";

export function StatusColumnFormatter(
  cellContent, // display the proper content
  row,
  rowIndex, //formatter call
  { openChangeStatusDialog, isDeprecatedStatus }
) {
  const [id, status] = isDeprecatedStatus
    ? ["d" + row.id, row.is_deprecated]
    : ["s" + row.id, row.status];

  return (
    <>
      <div style={{ textAlign: "center" }} className={"mt-2"}>
        <CustomInput
          type="switch"
          id={id}
          checked={status}
          className="mb-2 mr-2 custom-pointer"
          onChange={() =>
            openChangeStatusDialog(row.id, !status, isDeprecatedStatus)
          }
        />
      </div>
    </>
  );
}
