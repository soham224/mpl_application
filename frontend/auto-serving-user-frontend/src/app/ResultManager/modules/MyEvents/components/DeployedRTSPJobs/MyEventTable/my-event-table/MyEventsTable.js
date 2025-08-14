import React, { useEffect, useState } from "react";
import {
  getEventMetadataForResultManager,
  getEventsForResultManager,
  SaveCreatedEvent
} from "../../../../_redux/MyEventApi";
import {
  successToast,
  warningToast
} from "../../../../../../../../utils/ToastMessage";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../_redux/MyEventAction";
import { Col, Row } from "reactstrap";
import { MyEventCardsUI } from "./MyEventCardUI";
import { makeStyles } from "@material-ui/core/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import Button from "@material-ui/core/Button";
import ModalCreateEvent from "./ModalCreateEvent";
import { getCurrentDateAndTimeInUtc } from "../../../../../../../../utils/TimeZone";
import moment from "moment";

let currentPage = 0;
let temp = false;
let store_data = [];
const useStyles = makeStyles({
  header: {
    paddingBottom: "0rem"
  },
  title: {
    display: "inline-flex",
    margin: "1rem 0"
  },
  search: {
    marginBottom: "10px"
  },
  card: {
    height: 370,
    marginTop: 54,
    marginBottom: 64
  }
});

