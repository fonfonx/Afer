import hug
import requests


def cors_support(response, *args, **kwargs):
    """ Enable CORS """
    response.set_header('Access-Control-Allow-Origin', '*')


@hug.get('/fund', requires=cors_support)
def getFund(code: hug.types.text):
    """ Get csv file corresponding to the fund requested """
    url = 'https://www.afer.asso.fr/amcharts/' + code + '_data.csv'
    req = requests.get(url)
    response = req.content
    return response
