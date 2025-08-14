import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router";

import "../../../../scss/components/_forms-wizard.scss";
import { warningToast } from "../../../../utils/ToastMessage";
import { ToastContainer } from "react-toastify";
import { saveAIModelData } from "../AIModel/_redux/AiModelAction";
import { saveS3DataHandlerData } from "./_redux/S3DataHandler/S3DataHandlerAction";
import { saveTrainingSettingsData } from "./_redux/TrainingSettings/TrainingSettingsAction";
import { saveModelBannerImageData } from "./_redux/ModelBannerImage/ModeBannerImageAction";
import { saveModelResultImageData } from "./_redux/ModelResultImage/ModelResultImageAction";

const getNavStates = (indx, length) => {
  let styles = [];
  for (let i = 0; i < length; i++) {
    if (i < indx) {
      styles.push("done");
    } else if (i === indx) {
      styles.push("doing");
    } else {
      styles.push("todo");
    }
  }
  return { current: indx, styles: styles };
};

const checkNavState = (currentStep, stepsLength) => {
  if (currentStep > 0 && currentStep < stepsLength - 1) {
    return {
      showPreviousBtn: true,
      showNextBtn: true,
      showSaveBtn: false
    };
  } else if (currentStep === 0) {
    return {
      showPreviousBtn: false,
      showNextBtn: true,
      showSaveBtn: false
    };
  } else if (currentStep === stepsLength - 1) {
    return {
      showPreviousBtn: true,
      showNextBtn: false,
      showSaveBtn: true
    };
  } else {
    return {
      showPreviousBtn: true,
      showNextBtn: false,
      showSaveBtn: false
    };
  }
};

class AIModelMultiStepWizard extends React.Component {
  state = {
    showPreviousBtn: false,
    showNextBtn: true,
    compState: 0,
    navState: getNavStates(0, this.props.steps.length),
    showSaveBtn: false,
    temp: true
  };

  setNavState = next => {
    this.setState({
      navState: getNavStates(next, this.props.steps.length)
    });
    if (next < this.props.steps.length) {
      this.setState({ compState: next });
    }
    this.setState(checkNavState(next, this.props.steps.length));
  };

