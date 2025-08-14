import React, { useEffect, useState } from "react";
import {
  getEventForstEventManager,
  getEventMetadataForEventManager
} from "../../../../_redux/MyEventViewApi";
import { warningToast } from "../../../../../../../../utils/ToastMessage";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../_redux/MyEventViewAction";
import { Col, Row } from "reactstrap";
import { MyEventViewCardsUI } from "./MyEventViewCardsUI";
import { makeStyles } from "@material-ui/core/styles";
import InfiniteScroll from "react-infinite-scroll-component";
// eslint-disable-next-line
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
    height: 450,
    marginTop: 54,
    marginBottom: 64
  }
});

export function MyEventViewTable({
  userId,
  cameraId,
  selectedType,
  startDate,
  endDate,
  isHide,
  isViewAll,
  cameraOptions,
  isLocationSelected,
  setApplyFlag,
   applyFlag,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [listLoading, setListLoading] = useState(false);
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const { currentState } = useSelector(
    state => ({ currentState: state.myResultSliceResultManager }),
    shallowEqual
  );

  function getEventViewMetadata(
    userId,
    startDate,
    endDate,
    isHide,
    isViewAll,
    cameraId,
    selectedType,
    isLocationSelected
  ) {
    setListLoading(true);
    if (startDate && endDate && cameraId.length > 0) {
      getEventMetadataForEventManager(
        userId,
        startDate,
        endDate,
        isHide,
        isViewAll,
        cameraId,
        selectedType,
        isLocationSelected
      )
        .then(response => {
          if (response && response.isSuccess) {
            setListLoading(false);
            setListLoading(false);
            store_data = [];
            setData(store_data);
            getEvents(1);
          } else throw new Error();
        })
        .catch(error => {
          setListLoading(false);
          warningToast("Something went wrong !");
        });
    }
  }

  function getEvents(pageNo) {
    setListLoading(true);
    temp = false;
    setHasMore(true);
    if (cameraId.length > 0) {
      getEventForstEventManager(
        userId,
        pageNo,
        cameraId,
        selectedType,
        startDate,
        endDate,
        isViewAll,
        isHide,
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
    getEvents(currentPage + 1);
  };

  useEffect(() => {
    setData([]);
    if(applyFlag){
      setApplyFlag(false)
      getEventViewMetadata(
        userId,
        startDate,
        endDate,
        isHide,
        isViewAll,
        cameraId,
        selectedType,
        isLocationSelected
      );
    }
    //eslint-disable-next-line
  }, [
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
              <Col xl={6} md={6} sm={12} lg={6} className={classes.card}>
                <MyEventViewCardsUI data={x} dataIndex={index} cameraOptions={cameraOptions} />
              </Col>
            ))}
          </Row>
        </InfiniteScroll>
      ) : (
        <h3 align="center">No Data Found</h3>
      )}
    </>
  );
}
