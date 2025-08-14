import React, { useState } from "react";
import { MyResultUIProvider } from "./MyResultUIContext";
import { MyResultCard } from "./MyResultCard";

export function MyResultPage() {
  const [row, setRow] = useState({});
  const [show, setShow] = useState(false);

  const myResultUIEvents = {
    openViewMyResultBtnClick: (id, row, cameraName) => {
      row["camera_name"] = cameraName[parseInt(row.camera_id)];
      setRow(row);
      setShow(true);
    }
  };

  return (
    <MyResultUIProvider myResultUIEvents={myResultUIEvents}>
      <MyResultCard />
    </MyResultUIProvider>
  );
}
