import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import {
  successToast,
  warningToast
} from "../../../../../../../../utils/ToastMessage";
import {
  addLabelSetting,
  getLabelSettingByJobId,
  updateLabelSetting
} from "../../../../_redux/DeployedRTSPJobs/deployedRTSPJobsSettings.api";
import { shallowEqual, useSelector } from "react-redux";

export function DeployedRTSPJobsLabelSettingsDialog({ id, show, onHide }) {
  const [settings, setSettings] = useState([]);
  const [edit, setEdit] = useState({});
  const { entities } = useSelector(
    state => ({
      entities: state.deployedRTSPJobs.entities
    }),
    shallowEqual
  );

  const getLabelSettings = id => {
    if (id) {
      let deployedRTSPJob = entities?.filter(d => d.id === id * 1);
      if (deployedRTSPJob?.length) deployedRTSPJob = deployedRTSPJob[0];
      else deployedRTSPJob = false;
      let newSets = [];
      if (deployedRTSPJob) {
        let settingsString =
          deployedRTSPJob.deployment_job_rtsp_details.model_details
            .model_training_settings.model_labels_list;
        let defaultLabels = settingsString.split(",");
        newSets = defaultLabels.map((l, idx) => ({
          id: idx,
          default_label: l.trim(),
          new_label: "",
          status: true,
          deployed_rtsp_job_id: id,
          is_default: true
        }));
        setSettings(newSets);
      }
      getLabelSettingByJobId(id)
        .then(response => {
          if (response && response.isSuccess) {
            const sets = newSets.map(set => {
              const oldSet = response.data.filter(
                s => s.default_label === set.default_label
              );
              if (oldSet.length) return oldSet[0];
              else return set;
            });
            setSettings(sets);
          } else {
            throw new Error("Error while getting label settings for this job");
          }
        })
        .catch(error => {
        });
    }
  };

  useEffect(() => {
    getLabelSettings(id);

    return () => {
      setSettings([]);
      setEdit({});
    };
    //eslint-disable-next-line
  }, [id]);

  const updateLabel = () => {
    if (!edit?.new_label) {
      warningToast("Please enter new label name");
      return;
    }

    if (edit.is_default) {
      delete edit["id"];
      addLabelSetting(edit)
        .then(response => {
          if (response && response.isSuccess) {
            successToast("Label settings updated successfully");
            setEdit({});
            getLabelSettings(id);
          } else {
            throw new Error("Error while updating label settings for this job");
          }
        })
        .catch(error => {
          warningToast("Something went wrong");
        });
    } else {
      updateLabelSetting(edit)
        .then(response => {
          if (response && response.isSuccess) {
            successToast("Label settings updated successfully");
            setEdit({});
            getLabelSettings(id);
          } else {
            throw new Error("Error while updating label settings for this job");
          }
        })
        .catch(error => {
          warningToast("Something went wrong");
        });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Job Label Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="text-center">
          {!settings.length ? (
            <div
              className="row m-auto col-12 text-center"
              style={{ color: "#434d7d" }}
            >
              <span className="w-100 font-weight-bold">No Labels Found!</span>
            </div>
          ) : (
            <>
              <Form.Row className="font-weight-bold">
                <Form.Label column sm={2}>
                  #
                </Form.Label>
                <Form.Label column sm={3}>
                  Default Label
                </Form.Label>
                <Form.Label column sm={3}>
                  New Label
                </Form.Label>
                <Form.Label column sm={3}>
                  Action
                </Form.Label>
              </Form.Row>
            </>
          )}
          {settings.map((setting, index) => (
            <Form.Row>
              <Form.Label column sm={2}>
                {index + 1}
              </Form.Label>
              <Form.Label column sm={3}>
                {setting?.default_label}
              </Form.Label>
              <Form.Label column sm={3}>
                {edit?.id === setting.id ? (
                  <Form.Control
                    type="text"
                    name="label"
                    placeholder="New Label"
                    value={edit?.new_label}
                    onChange={e =>
                      setEdit({ ...setting, new_label: e.target.value })
                    }
                  />
                ) : (
                  setting?.new_label
                )}
              </Form.Label>
              <Form.Label column sm={3}>
                {edit?.id === setting.id ? (
                  <>
                    <CheckIcon
                      color={"primary"}
                      onClick={updateLabel}
                      style={{ cursor: "pointer", fontSize: "2rem" }}
                    />
                    <ClearIcon
                      color={"error"}
                      onClick={() => setEdit({})}
                      style={{ cursor: "pointer", fontSize: "2rem" }}
                    />
                  </>
                ) : (
                  <CreateOutlinedIcon
                    style={{ color: "#5195ff", cursor: "pointer" }}
                    onClick={() => setEdit(setting)}
                  />
                )}
              </Form.Label>
            </Form.Row>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
