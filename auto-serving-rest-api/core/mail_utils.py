import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from core.config import settings
from applogging.applogger import MyLogger

logging = MyLogger().get_logger("mail_utils")


def send_email(
    from_mail,
    from_mail_pass,
    to_mail_list,
    mail_subject,
    mail_body,
    cc_list=[],
    bcc_list=[],
):
    try:
        logging.info(
            """
                from : {} 
                to : {}
                cc : {}
                bcc : {}
                subject : {}
                body : {}""".format(
                from_mail,
                to_mail_list,
                cc_list,
                bcc_list,
                mail_subject,
                mail_body,
                to_mail_list,
            )
        )

        msg = MIMEMultipart()
        msg["Subject"] = mail_subject
        body = mail_body
        msg.attach(MIMEText(body, "plain"))
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(from_mail, from_mail_pass)
        server.sendmail(from_mail, to_mail_list, msg.as_string())
        server.quit()

    except Exception as ex:
        logging.error("Exception in mail send : {}".format(ex))


def send_activate_mail_to_user(company_name, recipient_list):
    mail_body = """
    Dear User from {},

    Greetings from, AUTO-AI Serving.

    We are happy to inform you, your account is now enabled.

    Login URL - {}

    You can now explore, test and deploy as per your business requirements state of the art AI models.

    Start your AI journey now!
    
    Thanks and Regards.
            """.format(
        company_name, settings.HOSTED_SITE_URL
    )
    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.ENABLE_USER_SUBJECT,
        mail_body=mail_body,
    )


def send_user_registration_mail(recipient_list):
    mail_body = """
    Dear User, Thanks for the registration.

    Our support team will verify the details and activate your account. We will revert back to you soon.

    Your AI Journey is just few steps away!
    
    Thanks and Regards.
    """
    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_REGISTRATION_SUBJECT,
        mail_body=mail_body,
    )


def send_registration_mail_to_superadmin(company_name, recipient_list):
    mail_body = """
    Dear Admin, Congratulations!
     
    We have a new on-boarding.
    
    Company name - {}
    
    Please verify the details, payments and activate the account.
    
    Thanks and Regards.
    """.format(
        company_name
    )

    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_REGISTRATION_SUBJECT_ADMIN,
        mail_body=mail_body,
    )


def send_deployment_job_mail_user(model_name, recipient_list):
    mail_body = """
    Dear User,

    Your request for the {} model service has been recorded.

    Our support team will verify the request details and revert back to you soon.
    
    Kudos to Your AI Journey!
    
    Thanks and Regards.
    """.format(
        model_name
    )

    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_ADD_JOB_SUBJECT,
        mail_body=mail_body,
    )


def send_deployment_job_mail_admin(model_name, recipient_list):
    mail_body = """
    Dear Admin,

    We have received a request for the {} model deployment.

    Please verify the details, payments and complete the deployment.
    
    Thanks and Regards.
    """.format(
        model_name
    )

    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_ADD_JOB_SUBJECT,
        mail_body=mail_body,
    )


def send_deployed_job_mail_user(model_name, api_endpoint, docs, recipient_list):
    mail_body = """
    Dear User,
    
    Congratulations and Welcome to the marvelous world of AI.
    
    As per your request, we have successfully activated the services for {} model.
    
    Model Name : {} 
    
    API endpoint : {}
    
    API Documentation : {}
    
    Also, Refer the following link for sample code to get the results from the API.
    
    {}
    
    Thanks and Regards.
    """.format(
        model_name, model_name, api_endpoint, docs, settings.API_EXAMPLE_URL
    )

    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_ADD_JOB_SUBJECT,
        mail_body=mail_body,
    )


def send_deployed_job_mail_admin(
    model_name, api_endpoint, company_name, recipient_list
):
    mail_body = """
    Dear Admin,

    The model {} is successfully deployed, PFB details.

    Model Name : {} 
    
    Company Name : {}
    
    API endpoint : {}
    
    Thanks and Regards.
    """.format(
        model_name, model_name, company_name, api_endpoint
    )

    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_ADD_JOB_SUBJECT,
        mail_body=mail_body,
    )


def send_stop_deployed_job_mail_user(model_name, recipient_list):
    mail_body = """
    Dear User,

    As per your request, we have stopped your services for {} model.
    
    Hope you enjoyed your AI journey!
    
    Thanks and Regards.
    """.format(
        model_name
    )

    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_ADD_JOB_SUBJECT,
        mail_body=mail_body,
    )


def send_stop_deployed_job_mail_admin(model_name, company_name, recipient_list):
    mail_body = """
    Dear Admin,
    
    The deployment of {} model for the {} has been terminated successfully.
    
    Thanks and Regards.
    """.format(
        model_name, company_name
    )

    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_ADD_JOB_SUBJECT,
        mail_body=mail_body,
    )


def send_deployed_rtsp_job_mail_user(model_name, recipient_list):
    mail_body = """
    Dear User,

    Congratulations and Welcome to the marvelous world of AI.

    As per your request, we have successfully activated the services for {} model.
    
    You would be able to view the results in the dashboard after few moments.
    
    Thanks and Regards.
    """.format(
        model_name, model_name
    )

    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_ADD_JOB_SUBJECT,
        mail_body=mail_body,
    )


def send_deployed_rtsp_job_mail_admin(model_name, company_name, recipient_list):
    mail_body = """
    The model {} is successfully deployed, PFB details.

    Model Name : {} 
    
    Company Name : {}
    
    Thanks and Regards.
    """.format(
        model_name, model_name, company_name
    )

    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_ADD_JOB_SUBJECT,
        mail_body=mail_body,
    )


def send_rtsp_down_mail_user(rtsp_url, model_name, recipient_list):
    mail_body = """
    Dear User,
    
    We have detected that the below listed RTSP URL is not accessible from our server.
    
    RTSP URL: {}
    
    Model Name : {}
    
    As we are not able process this RTSP URL, result would not be generated. 
    
    Thanks and Regards.
    """.format(
        rtsp_url, model_name
    )

    send_email(
        settings.MAIL_USER,
        settings.MAIL_PASS,
        to_mail_list=recipient_list,
        mail_subject=settings.USER_ADD_JOB_SUBJECT,
        mail_body=mail_body,
    )
