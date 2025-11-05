import React, { useState } from "react";
import { useFormik } from "formik";
import { connect, useDispatch } from "react-redux";
import * as Yup from "yup";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const initialCompanyValues = {
  company_name: "",
  company_email: "",
  company_description: "",
  company_address: "",
  company_pin_code: "",
  company_website: "",
  company_contact: "",
  company_poc: "",
  deployment_region: "",
  company_poc_contact: "",
};

const deploymentRegions = [
  {
    id: 1,
    name: "Ohio",
    value: "us-east-2",
  },
  {
    id: 2,
    name: "N. Virginia",
    value: "us-east-1",
  },
  {
    id: 3,
    name: "N. California",
    value: "us-west-1",
  },
  {
    id: 4,
    name: "Oregon",
    value: "us-west-2",
  },
  {
    id: 5,
    name: "Cape Town",
    value: "af-south-1",
  },
  {
    id: 6,
    name: "Hong Kong",
    value: "ap-east-1",
  },
  {
    id: 7,
    name: "Mumbai",
    value: "ap-south-1",
  },
  {
    id: 8,
    name: "Osaka",
    value: "ap-northeast-3",
  },
  {
    id: 9,
    name: "Seoul",
    value: "ap-northeast-2",
  },
  {
    id: 10,
    name: "Singapore",
    value: "ap-southeast-1",
  },
  {
    id: 11,
    name: "Sydney",
    value: "ap-southeast-2",
  },
  {
    id: 12,
    name: "Tokyo",
    value: "ap-northeast-1",
  },
  {
    id: 13,
    name: "Central",
    value: "ca-central-1",
  },
  {
    id: 14,
    name: "Frankfurt",
    value: "eu-central-1",
  },
  {
    id: 15,
    name: "Ireland",
    value: "eu-west-1",
  },
  {
    id: 16,
    name: "London",
    value: "eu-west-2",
  },
  {
    id: 17,
    name: "Milan",
    value: "eu-south-1",
  },
  {
    id: 18,
    name: "Paris",
    value: "eu-west-3",
  },
  {
    id: 19,
    name: "Stockholm",
    value: "eu-north-1",
  },
  {
    id: 20,
    name: "Bahrain",
    value: "me-south-1",
  },
  {
    id: 21,
    name: "São Paulo",
    value: "sa-east-1",
  },
];

