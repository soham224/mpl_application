import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

export function CompanyServiceAccessModal({
  showAlert,
  handleAccessUserClose,
  handleUserStatus,
  id,
  status,
  userStatusLoader,
  successIcon
}) {
  return (
    <>
      <SweetAlert
        info={!successIcon}
        success={successIcon}
        showCancel={!successIcon}
        showConfirm={!successIcon}
        closeOnClickOutside={""}
        confirmBtnText="Confirm"
        confirmBtnBsStyle="primary"
        cancelBtnBsStyle="light"
        title={`${
          successIcon
            ? "Status Changed Successfully"
            : "Are you sure ? to Change the Status"
        }`}
        onConfirm={() => {
          handleUserStatus(id, status);
        }}
        onCancel={handleAccessUserClose}
        show={showAlert}
        focusCancelBtn
      >
        {userStatusLoader ? (
          <div className="overlay-layer bg-transparent">
            <div className="spinner-border text-info text-center" />
          </div>
        ) : (
          <></>
        )}
      </SweetAlert>
    </>
  );
}
