from flask import Blueprint, render_template, make_response
import pdfkit
from models import Client
from routes.clients import get_networth

reports_blueprint = Blueprint('reports_blueprint', __name__)

path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)

@reports_blueprint.route("/mi-client-list")
def mi_client_list():

    target_clients = Client.query.all()
    clients = []
    for client in target_clients:
        new_client = {
            "id": client.id,
            "forename": client.forename,
            "middle_names": client.middle_names,
            "surname": client.surname,
            "gender": client.gender,
            "networth": "${:,.2f}".format(get_networth(client.id).get_json()["networth"])
        }

        clients.append(new_client)

    report = render_template('./mi-client-list.html', clients=clients)
    pdf = pdfkit.from_string(report, False)

    response = make_response(pdf)
    response.headers["Content-Type"] = 'application/pdf'
    response.headers["Content-Disposition"] = 'inline; filename=client_list.pdf'

    return response