  isNextPageRequest = (curPage, newPage) => {
    return curPage < newPage;
  };
  isValid1Data = () => {
    let aiModelFormData = this.props.aiModel.aiModelFormData;

    if (aiModelFormData === "") {
      warningToast("Please Fill the Form");
      return false;
    }
    //if (!(/^(?=.*[a-zA-Z\d].*)[a-zA-Z\d!@#$%&,*/-]{3,}$/.test(aiModelFormData["modelName"]))) {
    if (aiModelFormData["modelName"] === "") {
      warningToast("Please Enter Model Name");
      return false;
    }
    //if (!(/^[a-zA-Z0-9\d!@#$%&,*/_ ]*$/.test(aiModelFormData["modelDescription"]))) {
    if (aiModelFormData["modelDescription"] === "") {
      warningToast("Please Enter Model Description");
      return false;
    }
    //if (!(/(?<=^| )\d+(\.\d+)?(?=$| )|(?<=^| )\.\d+(?=$| )/.test(aiModelFormData["modelCpuInferSpeed"]))) {
    if (aiModelFormData["modelCpuInferSpeed"] === "") {
      warningToast("Please Enter Model CPU Infer Speed");
      return false;
    }
    //if (!(/(?<=^| )\d+(\.\d+)?(?=$| )|(?<=^| )\.\d+(?=$| )/.test(aiModelFormData["modelGpuInferSpeed"]))) {
    if (aiModelFormData["modelGpuInferSpeed"] === "") {
      warningToast("Please Enter Model GPU Infer Speed");
      return false;
    }
    //if (!(/^[0-9]*$/.test(aiModelFormData["modelVersionId"]))) {
    if (aiModelFormData["modelVersionId"] === "") {
      warningToast("Please Enter Model Version Id");
      return false;
    }
    //if (!(/^[0-9]*$/.test(aiModelFormData["modelAccuracy"]))) {
    if (aiModelFormData["modelAccuracy"] === "") {
      warningToast("Please Enter Model Accuracy");
      return false;
    }
    //if (!(/^[a-zA-Z0-9]+$/.test(aiModelFormData["frameworkVersionNumber"]))) {
    if (aiModelFormData["frameworkVersionNumber"] === "") {
      warningToast("Please Enter Framework Version Number");
      return false;
    }
    if (aiModelFormData["modelTypeId"] === "") {
      warningToast("Please Select Model Type");
      return false;
    }
    if (aiModelFormData["modelDeviceId"] === "") {
      warningToast("Please Select Device");
      return false;
    }
    //if (!(/^[0-9]*$/.test(aiModelFormData["modelSize"]))) {
    if (aiModelFormData["modelSize"] === "") {
      warningToast("Please Enter Model Size");
      return false;
    }
    //if (!(/^[a-zA-Z0-9]+$/.test(aiModelFormData["modelDepth"]))) {
    if (aiModelFormData["modelDepth"] === "") {
      warningToast("Please Enter Model Depth");
      return false;
    }
    if (aiModelFormData["modelFrameworkId"] === "") {
      warningToast("Please Select Framework");
      return false;
    }
    return true;
  };
  isValid2Data = () => {
    let s3DataHandlerFormData = this.props.s3DataHandler.s3DataHandlerFormData;

    if (s3DataHandlerFormData === "") {
      warningToast("Please Fill the Form");
      return false;
    }
    //if (!(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(s3DataHandlerFormData["modelS3Url"]))) {
    if (s3DataHandlerFormData["modelS3Url"] === "") {
      warningToast("Please Enter Model S3 URL");
      return false;
    }
    //if (!(/^(?=.*[a-zA-Z\d].*)[a-zA-Z\d!@#$%&,*/-]{3,}$/.test(s3DataHandlerFormData["model_s3modelS3Key_key"] ))) {
    if (s3DataHandlerFormData["model_s3modelS3Key_key"] === "") {
      warningToast("Please Enter Model S3 Key");
      return false;
    }
    //if (!(/^(?=.*[a-zA-Z\d].*)[a-zA-Z\d!@#$%&,*/-]{3,}$/.test(s3DataHandlerFormData["modelS3Name"]))) {
    if (s3DataHandlerFormData["modelS3Name"] === "") {
      warningToast("Please Enter S3 Name");
      return false;
    }
    //if (!(/^[0-9]*$/.test(s3DataHandlerFormData["modelVersion"]))) {
    if (s3DataHandlerFormData["modelVersion"] === "") {
      warningToast("Please Enter Model Version");
      return false;
    }

    return true;
  };
  isValid3Data = () => {
    let trainingSettingsFormData = this.props.trainingSettings
      .trainingSettingsFormData;

    if (trainingSettingsFormData === "") {
      warningToast("Please Fill the Form");
      return false;
    }
    //if (!(/^[0-9]*$/.test(trainingSettingsFormData["imageSize"]))) {
    if (trainingSettingsFormData["imageSize"] === "") {
      warningToast("Please Enter Image Size");
      return false;
    }
    //if (!(/^[0-9]*$/.test(trainingSettingsFormData["modelTrainingBatchSize"]))) {
    if (trainingSettingsFormData["modelTrainingBatchSize"] === "") {
      warningToast("Please Enter Model Training Batch Size");
      return false;
    }
    //if (!(/^[0-9]*$/.test(trainingSettingsFormData["batchSize"]))) {
    if (trainingSettingsFormData["batchSize"] === "") {
      warningToast("Please Enter Batch Size");
      return false;
    }
    //if (!(/^[0-9]*$/.test(trainingSettingsFormData["modelEpochs"]))) {
    if (trainingSettingsFormData["modelEpochs"] === "") {
      warningToast("Please Enter Model  Epochs");
      return false;
    }
    //if (!(/^(?=.*[a-zA-Z\d].*)[a-zA-Z\d!@#$%&,*/-]{3,}$/.test(trainingSettingsFormData["modelLabelsList"]))) {
    if (trainingSettingsFormData["modelLabelsList"] === "") {
      warningToast("Please Enter Model Labels List");
      return false;
    }

    return true;
  };
  isValid4Data = () => {
    let modelResultImageFormData = this.props.modelResultImage
      .modelResultImageFormData;

    if (modelResultImageFormData === "") {
      warningToast("Please Fill the Form");
      return false;
    }
    if (!modelResultImageFormData["image"]) {
      warningToast("Please Choose Image");
      return false;
    }
    // else {

    //     if (modelResultImageFormData["image"] !== null) {
    //         if (!modelResultImageFormData["image"].match(/\.(jpg|jpeg|png)$/)) {
    //             warningToast("Please Select Valid Image");
    //             return false;
    //         }
    //     }
    // }

    return true;
  };
  isValid5Data = () => {
    let modelBannerImageFormData = this.props.modelBannerImage
      .modelBannerImageFormData;

    if (modelBannerImageFormData === "") {
      warningToast("Please Fill the Form");
      return false;
    }

    if (!modelBannerImageFormData["image"]) {
      warningToast("Please Choose Image");
      return false;
    }
    // else{
    //     if (modelBannerImageFormData["image"] !== null){

    //      if (!modelBannerImageFormData["image"].match(/\.(jpg|jpeg|png)$/)) {
    //             warningToast("Please Select Valid Image");
    //             return false;
    //         }
    //     }
    // }

    return true;
  };
  isValidData = (curPage, newPage) => {
    if (this.isNextPageRequest(curPage, newPage)) {
      if (curPage === 0 && this.isValid1Data()) {
        // this.props.saveAIModelData({ ...this.props.aiModel.aiModelFormData })
        return true;
      }
      if (curPage === 1 && this.isValid2Data()) {
        return true;
      }
      if (curPage === 2 && this.isValid3Data()) {
        return true;
      }
      if (curPage === 3 && this.isValid4Data()) {
        return true;
      }
      if (curPage === 4 && this.isValid5Data()) {
        return true;
      }
      if (newPage > curPage + 1) {
        warningToast("Can not Jump without selecting previous Selection");
        return false;
      }
      return false;
    }
    return true;
  };

