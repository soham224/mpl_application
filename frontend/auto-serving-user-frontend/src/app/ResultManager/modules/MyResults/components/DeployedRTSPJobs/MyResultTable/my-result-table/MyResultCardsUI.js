import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import Boundingbox from "image-bounding-box-custom";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { successToast } from "../../../../../../../../utils/ToastMessage";
import { Switch } from "@material-ui/core";
import * as actions from "../../../../_redux/MyResultAction";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../../../_metronic/_helpers";
import {
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import moment from "moment";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Col, InputGroup, Row } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import objectAssign from "object-assign";
import { RegionSelect } from "./Region_Lib/RegionSelect";
import BootstrapTable from "react-bootstrap-table-next";

const useStyles = makeStyles({
  card: {
    maxWidth: 416,
    height: "116%",
    margin: "auto"
  },
  media: {
    height: 351
  },
  header: {
    paddingBottom: "0rem"
  },
  learnMore: {
    position: "absolute",
    bottom: 0
  }
});

export function MyResultCardsUI({
  data,
  dataIndex,
  changeUpdatedData,
  labelname,
  allLabels
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [switchToggle, setSwitchToggle] = useState(data?.is_hide);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [curReg, setCurReg] = useState(-1);
  const [regions, setRegions] = useState([]);
  const [currentLabelArray, setCurrentLabelArray] = useState([]);
  const [dropDownLabelArray, setDropDownLabelArray] = useState([]);
  const [modaldata, setModaldata] = useState([]);
  const [columns, setColumns] = useState([]);
  const newLAbels = allLabels.map(x => {
    return x.label;
  });


  useEffect(() => {
    const columns = [
      {
        dataField: "camera_name",
        text: "camera"
      },
      {
        dataField: "count",
        text: "Count"
      },
      {
        dataField: "date",
        text: "Date"
      },
      {
        dataField: "labels",
        text: "labels"
      }
    ];
    setColumns(columns);
    getColumnsAndData();
    //eslint-disable-next-line
  }, [labelname, data]);

  const onChange = reg => {
    let len = reg.length;
    if (!reg[len - 1].isChanging) {
      if (reg[len - 1].width === 0 || reg[len - 1].height === 0) {
        reg = reg.slice(0, reg.length - 1);
      }
    }
    setRegions(reg);
  };
  const changeRegionData = (index, value) => {
    setCurReg(index);
    currentLabelArray[index] = value;
    setCurrentLabelArray([...currentLabelArray]);

    const region = regions[index];
    let regionStyle = {
      borderWidth: "1px",
      borderStyle: "solid"
    };
    onChange([
      ...regions.slice(0, index),
      objectAssign({}, region, {
        data: objectAssign({}, region.data, {
          label: value,
          regionStyle: regionStyle
        })
      }),
      ...regions.slice(index + 1)
    ]);
    setCurReg(-1);
  };

  const handleChange = e => {
    dispatch(actions.changeResultStatus(data._id.$oid, !data.is_hide)).then(
      () => {
        setSwitchToggle(!switchToggle);
        successToast("Vioaltion status change successfully");
      }
    );
  };
  const getColumnsAndData = () => {
    let modal_data = [];
    let camera_name = labelname;
    let count = data?.result?.detection?.length;
    let Date = moment
      .utc(data.created_date.$date)
      .local()
      .format("MMMM DD YYYY, h:mm:ss a");
    let labels = Object.keys(data.counts).toString();
    modal_data.push({
      camera_name: camera_name,
      count: count,
      date: Date,
      labels: labels
    });
    setModaldata(modal_data);
  };
  const handleClick = e => {
    setIsModalOpen(true);
    setCurrentLabelArray([]);
    let regions = data?.result?.detection?.map((item, index) => {
      let obj = {
        x: item.location[0] / 6.4,
        y: item.location[1] / 6.4,
        width: item.location[2] / 6.4 - item.location[0] / 6.4,
        height: item.location[3] / 6.4 - item.location[1] / 6.4,
        new: false,
        isChanging: false,
        data: {
          index: index,
          label: item.label
        }
      };
      currentLabelArray[index] = item.label;
      setCurrentLabelArray([...currentLabelArray]);
      if (!dropDownLabelArray.includes(item.label)) {
        dropDownLabelArray.push(item.label);
        setDropDownLabelArray([...dropDownLabelArray]);
      }
      return obj;
    });
    setRegions(regions);
  };
  const onSave = () => {
    let detection_data = regions
      .filter(f => f.data.label)
      .map(x => {
        return {
          label: x.data.label,
          location: [
            x.x * 6.4,
            x.y * 6.4,
            x.width * 6.4 + x.x * 6.4,
            x.height * 6.4 + x.y * 6.4
          ]
        };
      });
    let setresult = {
      detection: detection_data,
      inference_time: data?.result?.inference_time
    };

    let labelCount = {};
    currentLabelArray
      .filter(f => f)
      .map(x => {
        if (Object.keys(labelCount).includes(x)) {
          labelCount[x] = labelCount[x] + 1;
        } else {
          labelCount[x] = 1;
        }
        return null;
      });

    const arr = { result_data: setresult, count_data: labelCount };
    dispatch(actions.saveResults(arr, data._id.$oid)).then(res => {
      setIsModalOpen(false);
      changeUpdatedData(dataIndex, setresult, labelCount);
      successToast("Vioaltion updated successfully");
    });
  };

  const onHide = () => {
    setIsModalOpen(false);
  };
  const handleZoom = event => {
    setScale(event.scale);
  };
  const handleRegionClick = (event, index) => {
    setCurReg(index);
  };
  const handleOnChange = e => {
    regions[e.target.id]["data"] = {
      index: e.target.id,
      label: e.target.value
    };
    currentLabelArray[e.target.id] = e.target.value;
    setCurrentLabelArray([...currentLabelArray]);
  };
  const onClose = () => {
    const reg = regions;
    reg.splice(curReg, 1);
    currentLabelArray.splice(curReg, 1);

    setRegions([...reg]);
    setCurrentLabelArray([...currentLabelArray]);
    setCurReg(-1);
  };



  const regionRenderer = regionProps => {
    if (!regionProps.isChanging) {
      return (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: "-1.5em",
            display: regionProps.index !== curReg ? "none" : "",
            height: 10 / scale.toString() + "px",
            left: 100 - regions[regionProps.index].x < 20 ? null : 0
          }}
        >
          <InputGroup
            style={{ minWidth: "100px", height: 10 / scale.toString() + "px" }}
          >
            <div style={{ height: 10 / scale.toString() + "px" }}>
              <div style={{}} className={"d-flex"}>
                <div
                  style={{
                    width: 20 / scale.toString() + "px",
                    height: 20 / scale.toString() + "px"
                  }}
                >
                  <div
                    className={`d-flex ${
                      regions[regionProps.index].x > 60
                        ? "flex-row-reverse dropdown-custom"
                        : ""
                    } 
                    ${
                      regions[regionProps.index].y > 70
                        ? "dropdown-y-custom"
                        : ""
                    }`}
                  >
                    <Dropdown>
                      <Dropdown.Toggle
                        style={{ backgroundColor: "white", textColor: "black" }}
                      >
                        {regions &&
                          regions.map((item, index) => {
                            if (curReg === index) {
                              return (
                                <input
                                  type="text"
                                  name="label"
                                  autocomplete="off"
                                  id={curReg}
                                  style={{ maxWidth: "95px", border: "none" }}
                                  value={currentLabelArray[index]}
                                  onChange={e => handleOnChange(e)}
                                />
                              );
                            }
                            return null;
                          })}
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        style={{
                          maxHeight: "150px",
                          overflowX: "hidden",
                          overflowY: "auto"
                        }}
                      >
                        {newLAbels.length > 0 ? (
                          newLAbels.map(e => {
                            return (
                              <Dropdown.Item
                                value={e}
                                onClick={() =>
                                  changeRegionData(regionProps.index, e)
                                }
                              >
                                {e}
                              </Dropdown.Item>
                            );
                          })
                        ) : (
                          <Dropdown.Item>No Options</Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>
                        <button
                          type="button"
                          className="close"
                          aria-label="Close"
                          onClick={onClose}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </InputGroupText>
                    </InputGroupAddon>
                  </div>
                </div>
              </div>
            </div>
          </InputGroup>
        </div>
      );
    } else {
      setCurReg(regionProps.index);
    }
  };
  return (
    <>
      {
        <Card className={clsx(classes.card)}>
          <CardMedia
            className={classes.media}
            title={"Vioaltion"}
            alt={"Image Here"}
          >

            {/*<RegionSelect*/}
            {/*    regions={regions}*/}
            {/*    constraint*/}
            {/*    // onChange={onChange}*/}
            {/*    // regionRenderer={regionRenderer}*/}
            {/*    // onClick={handleRegionClick}*/}
            {/*    scale={scale}*/}
            {/*>*/}
            {/*  <img*/}
            {/*      style={{*/}
            {/*        maxWidth: "100%",*/}
            {/*        maxHeight: "90vh",*/}
            {/*        margin: "auto",*/}
            {/*        width: 752,*/}
            {/*        color: "red",*/}
            {/*        height: 470*/}
            {/*      }}*/}
            {/*      src={data?.image_url}*/}
            {/*      width="100%"*/}
            {/*      height="100%"*/}
            {/*      alt={""}*/}
            {/*  />*/}
            {/*</RegionSelect>*/}

            <Boundingbox
              className="row m-auto col-12 p-0 text-center"
              image={data?.image_url}
              boxes={data?.result?.detection?.map(d => {
                if (d.label)
                  return {
                    coord: [
                      d.location[0],
                      d.location[1],
                      d.location[2],
                      d.location[3]
                    ],
                    label: d.label
                  };
                return null;
              })}
              options={{
                colors: {
                  normal: "red",
                  selected: "red",
                  unselected: "red"
                },
                style: {
                  maxWidth: "100%",
                  maxHeight: "100%",
                  margin: "auto",
                  width: 520,
                  color: "red",
                  height: 354
                }
              }}
            />
          </CardMedia>
          <CardContent style={{ minHeight: "100px" }}>
            <Typography gutterBottom variant="h6" component="h2">
              Time:-{" "}
              {moment(new Date(data.created_date.$date).toISOString()).format(
                "MMMM DD YYYY, h:mm:ss a"
              )}
              <br />
              <span
                className="svg-icon svg-icon-md svg-icon-primary mt-2"
                style={{ float: "right" }}
                onClick={e => {
                  handleClick(e);
                }}
              >
                <SVG
                  title="Edit Vioaltion"
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Write.svg"
                  )}
                />
              </span>
              Hide?
              <Switch
                color="primary"
                checked={switchToggle}
                onChange={e => {
                  handleChange(e);
                }}
                name="isHideStatus"
              />
            </Typography>
          </CardContent>
        </Card>
      }
      {isModalOpen && (
        <Modal
          size="lg"
          aria-labelledby="example-modal-sizes-title-lg"
          isOpen={isModalOpen}
          toggle={onHide}
          style={{ maxHeight: "-webkit-fill-available" }}
        >
          <ModalHeader closeButton>
            <h3 id="example-modal-sizes-title-lg">Vioaltion Details</h3>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col xl={12} xs={12} md={12} lg={12} sm={12} className="mt-2">
                {data && modaldata && (
                  <BootstrapTable
                    classes="table table-head-custom table-vertical-center overflow-hidden mt-3"
                    bootstrap4
                    wrapperClasses="table-responsive"
                    keyField="label"
                    bordered={false}
                    data={modaldata}
                    columns={columns}
                  />
                )}
              </Col>
              <Col xl={12} xs={12} md={12} lg={12} sm={12}>
                <TransformWrapper
                  defaultScale={1}
                  defaultPositionX={200}
                  defaultPositionY={100}
                  initialScale={1}
                  onZoomChange={handleZoom}
                  pan={{ disabled: true }}
                  wheel={{ limitsOnWheel: true }}
                  options={{
                    centerContent: true,
                    limitToBounds: true,
                    maxScale: 2
                  }}
                >
                  {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <React.Fragment>
                      <div
                        className="tools text-right"
                        style={{ width: "100%", marginBottom: "4px" }}
                      >
                        <ButtonGroup
                          size="small"
                          aria-label="Small outlined button group"
                        >
                          <Button onClick={zoomIn}>+</Button>
                          <Button onClick={zoomOut}>-</Button>
                          <Button onClick={resetTransform}>reset</Button>
                        </ButtonGroup>
                      </div>
                      <div
                        className="boundimage-full w-100"
                        style={{ margin: "0 auto" }}
                      >
                        <TransformComponent>
                          <RegionSelect
                            regions={regions}
                            constraint
                            onChange={onChange}
                            regionRenderer={regionRenderer}
                            onClick={handleRegionClick}
                            scale={scale}
                          >
                            <img
                              style={{
                                maxWidth: "100%",
                                maxHeight: "90vh",
                                margin: "auto",
                                width: 752,
                                color: "red",
                                height: 470
                              }}
                              src={data?.image_url}
                              width="100%"
                              height="100%"
                              alt={""}
                            />
                          </RegionSelect>
                        </TransformComponent>
                      </div>
                    </React.Fragment>
                  )}
                </TransformWrapper>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              onClick={() => onHide(false)}
              className="btn btn-light btn-elevate"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => onSave()}
              className="btn btn-primary btn-elevate ml-2"
            >
              save
            </Button>
          </ModalFooter>

        </Modal>
      )}
    </>
  );
}
