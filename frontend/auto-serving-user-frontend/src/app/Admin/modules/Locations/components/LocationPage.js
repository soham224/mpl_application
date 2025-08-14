import { Route } from "react-router-dom";
import React from "react";
import { LocationUIProvider } from "./LocationUIContext";
import { LocationCard } from "./LocationCard";
import { LocationEditDialog } from "./location-details-edit-dialog/LocationEditDialog";
import { ADMIN_URL } from "../../../../../enums/constant";

export function LocationPage({ history }) {
  const locationPageBaseUrl = ADMIN_URL + "/locations";

  const locationUIEvents = {
    newLocationBtnClick: () => {
      history.push(`${locationPageBaseUrl}/new`);
    },
    changeStatusLocationBtnClick: (id, status, isDeprecatedStatus) => {
      history.push(
        `${locationPageBaseUrl}/${id}/${status}/${isDeprecatedStatus}/changeStatus`
      );
    },
    editLocationBtnClick: (id) => {
      history.push(`${locationPageBaseUrl}/${id}/edit`);
    },
  };

  return (
    <LocationUIProvider locationUIEvents={locationUIEvents}>
      <Route path={`${locationPageBaseUrl}/new`}>
        {({ history, match }) => (
          <LocationEditDialog
            show={match != null}
            onHide={() => {
              history.push(locationPageBaseUrl);
            }}
          />
        )}
      </Route>
      <Route path={`${locationPageBaseUrl}/:id/edit`}>
        {({ history, match }) => (
          <LocationEditDialog
            show={match != null}
            id={match?.params.id}
            onHide={() => {
              history.push(locationPageBaseUrl);
            }}
          />
        )}
      </Route>
      <LocationCard />
    </LocationUIProvider>
  );
}
