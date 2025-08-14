from datetime import datetime
import os
from weasyprint import HTML

from applogging.applogger import MyLogger

logging = MyLogger().get_logger("pdf_utils")


def create_pdf(final_pdf_data, output_file_path):
    try:
        html_data = f"""
        <html lang="en">
        <head>
            <title>Tusker AI Violation Report</title>
        </head>
        <style>
            @page {{
                size: A4;
                margin: 15px 15px 30px;
                @bottom-right {{
                    content: "Page " counter(page);
                    font-size: 10px;
                    color: #333;
                    margin-bottom: 30px;
                    margin-right: 15px;
                }}
                @bottom-left {{
                    content:  "Date: {datetime.now().strftime("%d/%m/%Y")}";
                    font-size: 10px;
                    color: #333;
                    margin-bottom: 30px;
                    margin-left: 15px;
                    width: 90%;
                }}
            }}
        
            body {{
                font-family: 'Roboto', sans-serif;
            }}
        
            header {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #333;
                padding-bottom: 10px;
            }}
        
             .logo {{
                width: 140px;
                height: 40px;
            }}
        
            .date-info {{
                font-size: 10px;
                font-weight: 500;
                height: 0;
            }}
        
            .title {{
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 20px;
            }}
        
            .section-title {{
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
                margin-top: 15px;
                display:inherit;
            }}
        
            .text {{
                font-size: 12px;
                margin-bottom: 10px;
                text-align: justify;
                display:inline-block;
            }}
        
            .image-row {{
                display: grid;
                grid-template-columns: auto auto; 
                gap: 10px;    
            }}
        
            .image-container {{     
                padding: 5px;
                border: 1px solid #333;
                border-radius: 5px;
                position: relative;
                width: 48%;
                display: inline-block;
            }}
        
            .image {{
                width: 100%;
                height: 160px;
                border-radius: 5px;
            }}
        
            .image-detail {{
                font-size: 12px;
                margin-top: 5px;
            }}
            .report-section{{
                display: inline;
            }}
        </style>
        <body>
        <header>
            <img src="file://{os.path.abspath("images/mpl_logo.png")}" alt="MPL Logo" class="logo">
            <img src="file://{os.path.abspath("images/logo.png")}" alt="Tusker AI Logo" class="logo">
        </header>
        <h1 class="title">
            Maithon Power Limited Violation Report
        </h1>
        <h2 class="section-title">
            AI-Driven Insights for Operational Excellence:
        </h2>
        <p class="text">
            Our AI solutions transform raw data into actionable intelligence. This report provides insights to help you optimize performance and mitigate risks.
        </p>
        <span class="report-section">
        """
        for key, value in final_pdf_data.items():
            html_data += f"""
            <br><h3 class="section-title" style="line-height:30px;">• {" ".join([word.capitalize() for word in key.split("_")])} </h3><br>
            <span class="image-row">
            """
            for image in value:
                html_data += f"""
                <div class="image-container">
                    <img src="file://{os.path.abspath(image['file_path'])}" alt="Location A" class="image">
                    <div class="image-detail">
                """
                for key, value in image.items():
                    if key != "file_path":
                        html_data += f"<span><strong>{key}: </strong>{value}</span><br>"
                html_data += """
                    </div>
                </div>
                """
            html_data += """
            </span>
            """
        html_data += """
        </span>
        </body>
        </html>
        """

        HTML(string=html_data).write_pdf(output_file_path)
        logging.info(f"PDF created successfully. output_file_path: {output_file_path}")
        return True
    except Exception as e:
        logging.error(f"Exception in create_pdf: {e}")
        return False
