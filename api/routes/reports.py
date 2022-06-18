from flask import Blueprint, render_template, make_response
import pdfkit
from models import Client, Investment, Property, Liability, OtherAsset
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
            # "networth": "${:,.2f}".format(get_networth(client.id).get_json()["networth"])
        }

        clients.append(new_client)

    report = render_template('./mi-client-list.html', clients=clients)
    pdf = pdfkit.from_string(report, False)

    response = make_response(pdf)
    response.headers["Content-Type"] = 'application/pdf'
    response.headers["Content-Disposition"] = 'inline; filename="%client_list"%.pdf'
    response.headers["Content-Orientation"] = 'landscape'

    return response

@reports_blueprint.route("/client-summary/<client_id>")
def client_summary(client_id):

    client = Client.query.get(client_id)
    if client.isPrimary == 1:
        investments = Investment.query.filter(Investment.owner1_id == client_id)
        otherassets = OtherAsset.query.filter(OtherAsset.owner1_id == client_id)
        properties = Property.query.filter(Property.owner1_id == client_id)
        liabilities = Liability.query.filter(Liability.owner1_id == client_id)
    else:
        investments = Investment.query.filter(Investment.owner2_id == client_id)
        otherassets = OtherAsset.query.filter(OtherAsset.owner2_id == client_id)
        properties = Property.query.filter(Property.owner2_id == client_id)
        liabilities = Liability.query.filter(Liability.owner2_id == client_id)

    
    report = render_template("./client-summary.html", 
        client=client, investments=investments, otherassets=otherassets, properties=properties, liabilities=liabilities)
    pdf = pdfkit.from_string(report, False)

    filename = str(client.forename + " " + client.surname + " (" + str(client.id) + ") - Client Summary.pdf")

    response = make_response(pdf)
    response.headers["Content-Type"] = 'application/pdf'
    response.headers["Content-Disposition"] = 'attachment; filename=' + filename
    response.headers["Content-Orientation"] = 'portrait'

    return response