from flask import Blueprint, render_template, make_response, url_for
import pdfkit
from routes.otherassets import get_otherassets
from models import Client, Investment, Property, Liability, OtherAsset
from routes.clients import get_networth
import collections
import seaborn as sns

reports_blueprint = Blueprint('reports_blueprint', __name__)

path_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
config = pdfkit.configuration(wkhtmltopdf=path_wkhtmltopdf)


# def ColourPalette(number_of_datapoints):
#     colour_palette = ["#ffa6ff", "#ff54ff", "#ff00ff", "#ba00ba", "#730073"]

#     colours = []
#     i = 0
#     for i in range(i, number_of_datapoints):
#         if i < len(colour_palette):
#             colours.append(colour_palette[i])
#             i += 1
#         else:
#             colours.append(colour_palette[i-len(colour_palette)])
#             i +=1

#     return colours


def ColourPalette(num_shades):
    colours = sns.hls_palette(num_shades, h=0.4, l=0.4, s=0.8).as_hex()
    return colours

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


    networth_rawdata = get_networth(client_id).get_json()

    data = dict(networth_rawdata)

    networthChartLabels = [item for item in data]
    networthChartColours = ColourPalette(len(data))
    networthChartValues = [data[item] for item in data]

    
    report = render_template("./client-summary.html", 
        client=client, investments=investments, otherassets=otherassets, properties=properties, liabilities=liabilities,
        networthChartLabels=networthChartLabels, networthChartColours=networthChartColours, networthChartValues=networthChartValues)
    pdf = pdfkit.from_string(report, False)

    filename = str(client.forename + " " + client.surname + " (" + str(client.id) + ") - Client Summary.pdf")

    response = make_response(pdf)
    response.headers["Content-Type"] = 'application/pdf'
    response.headers["Content-Disposition"] = 'inline; filename=' + filename
    response.headers["Content-Orientation"] = 'portrait'

    return response


@reports_blueprint.route("/asset-chart/<client_id>")
def asset_chart(client_id):
    rawdata = get_otherassets(client_id).get_json()

    assets_by_type = collections.Counter()
    for d in rawdata:
        assets_by_type[d['asset_type']] += int(float(d['value']))

    data = dict(assets_by_type)
    print(data)
    print(type(data))


    labels = [item for item in data]
    colours = ColourPalette(len(data))
    values = [data[item] for item in data]

    return render_template('asset-chart.html', labels=labels, colours=colours, values=values)