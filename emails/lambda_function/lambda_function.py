import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json

def render_template(name):
    """Đọc file email_template.html và thay biến {{ name }}"""
    with open(os.path.join(os.path.dirname(__file__), "welcome.html"), "r", encoding="utf-8") as f:
        template = f.read()
    return template.replace("{{ name }}", name)

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        name = body.get("name")
        recipient = body.get("email")

        if not name or not recipient:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Thiếu tên hoặc email người nhận."})
            }

        gmail_user = "oldiezone@gmail.com"
        gmail_password = "txaj phbw scbp yodu"

        body_html = render_template(name)

        msg = MIMEMultipart()
        msg["From"] = gmail_user
        msg["To"] = recipient
        msg["Subject"] = "Welcome to Oldiezone!"
        msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(gmail_user, gmail_password)
            server.send_message(msg)

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Success!"})
        }

    except Exception as e:
        print("Lỗi:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
