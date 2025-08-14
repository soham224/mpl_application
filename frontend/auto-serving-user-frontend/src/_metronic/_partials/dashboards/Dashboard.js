import React, { useMemo } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../layout";
import Demo2Dashboard from "./Demo2Dashboard";
export function Dashboard() {
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      demo: objectPath.get(uiService.config, "demo"),
    };
  }, [uiService]);
  return <>{layoutProps.demo === "demo1" && <Demo2Dashboard />}</>;
}
