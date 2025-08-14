from fastapi import APIRouter

from api.api_v1.endpoints import (
    users,
    devices,
    login,
    model_types,
    ai_frameworks,
    ai_models,
    ai_model_banner_images,
    ai_model_results_imgs,
    ai_model_settings,
    ai_model_s3_data_handler,
    ai_infer_jobs,
    load_infer_job,
    result_feedback,
    deployment_types,
    deployment_jobs,
    deployment_handler_rest,
    depoyment_job_rtsp_api,
    deployment_cameras,
    deployment_handler_rtsp_rest,
    mail_handler,
    result_handler,
    label_settings,
    result_feedback_image,
    company_api,
    location_api,
    model_test_credit_api,
    feedback_api,
    complaint_api,
    notification_api,
    filter_api,
    widgets_api,
    camera_roi_api,
    employee_api,
    company_setting_api,
    violation_setting_api,
    employee_violation_api,
    graph_api,
    model_main_category_api,
    report_handler,
    camera_label_mapping_api,
    demog_emp,
    demog_organisation_api,
    demog_emp_login,
    demog_department_api,
    demog_location_api,
    demog_shift,
    event_handler,
    event_filter_api,
    rtsp_down_odit_api,
    nvr_api,
    vehicle_details_api,
    notification_config_api,
)

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(company_api.router, tags=["company management"])
api_router.include_router(location_api.router, tags=["location"])
api_router.include_router(users.router, tags=["users"])
api_router.include_router(devices.router, tags=["device"])
api_router.include_router(model_types.router, tags=["model types"])
api_router.include_router(ai_frameworks.router, tags=["framework details"])
api_router.include_router(ai_models.router, tags=["ai models"])
api_router.include_router(
    ai_model_banner_images.router, tags=["add model banner images"]
)
api_router.include_router(
    ai_model_results_imgs.router, tags=["add model result images"]
)
api_router.include_router(ai_model_settings.router, tags=["training settings"])
api_router.include_router(ai_model_s3_data_handler.router, tags=["s3 data handler"])
api_router.include_router(ai_infer_jobs.router, tags=["infer jobs"])
api_router.include_router(load_infer_job.router, tags=["load infer jobs"])
api_router.include_router(result_feedback.router, tags=["result feedback"])
api_router.include_router(result_feedback_image.router, tags=["result feedback image"])
api_router.include_router(deployment_types.router, tags=["deployment types"])
api_router.include_router(deployment_jobs.router, tags=["deployment jobs"])
# api_router.include_router(deployment_handler_rest.router, tags=["deployment handler"])
api_router.include_router(
    depoyment_job_rtsp_api.router, tags=["deployment rtsp/camera jobs"]
)
api_router.include_router(
    deployment_cameras.router, tags=["deployment camera management"]
)
api_router.include_router(
    deployment_handler_rtsp_rest.router, tags=["RTSP/Camera deployment handler"]
)
api_router.include_router(mail_handler.router, tags=["Mail handler"])
api_router.include_router(result_handler.router, tags=["Results handler"])
api_router.include_router(label_settings.router, tags=["Label Settings"])
api_router.include_router(model_test_credit_api.router, tags=["Credits Management"])
api_router.include_router(feedback_api.router, tags=["Feedback"])
api_router.include_router(complaint_api.router, tags=["Complaint"])
api_router.include_router(notification_api.router, tags=["Notification"])
api_router.include_router(filter_api.router, tags=["Filter"])
api_router.include_router(widgets_api.router, tags=["Widgets"])
api_router.include_router(camera_roi_api.router, tags=["Camera ROI"])
api_router.include_router(employee_api.router, tags=["Employee"])
api_router.include_router(company_setting_api.router, tags=["Company Setting"])
api_router.include_router(violation_setting_api.router, tags=["Violation Setting"])
api_router.include_router(employee_violation_api.router, tags=["Employee Violation"])
api_router.include_router(graph_api.router, tags=["Graph"])
api_router.include_router(model_main_category_api.router, tags=["Model Categories"])
api_router.include_router(report_handler.router, tags=["Report handler"])
api_router.include_router(
    camera_label_mapping_api.router, tags=["Camera Label Mapping"]
)
api_router.include_router(demog_emp.router, tags=["demog_emp"])
api_router.include_router(demog_organisation_api.router, tags=["demog_organisation"])
api_router.include_router(demog_emp_login.router, tags=["demog_emp_login"])
api_router.include_router(demog_department_api.router, tags=["demog_department"])
api_router.include_router(demog_location_api.router, tags=["demog_location"])
api_router.include_router(demog_shift.router, tags=["demog_shift"])
api_router.include_router(event_handler.router, tags=["event_handler"])
api_router.include_router(event_filter_api.router, tags=["event_filter_api"])
api_router.include_router(rtsp_down_odit_api.router, tags=["rtsp_down_odit_api"])
api_router.include_router(nvr_api.router, tags=["nvr_api"])
api_router.include_router(vehicle_details_api.router, tags=["vehicle_details_api"])
api_router.include_router(
    notification_config_api.router, tags=["notification_config_api"]
)
