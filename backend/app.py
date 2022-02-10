from google.cloud import bigquery
from notion_api import notionApi
import flask
import ast
from flask_cors import CORS

app = flask.Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app)

EXPERIMENT_INFO_COLUMNS = '(experiment_name,experiment_track,platform,start_date,end_date,version,included_countries,excluded_countries,status)'


@app.route('/', methods=['GET'])
def home():
    return '''<h1>Walcome in the Experiment Console Backend ;) </h1>'''


@app.route('/api/v0/resources/experiments/all', methods=['GET'])
def api_all():
    client = bigquery.Client()
    retreive_experiments_info_query = client.query(
        "SELECT * FROM `ab-test-monitoring-console.experiments_data.experiments_information`")
    expriments_info = retreive_experiments_info_query.result().to_dataframe()
    response = []
    for experiment in expriments_info:
        response.append(experiment)
    return flask.Response(expriments_info.to_json(orient="records"), mimetype='application/json')


@app.route('/api/v0/resources/experiments/', methods=['GET'])
def api_passed_experiments():
    status = flask.request.args.get('status')
    client = bigquery.Client()
    retreive_experiments_info_query = client.query(
        f"SELECT * FROM `ab-test-monitoring-console.experiments_data.experiments_information` WHERE status LIKE '{status.capitalize()} Experiment%'")
    expriments_info = retreive_experiments_info_query.result().to_dataframe()
    response = []
    for experiment in expriments_info:
        response.append(experiment)
    return flask.Response(expriments_info.to_json(orient="records"), mimetype='application/json')


@app.route("/api/v0/add/experiment/", methods=["POST"], strict_slashes=False)
def add_experiment():
    client = bigquery.Client()
    notion = notionApi()
    experiment_info = ast.literal_eval(flask.request.data.decode('utf-8'))
    values_to_insert = '('
    for key in experiment_info:
        print(key)
        if experiment_info[key] == '':
            values_to_insert += 'null,'
        elif key not in ['included_countries', 'excluded_countries']:
            values_to_insert = values_to_insert + \
                "'" + experiment_info[key] + "'" + ','
        else:
            values_to_insert = values_to_insert + \
                '[' + experiment_info[key] + '],'
    values_to_insert = values_to_insert[:-1] + ')'
    insert_query = f"""
                INSERT INTO `ab-test-monitoring-console.experiments_data.experiments_information` {EXPERIMENT_INFO_COLUMNS}
                VALUES
                {values_to_insert}
            """
    client.query(insert_query)
    print(insert_query)
    print(experiment_info)
    new_page_url = notion.create_page_in_db(
        notion.databases['external - experiment list'], experiment_info)
    print(new_page_url)
    return new_page_url, 201


app.run()
