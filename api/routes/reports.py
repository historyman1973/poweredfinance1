from flask import Blueprint, render_template, make_response
import pdfkit
from models import Client

reports_blueprint = Blueprint('reports_blueprint', __name__)

path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

@reports_blueprint.route("/mi-client-list")
def mi_client_list():

    clients = Client.query.all()

    report = render_template('./mi-client-list.html', clients=clients)
    pdf = pdfkit.from_string(report, False)

    response = make_response(pdf)
    response.headers["Content-Type"] = 'application/pdf'
    response.headers["Content-Disposition"] = 'inline; filename=client_list.pdf'

    return response