export function MyEventTable({
  companyId,
  originalCompanyId,
  userId,
  cameraId,
  selectedLabel,
  startDate,
  endDate,
  isHide,
  labelname,
  isDetection,
  isViewAll,
  isLocationSelected,
  setApplyFlag,
                               applyFlag,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [listLoading, setListLoading] = useState(false);
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState({});
  const [selectedImages, setSelectedImages] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isErrors, setIsErrors] = useState({});
  const [hasMore, setHasMore] = useState(false);

  const { currentState } = useSelector(
    state => ({ currentState: state.MyEventSliceResultManager }),
    shallowEqual
  );

  function getResultMetadata(
    companyId,
    startDate,
    endDate,
    isHide,
    isDetection,
    isViewAll,
    cameraId,
    selectedLabel,
    isLocationSelected
  ) {
    setListLoading(true);
    if (startDate && endDate && cameraId.length > 0) {
      getEventMetadataForResultManager(
        companyId,
        startDate,
        endDate,
        isHide,
        isDetection,
        isViewAll,
        cameraId,
        selectedLabel,
        isLocationSelected
      )
        .then(response => {
          if (response && response.isSuccess) {
            setListLoading(false);
            store_data = [];
            setData(store_data);
            getResults(1);
          } else throw new Error();
        })
        .catch(error => {
          setListLoading(false);
          warningToast("Something went wrong !");
        });
    }
  }

  function getResults(pageNo) {
    setListLoading(true);
    temp = false;
    setHasMore(true);
    if (cameraId.length > 0) {
      getEventsForResultManager(
        pageNo,
        companyId,
        startDate,
        endDate,
        isHide,
        isDetection,
        isViewAll,
        cameraId,
        selectedLabel,
        isLocationSelected
      )
        .then(response => {
          if (response && response.isSuccess) {
            dispatch(actions.setMyResults(response.data));
            currentPage = pageNo;
            setListLoading(false);
            if (response.data.length > 0) {
              temp = true;
              store_data.push(...response.data);
              setData(store_data);
              setDisplayData(temp);
              setHasMore(false);
            } else throw new Error();
          }
        })
        .catch(error => {
          setListLoading(false);
        });
    }
  }
  const fetchData = e => {
    setHasMore(true);
    getResults(currentPage + 1);
  };

  const changeUpdatedData = (i, setresult, labelCount) => {
    let newArr = data.map((item, index) => {
      if (index === i) {
        return { ...item, ["result"]: setresult, ["counts"]: labelCount };
      } else {
        return item;
      }
    });
    setData(newArr);
  };
  const selecteCheckbox = (event, data) => {
    let selected = { ...selectedImages };
    if (Object.keys(selected).includes(data._id.$oid)) {
      delete selected[data._id.$oid];
    } else {
      selected[data._id.$oid] = data;
    }
    setSelectedImages({ ...selected });
  };
  const handleClick = selectedImages => {
    setIsModalOpen(true);
  };

  const lastSelectedCheckbox = () => {
    setSelectedImages({});
  };

  const onHide = (close = false, selectedImagesUpdate) => {
    setIsModalOpen(close);
    setIsErrors(true);
    {
      selectedImagesUpdate &&
        Object.keys(selectedImagesUpdate).length > 0 &&
        setSelectedImages(selectedImagesUpdate);
    }
  };
  const onSave = (
    selectedImagesUpdate,
    eventType,
    addEmployee,
    sortValue,
    sortCameraDate,
    typeValue
  ) => {
    if (validate(addEmployee, typeValue)) {
      let event_date = sortCameraDate;
      let imageList = [];
      Object.values(selectedImagesUpdate).map(imageUrl =>
        imageList.push({
          imageUrl: imageUrl.image_url,
          imageDate: imageUrl.updated_date.$date
        })
      );

      let cameraIds;
      Object.values(selectedImagesUpdate).map(cameraId => {
        cameraIds = cameraId.camera_id;
      });

      let data = {
        company_id: originalCompanyId.toString(),
        user_id: companyId.toString(),
        camera_id: cameraIds.toString(),
        event_name: addEmployee.event_name,
        event_desc: addEmployee.event_description,
        event_type: typeValue,
        event_date: moment(new Date(event_date).toISOString()),
        created_date: getCurrentDateAndTimeInUtc(),
        updated_date: getCurrentDateAndTimeInUtc(),
        status: true,
        is_hide: false,
        image_list: imageList
      };

      SaveCreatedEvent(data)
        .then(response => {
          if (response && response.isSuccess) {
            successToast("Event Created Successfully");
            setIsModalOpen(false);
            setSelectedImages({});
          } else throw new Error();
        })
        .catch(error => {
          setIsModalOpen(true);
          // setListLoading(false);
        });
    }
  };

  const validate = (addEmployee, typeValue) => {
    let errors = {};
    let isValid = true;
    if (addEmployee["event_name"] === "") {
      isValid = false;
      errors["event_name"] = "*Please Enter Name";
    }
    if (addEmployee["event_description"] === "") {
      isValid = false;
      errors["event_description"] = "*Please Enter Description";
    }
    if (!typeValue) {
      isValid = false;
      errors["event_type"] = "*Please Enter Type";
    }
    setIsErrors(errors);
    return isValid;
  };

  useEffect(() => {
    setData([]);
    if(applyFlag){
      // if (cameraId && companyId && startDate !== "" && endDate !== "") {
        // setselectedPage(0);
        setApplyFlag(false)
        getResultMetadata(
            companyId,
            startDate,
            endDate,
            isHide,
            isDetection,
            isViewAll,
            cameraId,
            selectedLabel,
            isLocationSelected
        );
    }

    //eslint-disable-next-line
  }, [
    // cameraId,
    // companyId,
    // startDate,
    // endDate,
    // isHide,
    // selectedLabel,
    // isDetection,
    // isViewAll,
    // isLocationSelected
    applyFlag
  ]);

  return (
    <>
      {data.length > 0 && displayData ? (
        <InfiniteScroll
          dataLength={data?.length}
          next={fetchData}
          hasMore={true}
          loader={null}
        >
          <Row className="mb-2 mt-2">
            {data?.map((x, index) => (
              <Col xl={3} md={3} sm={12} lg={3} className={classes.card}>
                <MyEventCardsUI
                  selecteCheckbox={selecteCheckbox}
                  selectedImages={selectedImages}
                  selectedCamera={selectedCamera}
                  setSelectedCamera={setSelectedCamera}
                  data={x}
                  dataIndex={index}
                  changeUpdatedData={changeUpdatedData}
                  labelname={labelname[parseInt(x.camera_id)]}
                />
              </Col>
            ))}
          </Row>
        </InfiniteScroll>
      ) : (
        <h3 align="center">No Data Found</h3>
      )}

      {isModalOpen && (
        <>
          <ModalCreateEvent
            isErrors={isErrors}
            isModalOpen={isModalOpen}
            onHide={onHide}
            onSave={onSave}
            selectedImages={selectedImages}
            userId={userId}
            selecteCheckbox={selecteCheckbox}
            lastSelectedCheckbox={lastSelectedCheckbox}
          />
        </>
      )}
      {selectedImages && Object.keys(selectedImages).length > 0 ? (
        <div
          className={"saveImageEvent-button"}
          style={{ margin: "0px auto", textAlign: "center" }}
        >
          <Button
            type="submit"
            className="btn btn-primary btn-elevate"
            onClick={() => handleClick(selectedImages)}
          >
            Create Event
          </Button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
