import React, { Fragment } from "react";
import "../../../../scss/components/_forms-wizard.scss";
import AIModelMultiStepWizard from "./wizard";
import ModelBannerImage from "./Steps/Step5/Step1";
import AiModelDetails from "./Steps/Step1/Step5";
import S3DataHandler from "./Steps/Step2/Step4";
import TrainingSettings from "./Steps/Step3/Step3";
import ModelResultImage from "./Steps/Step4/Step2";

const steps = [
  { name: "AI Model", component: <AiModelDetails /> },
  { name: "S3 Data", component: <S3DataHandler /> },
  { name: "Settings", component: <TrainingSettings /> },
  { name: "Result", component: <ModelResultImage /> },
  { name: "Banner", component: <ModelBannerImage /> },
];

export default class AIModelWizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <>
        <div className="forms-wizard-alt">
          <AIModelMultiStepWizard showNavigation={true} steps={steps} />
        </div>
      </>
    );
  }
}
