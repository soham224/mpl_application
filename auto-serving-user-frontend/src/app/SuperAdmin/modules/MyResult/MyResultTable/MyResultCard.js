import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../_metronic/_partials/controls";
import { MyResultTable } from "./my-result-table/MyResultTable";
import Select from "react-select";
import { Col, Form, Row } from "react-bootstrap";
import { getAllUsers } from "../../Users/_redux/users.api";
import { getAllDeployedRTSPJobsDetails } from "../../DeployedDetails/_redux/DeployedRTSPJobs/deployedRTSPJobs.api";

export function MyResultCard() {
  const initCompany = { label: "Select Company", value: 0 };
  const initJob = { label: "Select Model", value: 0 };
  const initCamera = { label: "Select Camera", value: 0 };

  const [company, setCompany] = useState(initCompany);
  const [rtspJobModel, setRTSPJobModel] = useState(initJob);
  const [camera, setCamera] = useState(initCamera);

  const [companyOptions, setCompanyOptions] = useState([]);
  useEffect(() => {
    getAllUsers()
      .then((response) => {
        if (response && response.isSuccess) {
          setCompanyOptions(
            response.data.map((user) => ({
              value: user.id,
              label: user.company?.company_name,
            }))
          );
        } else {
        }
      })
      .catch((error) => {
        // warningToast('Something went wrong !');
      });
    //eslint-disable-next-line
  }, []);

  const [jobOptions, setJobOptions] = useState([]);
  useEffect(() => {
    setRTSPJobModel(initJob);
    getAllDeployedRTSPJobsDetails()
      .then((response) => {
        if (response && response.isSuccess) {
          const data = response.data
            .filter(
              (job) =>
                job.deployment_job_rtsp_details.user_details.id ===
                company.value
            )
            .map((job) => ({
              label:
                job?.deployment_job_rtsp_details?.model_details?.model_name,
              value: job.id,
              job,
            }));
          if (company.value) {
            setJobOptions(data);
          } else setJobOptions([]);
        } else throw new Error();
      })
      .catch((error) => {
        // warningToast('Something went wrong !');
      });
    //eslint-disable-next-line
  }, [company]);

  const [cameraOptions, setCameraOptions] = useState([]);
  useEffect(() => {
    if (rtspJobModel.value) {
      setCameraOptions(
        rtspJobModel.job.deployment_job_rtsp_details?.camera_settings.map(
          (c) => ({
            label: c.camera_name,
            value: c.id,
          })
        )
      );
      // TODO: remove this -> setCameraOptions([{label: 'test 1', value: 45},{label: 'test 2', value: 48}]);
    } else {
      setCameraOptions([]);
    }
    setCamera(initCamera);
    //eslint-disable-next-line
  }, [rtspJobModel]);

  const modifyJobOptions = (options) => {
    const map = new Map();
    options.forEach((opt) => {
      const modelCount = map.get(opt.label);
      if (modelCount !== undefined)
        map.set(opt.label, modelCount + (modelCount >= 2 ? 1 : 2));
      else map.set(opt.label, 0);
    });

    const map1 = new Map(map);
    return options.map((opt) => {
      const modelCount = map.get(opt.label);
      if (modelCount) {
        map.set(opt.label, modelCount - 1);
        return {
          ...opt,
          label: map1.get(opt.label) - (modelCount + 1) + 2 + "-" + opt.label,
        };
      } else return opt;
    });
  };

  return (
    <Card>
      <CardHeader title="My Result" />

      <CardBody>
        <Form>
          <Form.Group as={Row} controlId="companyList">
            <Form.Label column sm={2}>
              Company Name
            </Form.Label>
            <Col sm={4}>
              <Select
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82",
                  },
                })}
                name="companyList"
                className="select-react-dropdown"
                options={companyOptions}
                onChange={setCompany}
                value={company}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="rtspJobModel">
            <Form.Label column sm={2}>
              Select Model
            </Form.Label>
            <Col sm={4}>
              <Select
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82",
                  },
                })}
                name="rtspJobModel"
                className="select-react-dropdown"
                options={modifyJobOptions(jobOptions)}
                onChange={(opt) => {
                  setCamera(initCamera);
                  setRTSPJobModel(opt);
                }}
                value={rtspJobModel}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="cameraOptions">
            <Form.Label column sm={2}>
              Camera Setting
            </Form.Label>
            <Col sm={4}>
              <Select
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82",
                  },
                })}
                name="cameraOptions"
                className="select-react-dropdown"
                options={cameraOptions}
                onChange={setCamera}
                value={camera}
              />
            </Col>
          </Form.Group>
        </Form>

        {camera.value ? (
          <MyResultTable
            companyId={company.value}
            jobId={rtspJobModel.value}
            cameraId={camera.value}
          />
        ) : (
          <></>
        )}
      </CardBody>
    </Card>
  );
}
