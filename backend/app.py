from google.cloud import bigquery
from notion_api import notionApi
import flask
import ast
from flask_cors import CORS

app = flask.Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app)
EXPERIMENTS_TABLE_NAME = 'ab-test-monitoring-console.experiments_data.experiments'
ACTIVATIONS_TABLE_NAME = 'ab-test-monitoring-console.experiments_data.activations'
EXPERIMENTS_TABLE_COLUMNS = '(experiment_track,experiment_name,status,step,specs_link)'
ACTIVATION_TABLE_COLUMNS = '(experiment_track,experiment_activation,platform,version,start_date,end_date,included_countries,excluded_countries,status,step,activation_link)'


def create_values_string(experiment_info):
    values_to_insert = '('
    for key in experiment_info:
        if key != 'experiment_name':
            if experiment_info[key] == '':
                values_to_insert += 'null,'
            elif key not in ['included_countries', 'excluded_countries', 'activation_number']:
                values_to_insert = values_to_insert + \
                    "'" + experiment_info[key] + "'" + ','
            elif key == 'activation_number':
                values_to_insert = values_to_insert + \
                    experiment_info[key] + ','
            else:
                values_to_insert = values_to_insert + \
                    '[' + experiment_info[key] + '],'
    values_to_insert = values_to_insert[:-1] + ')'
    return(values_to_insert)


@app.route('/', methods=['GET'])
def home():
    return '''<h1>Walcome in the Experiment Console Backend ;) </h1>'''


@app.route('/api/v0/resources/experiments/all', methods=['GET'])
def api_all():
    client = bigquery.Client()
    retreive_experiments_info_query = client.query(
        "SELECT * FROM `ab-test-monitoring-console.experiments_data.experiments`")
    expriments_info = retreive_experiments_info_query.result().to_dataframe()
    response = []
    for experiment in expriments_info:
        response.append(experiment)
    return flask.Response(expriments_info.to_json(orient="records"), mimetype='application/json')


@app.route('/api/v0/resources/experiments/', methods=['GET'])
def api_passed_experiments():
    status = flask.request.args.get('status')
    client = bigquery.Client()
    if status in ['upcoming', 'ready']:
        retreive_experiments_info_query = client.query(
            f"SELECT * FROM `{EXPERIMENTS_TABLE_NAME}` WHERE status = '{status}'")
    elif status in ['running', 'passed']:
        retreive_experiments_info_query = client.query(
            f"SELECT * FROM `{ACTIVATIONS_TABLE_NAME}` a JOIN `{EXPERIMENTS_TABLE_NAME}` e ON  a.experiment_track = e.experiment_track WHERE a.status = '{status}'")
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
    values_to_insert = f'("{experiment_info["experiment_track"]}","{experiment_info["experiment_name"]}","upcoming","selected",null)'
    insert_query = f"""
                INSERT INTO `ab-test-monitoring-console.experiments_data.experiments` {EXPERIMENTS_TABLE_COLUMNS}
                VALUES
                {values_to_insert}
            """
    client.query(insert_query)
    new_page_url = notion.create_page_in_db(
        notion.databases['external - experiment list'], experiment_info, 'experiment')
    return new_page_url, 201


@app.route("/api/v0/activate/experiment/", methods=["POST"], strict_slashes=False)
def activate_experiment():
    client = bigquery.Client()
    notion = notionApi()
    experiment_info = ast.literal_eval(flask.request.data.decode('utf-8'))
    experiment_name = client.query(
        f"SELECT DISTINCT(experiment_name) FROM `ab-test-monitoring-console.experiments_data.experiments` WHERE experiment_track =  '{experiment_info['experiment_track']}'").result().to_dataframe()['experiment_name'][0]
    experiment_info['experiment_name'] = experiment_name
    new_page_url = notion.create_page_in_db(
        notion.databases['external - activation calendar'], experiment_info, 'activation')
    experiment_info['status'] = 'running'
    experiment_info['step'] = 'running'
    experiment_info['activation_link'] = new_page_url
    values_to_insert = create_values_string(experiment_info)
    insert_query = f"""
                INSERT INTO `ab-test-monitoring-console.experiments_data.activations` {ACTIVATION_TABLE_COLUMNS}
                VALUES
                {values_to_insert}
            """
    client.query(insert_query)
    return new_page_url, 201


app.run()
