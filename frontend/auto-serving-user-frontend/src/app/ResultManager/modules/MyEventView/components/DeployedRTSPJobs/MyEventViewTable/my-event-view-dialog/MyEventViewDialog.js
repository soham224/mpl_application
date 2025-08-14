import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { shallowEqual, useSelector } from "react-redux";
import { warningToast } from "../../../../../../../../utils/ToastMessage";
import Boundingbox from "image-bounding-box-custom";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { boundBoxOptions } from "../../../../../../../../utils/BoundingBoxConfig";

export function MyEventViewDialog({ id, show, onHide }) {
  const { entities } = useSelector(
    (state) => ({
      entities: state.myResultSliceResultManager.entities,
    }),
    shallowEqual
  );

  const [myResultFetchedById, setMyResultFetchedById] = useState({});
  useEffect(() => {
    if (id && entities) {
      const deployedRTSPJob = entities.filter((d) => d._id.$oid === id);
      if (deployedRTSPJob.length) {
        setMyResultFetchedById(deployedRTSPJob[0]);
      } else warningToast("No deployedRTSP job found with that id");
    }

    return () => setMyResultFetchedById({});
  }, [id, entities]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="result-modal"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          My Result Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/*<div className="row m-auto col-12 text-center" style={{background: "linear-gradient(to right, #0054d0, #019f8c)", color: 'white'}}>*/}
        <TransformWrapper
          defaultScale={1}
          defaultPositionX={200}
          defaultPositionY={100}
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
                  <Boundingbox
                    className="row m-auto col-12 p-0 text-center"
                    image={myResultFetchedById?.image_url}
                    boxes={myResultFetchedById?.result?.detection.map((d) => ({
                      coord: [
                        d.location[0],
                        d.location[1],
                        d.location[2] - d.location[0],
                        d.location[3] - d.location[1],
                      ],
                      label: d.label,
                    }))}
                    options={boundBoxOptions}
                  />
                </TransformComponent>
              </div>
            </React.Fragment>
          )}
        </TransformWrapper>
        {/*</div>*/}
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