  handleOnClick = evt => {
    if (this.isValidData(this.state.compState, evt.currentTarget.value)) {
      if (
        evt.currentTarget.value === this.props.steps.length - 1 &&
        this.state.compState === this.props.steps.length - 1
      ) {
        this.setNavState(this.props.steps.length);
      } else {
        this.setNavState(evt.currentTarget.value);
      }
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.aiModel.aiModelCreatedData && this.state.temp) {
      this.setState(
        {
          temp: false
        },
        () => {
          this.remaing4API(nextProps.aiModel.aiModelCreatedData);
        }
      );
    }

    if (nextProps.modelBannerImage.apicalled) {
      const origin = window.location.origin;
      window.location.replace(origin.concat("/aiModel/view/modelData"));
    }
  }

  remaing4API = response => {
    setTimeout(() => {
      this.props.saveS3DataHandlerData(
        { ...this.props.s3DataHandler.s3DataHandlerFormData },
        response.data.id
      );
    }, 1000);
    setTimeout(() => {
      this.props.saveTrainingSettingsData(
        { ...this.props.trainingSettings.trainingSettingsFormData },
        response.data.id
      );
    }, 2000);
    setTimeout(() => {
      this.props.saveModelResultImageData(
        { ...this.props.modelResultImage.modelResultImageFormData },
        response.data.id
      );
    }, 3000);
    setTimeout(() => {
      this.props.saveModelBannerImageData(
        { ...this.props.modelBannerImage.modelBannerImageFormData },
        response.data.id
      );
    }, 4000);
  };

  save = evt => {
    if (this.isValid5Data()) {
      this.props.saveAIModelData({ ...this.props.aiModel.aiModelFormData });
    }
  };

  next = () => {
    if (this.isValidData(this.state.compState, this.state.compState + 1))
      this.setNavState(this.state.compState + 1);
  };

  previous = () => {
    if (this.state.compState > 0) {
      this.setNavState(this.state.compState - 1);
    }
  };

  getClassName = (className, i) => {
    return className + "-" + this.state.navState.styles[i];
  };

  renderSteps = () => {
    return this.props.steps.map((s, i) => (
      <li
        className={this.getClassName("form-wizard-step", i)}
        onClick={this.handleOnClick}
        key={i}
        value={i}
      >
        <em>{i + 1}</em>
        <span style={{ fontSize: "1.2rem" }}>{this.props.steps[i].name}</span>
        {/*<span>{this.props.steps[i].name}</span>*/}
      </li>
    ));
  };

  render() {
    return (
      <div>
        <ol className="forms-wizard">{this.renderSteps()}</ol>
        {this.props.steps[this.state.compState].component}
        <div className="divider" />
        <div className="clearfix">
          <div style={this.props.showNavigation ? {} : { display: "none" }}>
            <Button
              variant="primary"
              className="btn-shadow float-left"
              outline
              style={this.state.showPreviousBtn ? {} : { display: "none" }}
              onClick={this.previous}
            >
              Previous
            </Button>
            {this.state.showNextBtn ? (
              <Button
                onClick={this.next}
                variant="primary"
                className="btn-shadow float-right"
              >
                Next
              </Button>
            ) : (
              <div></div>
            )}
            {this.state.showSaveBtn ? (
              <Button
                onClick={this.save}
                variant="success"
                className="btn-shadow float-right"
              >
                Save
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
}

/*MultiImageAnalyzerWizard.defaultProps = {
    showNavigation: true
};*/

const mapStateToProps = state => ({
  aiModel: state.aiModel,
  s3DataHandler: state.s3DataHandler,
  trainingSettings: state.trainingSettings,
  modelBannerImage: state.modelBannerImage,
  modelResultImage: state.modelResultImage
});
const mapDispatchToProps = () => dispatch => {
  return {
    saveAIModelData: aiModelData => {
      dispatch(saveAIModelData(aiModelData));
    },
    saveS3DataHandlerData: (s3DataHandlerData, id) => {
      dispatch(saveS3DataHandlerData(s3DataHandlerData, id));
    },
    saveTrainingSettingsData: (trainingSettingsData, id) => {
      dispatch(saveTrainingSettingsData(trainingSettingsData, id));
    },
    saveModelBannerImageData: (modelBannerImageData, id) => {
      dispatch(saveModelBannerImageData(modelBannerImageData, id));
    },
    saveModelResultImageData: (modelResultImageData, id) => {
      dispatch(saveModelResultImageData(modelResultImageData, id));
    }
  };
};

//export default connect(mapStateToProp)(MultiImageAnalyzerWizard);
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AIModelMultiStepWizard)
);
