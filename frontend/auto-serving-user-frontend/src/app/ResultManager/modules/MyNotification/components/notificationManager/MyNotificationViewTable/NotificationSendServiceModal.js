import React, {useEffect, useState} from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import {makeStyles} from "@material-ui/core/styles";
import {NotificationSendCardUI} from "./NotificationSendCardUI";
import {sendWhatsappMessaage} from "../../_redux";
import {successToast, warningToast} from "../../../../../../utils/ToastMessage";


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
function NotificationSendServiceModal({
  serviceModalShow,
  handleServiceClose,
  imageData,
  fetchData
}) {
  const [selectedCamera, setSelectedCamera] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [data, setData] = useState([]);
  const [labelName, setLabelName] = useState([]);

  const classes = useStyles();
  const selecteCheckbox = (event, data) => {
    let selected = { ...selectedImages };
    if (Object.keys(selected).includes(data._id.$oid)) {
      delete selected[data._id.$oid];
    } else {
      selected[data._id.$oid] = data;
    }
    setSelectedImages({ ...selected });
  };

  const handleServiceSubmit = selectedImages => {
    const selectedImagesWhatsapp = [];
    Object.keys(selectedImages).forEach(key => {
      selectedImagesWhatsapp.push(selectedImages[key]);
    });

    if (selectedImagesWhatsapp) {
      sendWhatsappMessaageList(selectedImagesWhatsapp);
    }
  };

  const sendWhatsappMessaageList = selectedImagesWhatsapp => {
    handleServiceClose();
    sendWhatsappMessaage(selectedImagesWhatsapp)
      .then(response => {
        if (response && response.isSuccess) {
          setSelectedImages([]);
          setSelectedCamera({});
          successToast("Whatsapp Send Successfully");
        }
      })
      .catch(error => {
        setSelectedImages([]);
        setSelectedCamera({});
        handleServiceClose();
        if (error.detail) {
          warningToast(error.detail);
        } else {
          warningToast("Something went Wrong");
        }
      });
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

  return (
    <>
      <Modal
        size="xl"
        show={serviceModalShow}
        onHide={handleServiceClose}
        style={{ background: "#00000080" }}
        centered
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton={handleServiceClose}>
          <Modal.Title id="example-modal-sizes-title-lg">
            Select Whatsapp Notification Image
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {imageData.length > 0 ? (
            <div
              className={
                Object.keys(imageData).length > 3 ? "modal-image-scroll" : ""
              }
            >
              <Row className="mb-2 mt-2">
                {imageData?.map((x, index) => (
                  <Col xl={4} md={12} lg={6} sm={12} className={classes.card}>
                    <NotificationSendCardUI
                      selecteCheckbox={selecteCheckbox}
                      selectedImages={selectedImages}
                      selectedCamera={selectedCamera}
                      setSelectedCamera={setSelectedCamera}
                      data={x}
                      dataIndex={index}
                      changeUpdatedData={changeUpdatedData}
                      labelName={labelName[parseInt(x.camera_id)]}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <h3 align="center">No Data Found</h3>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            onClick={handleServiceClose}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </Button>
          <> </>
          <Button
            type="submit"
            onClick={() => handleServiceSubmit(selectedImages)}
            className="btn btn-primary btn-elevate"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NotificationSendServiceModal;
