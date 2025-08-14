import logging
from core.config import settings
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

INSTANCE_KEY = "6ea3d372-3677-41c7-ac26-1a345eae946f"
notification_type_whatsapp = "WHATSAPP"
notification_type_email = "EMAIL"


def send_email_message(to_email, pdf_file_name, mail_subject, mail_body):
    try:
        msg = MIMEMultipart()
        msg["From"] = settings.NOTIFICATION_SEND_EMAIL
        msg["To"] = to_email
        msg["Subject"] = mail_subject
        body = mail_body
        msg.attach(MIMEText(body, "plain"))
        attachment = open(pdf_file_name, "rb")
        p = MIMEBase("application", "octet-stream")
        p.set_payload(attachment.read())
        encoders.encode_base64(p)
        p.add_header("Content-Disposition", f"attachment; filename=TuskerAI.pdf")
        msg.attach(p)
        s = smtplib.SMTP("smtp.gmail.com", 587)
        s.starttls()
        s.login(settings.NOTIFICATION_SEND_EMAIL, settings.NOTIFICATION_SEND_PASS)
        text = msg.as_string()
        s.sendmail(
            settings.NOTIFICATION_SEND_EMAIL,
            to_email.split(","),
            text,
        )
        s.quit()
        return True
    except Exception as ex:
        logging.error(f"Fail to send email message: {pdf_file_name} | Exception: {ex}")
        return False


def send_notification_message(notification_type, meta_data, pdf_file_name):
    if notification_type == notification_type_email:
        mail_subject = "Violation Alert"
        mail_body = """Dear Client,
        Our AI system has detected critical safety violations at your location. Please find attached a document with frames highlighting the locations of the incidents.
        
Best regards,
Team Tusker AI
"""
        to_email = ",".join(
            [
                email_data["email"]
                for email_data in meta_data["to_email"]
                if email_data["status"] == True
            ]
        )
        if to_email:
            return send_email_message(to_email, pdf_file_name, mail_subject, mail_body)
        else:
            return False
