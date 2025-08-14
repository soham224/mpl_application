import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { UsersTable } from "./users-table/UsersTable";
import { useUsersUIContext } from "./UsersUIContext";

export function UsersCard() {
  const usersUIContext = useUsersUIContext();
  const usersUIProps = useMemo(() => {
    return {
      newUserButtonClick: usersUIContext.newUserButtonClick,
    };
  }, [usersUIContext]);

  return (
    <Card>
      <CardHeader title="Users Data">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={usersUIProps.newUserButtonClick}
          >
            Add User
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <UsersTable />
      </CardBody>
    </Card>
  );
}
