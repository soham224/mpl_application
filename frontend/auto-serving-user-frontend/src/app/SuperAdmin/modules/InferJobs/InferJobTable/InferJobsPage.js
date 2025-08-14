import { Route } from "react-router-dom";
import React from "react";
import { InferJobsUIProvider } from "./InferJobsUIContext";
import { InferJobsCard } from "./InferJobsCard";
import { InferJobNewDialog } from "./infer-job-new-dialog/InferJobNewDialog";
import { InferJobsViewDialog } from "./infer-job-view-dialog/InferJobsViewDialog";

export function InferJobsPage({ history }) {
  const inferJobsPageBaseUrl = "/inferJobs/inferJobsPage";

  const inferJobsUIEvents = {
    newInferJobBtnClick: () => {
      history.push(`${inferJobsPageBaseUrl}/new`);
    },
    openViewInferJobBtnClick: (id) => {
      history.push(`${inferJobsPageBaseUrl}/${id}/view`);
    },
  };

  return (
    <InferJobsUIProvider inferJobsUIEvents={inferJobsUIEvents}>
      <Route path={`${inferJobsPageBaseUrl}/new`}>
        {({ history, match }) => (
          <InferJobNewDialog
            show={match != null}
            onHide={() => {
              history.push(inferJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${inferJobsPageBaseUrl}/:id/view`}>
        {({ history, match }) => (
          <InferJobsViewDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push(inferJobsPageBaseUrl);
            }}
          />
        )}
      </Route>
      <InferJobsCard />
    </InferJobsUIProvider>
  );
}
