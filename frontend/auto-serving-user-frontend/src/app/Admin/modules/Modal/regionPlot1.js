import React, { Component, Fragment } from "react";
import { Button } from "reactstrap";
import { addCameraRoi, getCameraRoiById, updateCameraRoi } from "./_redux";
import { successToast, warningToast } from "../../../../utils/ToastMessage";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import Switch from "@material-ui/core/Switch";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
class RegionPlot1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewRegionPlotModal: props.viewRegionPlotModal,
      isDown: false,
      previousPointX: "",
      previousPointY: "",
      coordinates: [],
      roi_coordinates: [],
      updatedCoordinates: [],
      imagePath: props.imagePath,
      roi_type: props.cameraParam.roi_type,
      regionContainsPlot: false,
      blockUI: false,
      disableSaveBtn: true,
      disableUpdateBtn: true,
      showAllploted: false,
      checkboxShowAllROI: false,
      crop: { unit: "px" }
    };
  }

  componentDidMount() {
    const canvas = document.createElement("canvas");
    this.setState({
      canvas: canvas
    });
    const context = canvas.getContext("2d");
    const image = new Image();

    image.onload = () => {
      context.drawImage(image, 0, 0, 640, 640);
    };
    image.src = this.state.imagePath;
    this.getCameraROIById(this.props.cameraParam.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      viewRegionPlotModal: nextProps.viewRegionPlotModal
    });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}

  getCameraROIById = cameraId => {
    this.setState({
      blockUI: true
    });
    setTimeout(() => {
      try {
        getCameraRoiById(cameraId).then(response => {
          let responseObj = response.data;

          if (responseObj.length > 0) {
            this.setState(
              {
                regionContainsPlot: true,
                imageHasPlotPoint: true,
                roiCoordinatesObjFromAPI: responseObj
              },
              () => {
                // setTimeout(()=> {
                let btn = document.getElementById("0button");
                if (btn) {
                  btn.click();
                }

                // },500)
              }
            );

            let obj = responseObj[responseObj.length - 1];
            if (obj.coordinates) {
              let cor = JSON.parse(obj.coordinates);
              let initalPoint = cor[0];
              let secondPoint = cor[1];
              let thirdPoint = cor[2];
              let fourthPoint = cor[3];

              let x = initalPoint[0];
              let y = initalPoint[1];
              let w = Math.abs(secondPoint[0] - initalPoint[0]);
              let h = Math.abs(thirdPoint[1] - secondPoint[1]);
              let crop = this.state.crop;
              crop.x = x;
              crop.y = y;
              crop.width = w;
              crop.height = h;
              this.setState({
                crop: crop,
                blockUI: false,
                coordinateId: obj.id
              });
              const canvas = this.state.canvas;
              let ctx = canvas.getContext("2d");
              ctx.beginPath();
            } else {
              this.setState({
                crop: [],
                regionContainsPlot: false,
                imageHasPlotPoint: false,
                blockUI: false
              });
            }
          } else {
            this.setState({
              regionContainsPlot: false,
              imageHasPlotPoint: false,
              blockUI: false
            });
          }
        });
      } catch (e) {
        this.setState({
          blockUI: false
        });
        warningToast("Something went wrong");
      }
    }, 5000);
  };

  cropUpdateImage = () => {
    let coordinate = this.state.coordinates;
    if (coordinate.length > 0) {
      this.setState({
        blockUI: true
      });
      setTimeout(() => {
        let cameraCor = coordinate;
        let cameraParam = this.props.cameraParam;
        let param = {
          coordinates: JSON.stringify(cameraCor),
          camera_id: cameraParam.id,
          status: false,
          id: this.state.coordinateId
        };
        updateCameraRoi(param).then(response => {
          if (response && response.isSuccess) {
            this.setState(
              {
                imageHasPlotPoint: true,
                blockUI: false,
                disableSaveBtn: true,
                disableUpdateBtn: true
              },
              () => {
                successToast("Co-ordinates saved ");
              }
            );
          }
        });
      }, 500);
    } else {
      warningToast("Please select region");
    }
  };
  handleCrop = crop => {
    this.setState({
      crop: crop
    });
  };
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    let coordinate = [];
    let x1 = crop.x;
    let y1 = crop.y;
    let w = crop.width;
    let h = crop.height;

    let z1 = [x1, y1];
    let z2 = [x1 + w, y1];
    let z3 = [x1 + w, y1 + h];
    let z4 = [x1, y1 + h];
    coordinate = [z1, z2, z3, z4];

    this.setState({
      coordinates: coordinate,
      disableUpdateBtn: false,
      disableSaveBtn: false
    });

    this.makeClientCrop(crop);
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = this.state.canvas;
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            //reject(new Error('Canvas is empty'));
            return;
          }
          blob.name = fileName;
          window.URL.revokeObjectURL(this.fileUrl);
          this.fileUrl = window.URL.createObjectURL(blob);
          resolve(this.fileUrl);
        },
        "image/jpeg",
        1
      );
    });
  }

  plotSpecificCoordinate = (e, key) => {
    this.setState({
      coordinateId: key.id,
      specificCoordinates: key.coordinates,
      regionContainsPlot: true
    });
    const canvas = this.state.canvas;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    const image = new Image();
    image.onload = () => {
      context.beginPath();
      context.drawImage(image, 0, 0, 640, 640);
    };
    image.src = this.state.imagePath;
    // setTimeout(() => {
    this.setState(
      {
        coordinates: [],
        finalCoordinates: [],
        roi_coordinates: []
      },
      () => {
        if (key.coordinates) {
          const canvas = this.state.canvas;
          let ctx = canvas.getContext("2d");
          ctx.beginPath();
        }
      }
    );
    // },1000)
  };
  onShowAllPlotPoints = showAllploted => {
    this.setState({
      showAllploted: showAllploted.target.checked
    });
    if (showAllploted.target.checked) {
      this.setState({
        checkboxShowAllROI: showAllploted.target.checked
      });
      let allPlots = this.state.roiCoordinatesObjFromAPI;
      for (let i = 0; i < allPlots.length; i++) {
        let coordinates = allPlots[i].coordinates;

        if (coordinates) {
          const canvas = this.state.canvas;
          let ctx = canvas.getContext("2d");
          // ctx.fillStyle = '#f00';
          ctx.beginPath();
        }
      }
    } else {
      this.getCameraROIById(this.props.cameraParam.id);
      this.setState({
        checkboxShowAllROI: false
      });
    }
  };
  deleteUpdateCoordinate2 = () => {
    this.setState({
      disableSaveBtn: true,
      disableUpdateBtn: true
    });
    this.getCameraROIById(this.props.cameraParam.id);
  };
  onSave = () => {
    let coordinate = this.state.coordinates;
    if (coordinate.length > 0) {
      this.setState({
        blockUI: true
      });
      setTimeout(() => {
        let cameraCor = coordinate;
        let cameraParam = this.props.cameraParam;
        let param = {
          coordinates: JSON.stringify(cameraCor),
          camera_id: cameraParam.id,
          status: false
        };

        addCameraRoi(param).then(response => {
          if (response && response.isSuccess) {
            this.setState(
              {
                imageHasPlotPoint: true,
                blockUI: false,
                disableSaveBtn: true,
                disableUpdateBtn: true
              },
              () => {
                successToast("Co-ordinates saved ");
              }
            );
          }
        });
      }, 500);
    } else {
      warningToast("Please select region");
    }
  };

  //
  render() {
    return (
      <Fragment>
        <BlockUi tag="div" blocking={this.state.blockUI} color="#147b82">
          {this.state.imageHasPlotPoint && (
            <div>
              {!this.state.checkboxShowAllROI && (
                <>
                  <div className="align-left">
                    {this.state.roiCoordinatesObjFromAPI &&
                      this.state.roiCoordinatesObjFromAPI.map((key, value) => (
                        <Button
                          className={"mr-1 ml-1 "}
                          id={value + "button"}
                          onClick={e => {
                            this.plotSpecificCoordinate(e, key);
                          }}
                        >
                          Co-ordinates {value}
                        </Button>
                      ))}
                  </div>
                </>
              )}

              <p className="align-left">
                Show all plotted points{" "}
                <Switch
                  checked={this.state.showAllploted}
                  onChange={this.onShowAllPlotPoints}
                  color="primary"
                  name="showAllploted"
                />
              </p>
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <h2>Image Crop</h2>
            <div style={{ marginTop: "20px" }}>
              <ReactCrop
                width={640}
                height={640}
                src={this.state.imagePath}
                crop={this.state.crop}
                onChange={crop => {
                  this.handleCrop(crop);
                }}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
              />
            </div>

            <div
              id={"imageId"}
              style={{ marginTop: "20px", textAlign: "center" }}
            >
              {!this.state.imageHasPlotPoint && (
                <>
                  <Button
                    style={{ marginRight: "5px" }}
                    disabled={this.state.disableSaveBtn}
                    onClick={this.onSave}
                  >
                    {" "}
                    Save
                  </Button>
                  <Button
                    style={{ marginRight: "5px" }}
                    onClick={this.deleteUpdateCoordinate2}
                  >
                    reset canvas
                  </Button>
                </>
              )}
              {this.state.imageHasPlotPoint && (
                <>
                  <Button
                    style={{ marginRight: "5px" }}
                    disabled={this.state.disableUpdateBtn}
                    onClick={this.cropUpdateImage}
                  >
                    Update
                  </Button>
                  <Button
                    style={{ marginRight: "5px" }}
                    onClick={this.deleteUpdateCoordinate2}
                  >
                    reset canvas
                  </Button>
                </>
              )}
            </div>
          </div>
        </BlockUi>
      </Fragment>
    );
  }
}

export default RegionPlot1;
