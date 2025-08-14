import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Boundingbox from "image-bounding-box-custom";
import moment from "moment";

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

export function NotificationSendCardUI({
  data,
  dataIndex,
  labelName,

  selecteCheckbox,
  selectedImages,
  selectedCamera,
  setSelectedCamera
}) {
  const classes = useStyles();
  const [modaldata, setModaldata] = useState([]);
  const [columns, setColumns] = useState([]);

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
    selectedCamera[dataIndex] = false;
    setSelectedCamera({ ...selectedCamera });

    //eslint-disable-next-line
  }, [labelName, data]);

  const getColumnsAndData = () => {
    let modal_data = [];
    let camera_name = labelName;
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

  return (
    <>
      {
        <Card
          className={clsx(classes.card)}
          onClick={e => {
            selecteCheckbox(e, data);
          }}
        >
          <div>
            <input
              type="checkbox"
              id={data.camera_id}
              checked={
                selectedImages &&
                Object.keys(selectedImages).includes(data._id.$oid)
              }
              className="checkbox checkbox-primary checkbox-new"
              style={{
                opacity:
                  selectedImages &&
                  Object.keys(selectedImages).includes(data._id.$oid)
                    ? 1
                    : 0
              }}
            />

            <label>
              <CardMedia
                style={{ cursor: "pointer" }}
                className={classes.media}
                alt={"Image Here"}
              >
                <Boundingbox
                  className="row m-auto col-12 p-0 text-center"
                  image={data?.image_url}
                  boxes={data?.result?.detection?.map(d => {
                    if (d.label)
                      return {
                        coord: [
                          d.location[0],
                          d.location[1],
                          d.location[2] - d.location[0],
                          d.location[3] - d.location[1]
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
                      maxHeight: "100vh",
                      margin: "auto",
                      // width: 520,
                      width: 358,
                      color: "red",
                      height: 354
                    }
                  }}
                />
              </CardMedia>
            </label>
          </div>

          <CardContent style={{ minHeight: "100px" }}>
            <Typography gutterBottom variant="h6" component="h2">
              Time:-{" "}
              {moment(new Date(data.created_date.$date).toISOString()).format(
                "MMMM DD YYYY, h:mm:ss a"
              )}
              <br />
            </Typography>
            <Typography gutterBottom variant="h6" component="h2">
              {Object.keys(data?.counts)[0]} ({Object.values(data?.counts)[0]})
              {/*{moment(new Date(data.created_date.$date).toISOString()).format(*/}
              {/*    "MMMM DD YYYY, h:mm:ss a"*/}
              {/*)}*/}
              <br />
            </Typography>
          </CardContent>
        </Card>
      }
    </>
  );
}
