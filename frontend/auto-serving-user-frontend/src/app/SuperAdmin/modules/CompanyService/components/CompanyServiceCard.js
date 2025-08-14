import React, { useEffect, useState } from "react";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { CompanyServiceTable } from "./company-service-details-table/CompanyServiceTable";
import { Col, Row } from "reactstrap";
import CardHeader from "@material-ui/core/CardHeader";
import { Button, Form } from "react-bootstrap";
import { warningToast } from "../../../../../utils/ToastMessage";
import {
  getAllCompany,
  getAllRoles,
  getAllUser,
  getAllUserByRoldId,
  getAllUserByStatus,
  getUserByCompanyId
} from "../_redux";
import {
  ClickAwayListener,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup
} from "@material-ui/core";
import Popper from "@material-ui/core/Popper/Popper";
import Tooltip from "@material-ui/core/Tooltip";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import AddUserModal from "./addUserModal";
import { addCompany, saveUser } from "../../Users/_redux/users.api";

export function CompanyServiceCard() {
  const [companyListOptions, setCompanyListOptions] = useState([]);
  const [companyListLoader, setCompanyListLoader] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [userListLoader, setUserListLoader] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [userFilter, setUserFilter] = useState(null);
  const [roleValue, setRoleValue] = useState("");
  const [roleId, setRoleId] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [addUserModalShow, setAddUserModalShow] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [userTotalCount, setUserTotalCount] = useState(null);
  const [searchNameFilter, setSearchNameFilter] = useState("");

  const getAllUserList = (pageNo, pageSize) => {
    setUserListLoader(true);
    getAllUser(pageNo, pageSize)
      .then(response => {
        if (response && response?.isSuccess) {
          setAllUserData(response?.data?.items);
          setPageSize(response?.data?.size);
          setPageNo(response?.data?.page);
          setUserTotalCount(response?.data?.total);
          setUserListLoader(false);
        }
      })
      .catch(e => {
        setUserListLoader(false);
        warningToast("Something went wrong");
      });
  };

  useEffect(() => {
    if (selectedFilter === "user") {
      if (userFilter) {
        getAllUserByCompanyID(userFilter, pageNo, pageSize);
      }
    } else if (selectedFilter === "roles") {
      if (roleId) {
        getAllUserListByRoldId(roleId, pageNo, pageSize);
      }
    } else if (selectedFilter === "status") {
      getAllUserListByStatus(statusValue, pageNo, pageSize);
    } else {
      getAllUserList(pageNo, pageSize);
    }
  }, [pageNo, pageSize]);

  const handleClickFilter = event => {
    setShowFilter(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClickAway = () => {
    setShowFilter(false);
  };

  const handleClickFilterSubmenu = searchName => {
    setSearchNameFilter(searchName);
    if (searchName === "user") {
      setSelectedFilter("user");
      getAllCompanyList();
    } else if (searchName === "roles") {
      setSelectedFilter("roles");
      getAllRolsList();
    } else if (searchName === "status") {
      setSelectedFilter("status");
    }
  };

  const getAllCompanyList = () => {
    setCompanyListLoader(true);
    getAllCompany()
      .then(response => {
        if (response && response.isSuccess) {
          let companyListOptions = [];
          response.data.map((item, index) => {
            companyListOptions.push({
              label: item.company_name,
              value: item.id
            });
            return null;
          });
          setCompanyListOptions(companyListOptions);
          setCompanyListLoader(false);
        }
      })
      .catch(e => {
        setCompanyListLoader(false);
        warningToast("Something went wrong");
      });
  };

  const getAllRolsList = () => {
    setUserListLoader(true);
    getAllRoles()
      .then(response => {
        if (response && response.isSuccess) {
          setAllRoles(response.data);
          setUserListLoader(false);
        }
      })
      .catch(e => {
        setUserListLoader(false);
        warningToast("Something went wrong");
      });
  };

  const compunyUserApplyFilter = user => {
    if (userFilter === user.value) {
      setUserFilter(null);
    } else {
      setUserFilter(user.value);
    }
  };

  const applyFilter = () => {
    if (selectedFilter === "user") {
      if (userFilter) {
        getAllUserByCompanyID(userFilter, pageNo, pageSize);
      }
    } else if (selectedFilter === "roles") {
      if (roleId) {
        getAllUserListByRoldId(roleId, pageNo, pageSize);
      }
    } else if (selectedFilter === "status") {
      getAllUserListByStatus(statusValue, pageNo, pageSize);
    }
    setShowFilter(false);
  };

  const getAllUserByCompanyID = (id, pageNo, pageSize) => {
    setUserListLoader(true);
    getUserByCompanyId(id, pageNo, pageSize)
      .then(response => {
        if (response && response?.isSuccess) {
          setAllUserData(response?.data?.items);
          setPageSize(response?.data?.size);
          setPageNo(response?.data?.page);
          setUserTotalCount(response?.data?.total);
          setUserListLoader(false);
        }
      })
      .catch(e => {
        setUserListLoader(false);
        warningToast("Something went wrong");
      });
  };

  const getAllUserListByRoldId = (id, pageNo, pageSize) => {
    setUserListLoader(true);
    getAllUserByRoldId(id, pageNo, pageSize)
      .then(response => {
        if (response && response?.isSuccess) {
          setAllUserData(response?.data?.items);
          setPageSize(response?.data?.size);
          setPageNo(response?.data?.page);
          setUserTotalCount(response?.data?.total);
          setUserListLoader(false);
        }
      })
      .catch(e => {
        if (e.detail) {
          warningToast(e.detail);
        } else {
          warningToast("Something went wrong");
        }
        setUserListLoader(false);
      });
  };

  const getAllUserListByStatus = (statusValue, pageNo, pageSize) => {
    setUserListLoader(true);
    getAllUserByStatus(statusValue, pageNo, pageSize)
      .then(response => {
        if (response && response?.isSuccess) {
          setAllUserData(response?.data?.items);
          setPageSize(response?.data?.size);
          setPageNo(response?.data?.page);
          setUserTotalCount(response?.data?.total);
          setUserListLoader(false);
        }
      })
      .catch(e => {
        if (e.detail) {
          warningToast(e.detail);
        } else {
          warningToast("Something went wrong");
        }
        setUserListLoader(false);
      });
  };

  const clearFilter = () => {
    setUserFilter(null);
    setSelectedFilter("");
    setStatusValue("");
    setRoleId(null);
  };

  const handleSearchChange = event => {
    // console.log(
    //   "event::handleSearchChange::",
    //   event,
    //   event.target.name,
    //   event.target.value
    // );
  };

  const handleRoleChange = data => {
    if (roleValue) {
      setRoleValue("");
    }
    setRoleValue(data?.role);
    setRoleId(data?.id);
  };

  const handleStatusChange = event => {
    setStatusValue(event.target.value);
  };

  const addUserModal = () => {
    setAddUserModalShow(true);
  };

  const addUserModalClose = () => {
    setAddUserModalShow(false);
  };

  const saveUserApply = user => {
    setAddUserModalShow(false);
    CreateCompunys(user);
  };

  const CreateCompunys = userData => {
    const data = {
      company_email: userData.companyEmail,
      company_name: userData.companyName,
      company_description: userData.companyDescription,
      company_address: userData.companyAddress,
      company_pin_code: userData.companyPinCode,
      company_website: userData.companyWebsite,
      company_contact: userData.companyContact,
      company_poc: userData.companyPoc,
      company_poc_contact: userData.companyPocContact,
      company_status: userData.status,
      deployment_region: "Mumbai"
    };

    if (data) {
      addCompany(data)
        .then(response => {
          if (response && response.isSuccess) {
            let data = response.data;
            if (data) {
              createUsers(userData, data.id);
            }
          }
        })
        .catch(e => {
          if (e.detail) {
            warningToast(e.detail);
          } else {
            warningToast("Something went wrong");
          }
        });
    }
  };

  const createUsers = (userData, companyId) => {
    const data = {
      user_email: userData?.userEmail,
      user_status: true,
      company_id: companyId,
      user_password: userData?.userPassword
    };
    if (data) {
      saveUser(data)
        .then(response => {
          if (response && response.isSuccess) {
            let data = response.data;
            if (data) {
              getAllUserList();
            }
          }
        })
        .catch(e => {
          if (e.detail) {
            warningToast(e.detail);
          } else {
            warningToast("Something went wrong");
          }
        });
    }
  };

  return (
    <>
      <Card className="example example-compact">
        <CardBody style={{ padding: "10px 10px" }}>
          <Row>
            <Col xl={8} xs={12} md={5}>
              <CardHeader title="User Data" />
            </Col>
            <Col xl={2} xs={12} md={4}>
              <input
                type="text"
                autoFocus={true}
                placeholder="Search..."
                // value={searchValue}
                onChange={handleSearchChange}
                className="form-control mt-5"
              />
            </Col>
            <Col xl={2} xs={12} md={3}>
              <div className={"d-flex"}>
                <div>
                  <Tooltip title={"Filter"}>
                    <button
                      type="button"
                      className="btn btn-light mt-5"
                      onClick={handleClickFilter}
                    >
                      <span className="svg-icon svg-icon-md svg-icon-primary">
                        <SVG
                          title="Filter"
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Text/Filter.svg"
                          )}
                        />
                      </span>
                    </button>
                  </Tooltip>
                  <Popper
                    open={showFilter}
                    anchorEl={anchorEl}
                    placement={"bottom-end"}
                    transition
                    className={"popper-card"}
                  >
                    <ClickAwayListener onClickAway={handleClickAway}>
                      <div className={"mainCard"}>
                        <Grid container className={"popper-width"}>
                          <Grid
                            item
                            xs={12}
                            sm={5}
                            md={5}
                            lg={5}
                            className={"borderStyle flex content"}
                            style={{
                              borderBottomLeftRadius: 5,
                              borderBottomRightRadius: 5
                            }}
                          >
                            <div>
                              <div
                                className={
                                  selectedFilter === "user"
                                    ? "filter-menu-onclick"
                                    : "filter-menu"
                                }
                                onClick={() => handleClickFilterSubmenu("user")}
                              >
                                <span>Company User</span>
                                <span
                                  className="svg-icon svg-icon-md "
                                  style={{ float: "right" }}
                                >
                                  <SVG
                                    title="Filter"
                                    src={toAbsoluteUrl(
                                      "/media/svg/icons/Navigation/Angle-right.svg"
                                    )}
                                  />
                                </span>
                              </div>
                              <div
                                className={
                                  selectedFilter === "roles"
                                    ? "filter-menu-onclick"
                                    : "filter-menu"
                                }
                                onClick={() =>
                                  handleClickFilterSubmenu("roles")
                                }
                              >
                                <span>Roles</span>
                                <span
                                  className="svg-icon svg-icon-md"
                                  style={{ float: "right" }}
                                >
                                  <SVG
                                    title="Filter"
                                    src={toAbsoluteUrl(
                                      "/media/svg/icons/Navigation/Angle-right.svg"
                                    )}
                                  />
                                </span>
                              </div>
                              <div
                                className={
                                  selectedFilter === "status"
                                    ? "filter-menu-onclick"
                                    : "filter-menu"
                                }
                                onClick={() =>
                                  handleClickFilterSubmenu("status")
                                }
                              >
                                <span>Status</span>
                                <span
                                  className="svg-icon svg-icon-md"
                                  style={{ float: "right" }}
                                >
                                  <SVG
                                    title="Filter"
                                    src={toAbsoluteUrl(
                                      "/media/svg/icons/Navigation/Angle-right.svg"
                                    )}
                                  />
                                </span>
                              </div>
                            </div>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            md={7}
                            sm={7}
                            lg={7}
                            className={"borderStyle flex content"}
                            style={{
                              borderBottomLeftRadius: 5,
                              borderBottomRightRadius: 5
                            }}
                          >
                            <BlockUi
                              tag="div"
                              blocking={companyListLoader}
                              color="#147b82"
                            >
                              {selectedFilter === "user" ? (
                                <>
                                  {companyListOptions &&
                                  companyListOptions.length > 0 ? (
                                    <div
                                      className={
                                        companyListOptions &&
                                        companyListOptions.length > 3
                                          ? " filter-search-scroll"
                                          : ""
                                      }
                                    >
                                      <>
                                        {companyListOptions &&
                                          companyListOptions.map(
                                            (key, value) => (
                                              <div
                                                className={
                                                  userFilter === key.value
                                                    ? "filter-menu-onclick"
                                                    : "filter-menu"
                                                }
                                                onClick={() =>
                                                  compunyUserApplyFilter(key)
                                                }
                                              >
                                                {key.label}
                                              </div>
                                            )
                                          )}
                                      </>
                                    </div>
                                  ) : (
                                    <div className={"text-center"}>
                                      {selectedFilter === "user" ? (
                                        <span>No Data Available</span>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  )}
                                </>
                              ) : selectedFilter === "roles" ? (
                                <>
                                  <div
                                    className={
                                      allRoles && allRoles.length > 3
                                        ? " filter-search-scroll"
                                        : ""
                                    }
                                  >
                                    {allRoles &&
                                      allRoles.map(data => (
                                        <Col
                                          xl={12}
                                          md={12}
                                          lg={12}
                                          sm={12}
                                          xs={12}
                                        >
                                          <Form.Group
                                            controlId="status"
                                            className={"m-0"}
                                          >
                                            <Col sm={12}>
                                              <RadioGroup
                                                aria-labelledby="demo-error-radios"
                                                name="roles"
                                                className={"filter-radio"}
                                                style={{
                                                  fontSize: "14px",
                                                  fontWeight: 500
                                                }}
                                                value={roleValue}
                                                onChange={() =>
                                                  handleRoleChange(data)
                                                }
                                              >
                                                <FormControlLabel
                                                  value={data?.role}
                                                  control={<Radio />}
                                                  label={data?.role}
                                                  color="#147b82"
                                                />
                                              </RadioGroup>
                                            </Col>
                                          </Form.Group>
                                        </Col>
                                      ))}
                                  </div>
                                </>
                              ) : selectedFilter === "status" ? (
                                <div style={{ height: "150px" }}>
                                  <Col xl={12} md={12} lg={12} sm={12} xs={12}>
                                    <Form.Group controlId="status">
                                      <Col sm={12}>
                                        <RadioGroup
                                          aria-labelledby="demo-error-radios"
                                          name="status"
                                          className={"filter-radio"}
                                          style={{
                                            fontSize: "14px",
                                            fontWeight: 500
                                          }}
                                          value={statusValue}
                                          onChange={handleStatusChange}
                                        >
                                          <FormControlLabel
                                            value="true"
                                            control={<Radio />}
                                            label="Active"
                                            color="#147b82"
                                          />
                                          <FormControlLabel
                                            value="false"
                                            control={<Radio />}
                                            label="Deactive"
                                          />
                                        </RadioGroup>
                                      </Col>
                                    </Form.Group>
                                  </Col>
                                </div>
                              ) : (
                                <div style={{ height: "150px" }}></div>
                              )}
                            </BlockUi>
                          </Grid>
                        </Grid>

                        <Grid container className={"popper-width"}>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            className={"borderStyle flex content"}
                            style={{
                              borderBottomLeftRadius: 5,
                              borderBottomRightRadius: 5,
                              padding: "10px"
                            }}
                          >
                            <div className={"d-flex justify-content-end"}>
                              <Button
                                size="small"
                                onClick={clearFilter}
                                className={"reset-filter mr-2"}
                              >
                                Clear Filters
                              </Button>
                              <Button
                                size="small"
                                onClick={applyFilter}
                                className={"reset-filter mr-2"}
                              >
                                Apply
                              </Button>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </ClickAwayListener>
                  </Popper>
                </div>
                &nbsp; &nbsp;
                <button
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={addUserModal}
                >
                  Add User
                </button>
              </div>
            </Col>
          </Row>
          <hr />

          <CompanyServiceTable
            companyListByIdLoader={userListLoader}
            userDataByCompany={allUserData}
            getAllUserList={getAllUserList}
            pageSize={pageSize}
            pageNo={pageNo}
            userTotalCount={userTotalCount}
            setPageNo={setPageNo}
            setPageSize={setPageSize}
          />
        </CardBody>
      </Card>

      <AddUserModal
        addUserModalShow={addUserModalShow}
        addUserModalClose={addUserModalClose}
        saveUser={saveUserApply}
      />
    </>
  );
}