function RegistrationCompany(props) {
  // eslint-disable-next-line
  const dispatch = useDispatch();
  const history = useHistory();
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const RegistrationCompanySchema = Yup.object().shape({
    company_name: Yup.string()
      .matches(/[^0-9]/, "Please Enter Valid Company Name")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    company_email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    company_description: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(500, "Maximum 500 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    company_address: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(500, "Maximum 500 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    company_pin_code: Yup.string()
      .matches(/^[0-9]{5,6}$/, "Please enter valid company pin code")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    company_website: Yup.string()
      // .url("Enter valid company website")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    company_contact: Yup.string()
      .matches(/^[0-9]{10,11}$/, "Please enter valid contact number")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    company_poc: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(25, "Maximum 20 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    company_poc_contact: Yup.string()
      .matches(/^[0-9]{10,11}$/, "Please enter valid contact number")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    deployment_region: Yup.string().required(
      intl.formatMessage({
        id: "AUTH.VALIDATION.REQUIRED_FIELD",
      })
    ),
  });

  // eslint-disable-next-line
  const enableLoading = () => {
    setLoading(true);
  };

  // eslint-disable-next-line
  const disableLoading = () => {
    setLoading(false);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues: initialCompanyValues,
    validationSchema: RegistrationCompanySchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      // enableLoading();
      history.push({
        pathname: "/auth/user-registration",
        state: {
          // companyId: response.data?.id
          company_address: values.company_address,
          company_contact: values.company_contact,
          company_description: values.company_description,
          company_email: values.company_email,
          company_name: values.company_name,
          company_pin_code: values.company_pin_code,
          company_poc: values.company_poc,
          company_poc_contact: values.company_poc_contact,
          company_website: values.company_website,
          deployment_region: values.deployment_region,
        },
      });

      // registerCompany(values)
      //     .then(response => {
      //         dispatch(props.setUser({company: response.data}));
      //         history.push({
      //             pathname: '/auth/user-registration',
      //             state: {
      //                 companyId: response.data?.id
      //             }
      //         })
      //         disableLoading();
      //     })
      //     .catch(() => {
      //         disableLoading();
      //         setSubmitting(false);
      //         setStatus('Something went wrong');
      //     });
    },
  });

  return (
    <div
      className="login-form login-signin"
      style={{ display: "block", overflow: "auto" }}
    >
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.REGISTER.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          Enter your company details to complete Step 1/2
        </p>
      </div>

      <form
        id="kt_login_signin_form"
        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
        onSubmit={formik.handleSubmit}
      >
        {/* begin: Alert */}
        {formik.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
        {/* end: Alert */}

        {/* begin: Company Name */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Company Name"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "company_name"
            )}`}
            name="company_name"
            {...formik.getFieldProps("company_name")}
          />
          {formik.touched.company_name && formik.errors.company_name ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.company_name}</div>
            </div>
          ) : null}
        </div>
        {/* end: Company Name */}

        {/* begin: Company Email */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Company Email"
            type="company_email"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "company_email"
            )}`}
            name="company_email"
            {...formik.getFieldProps("company_email")}
          />
          {formik.touched.company_email && formik.errors.company_email ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.company_email}</div>
            </div>
          ) : null}
        </div>
        {/* end: Company Email */}

        {/* begin: Company Description */}
        <div className="form-group fv-plugins-icon-container">
          <textarea
            placeholder="Company Description"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "company_description"
            )}`}
            name="company_description"
            {...formik.getFieldProps("company_description")}
          />
          {formik.touched.company_description &&
          formik.errors.company_description ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.company_description}
              </div>
            </div>
          ) : null}
        </div>
        {/* end: Company Description */}

        {/* begin: Company Address */}
        <div className="form-group fv-plugins-icon-container">
          <textarea
            placeholder="Company Address"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "company_address"
            )}`}
            name="company_address"
            {...formik.getFieldProps("company_address")}
          />
          {formik.touched.company_address && formik.errors.company_address ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.company_address}
              </div>
            </div>
          ) : null}
        </div>
        {/* end: Company Address */}

        {/* begin: Company Pin Code */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Company Pin Code"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "company_pin_code"
            )}`}
            name="company_pin_code"
            {...formik.getFieldProps("company_pin_code")}
          />
          {formik.touched.company_pin_code && formik.errors.company_pin_code ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.company_pin_code}
              </div>
            </div>
          ) : null}
        </div>
        {/* end: Company Pin Code */}

        {/* begin: Company Website */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Company Website"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "company_website"
            )}`}
            name="company_website"
            {...formik.getFieldProps("company_website")}
          />
          {formik.touched.company_website && formik.errors.company_website ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.company_website}
              </div>
            </div>
          ) : null}
        </div>
        {/* end: Company Website */}

        {/* begin: Company Contact */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Company Contact"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "company_contact"
            )}`}
            name="company_contact"
            {...formik.getFieldProps("company_contact")}
          />
          {formik.touched.company_contact && formik.errors.company_contact ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.company_contact}
              </div>
            </div>
          ) : null}
        </div>
        {/* end: Company Contact */}

        {/* begin: Company POC */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Company POC"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "company_poc"
            )}`}
            name="company_poc"
            {...formik.getFieldProps("company_poc")}
          />
          {formik.touched.company_poc && formik.errors.company_poc ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.company_poc}</div>
            </div>
          ) : null}
        </div>
        {/* end: Company POC */}

        {/* begin: Company POC Contact */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Company POC Contact"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "company_poc_contact"
            )}`}
            name="company_poc_contact"
            {...formik.getFieldProps("company_poc_contact")}
          />
          {formik.touched.company_poc_contact &&
          formik.errors.company_poc_contact ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.company_poc_contact}
              </div>
            </div>
          ) : null}
        </div>

        {/* begin: Deployment Region */}
        <div className="form-group fv-plugins-icon-container">
          <Form.Control
            as="select"
            name="deployment_region"
            className={`form-control form-control-solid h-auto py-5 px-6${getInputClasses(
              "deployment_region"
            )}`}
            {...formik.getFieldProps("deployment_region")}
          >
            {!formik.values.deployment_region && (
              <option value={-1}>Select Deployment Region</option>
            )}
            {deploymentRegions?.map((d) => (
              <option value={d.value} key={d.id}>
                {d.name}
              </option>
            ))}
          </Form.Control>
          {formik.touched.deployment_region &&
          formik.errors.deployment_region ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.deployment_region}
              </div>
            </div>
          ) : null}
        </div>
        {/* end: Deployment Region*/}

        <div className="form-group d-flex flex-wrap flex-center">
          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
          >
            <span>Next</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>

          {/*<Link to="/auth/login">*/}
          {/*    <button*/}
          {/*        type="button"*/}
          {/*        className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"*/}
          {/*    >*/}
          {/*        Cancel*/}
          {/*    </button>*/}
          {/*</Link>*/}
        </div>
      </form>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(RegistrationCompany));
