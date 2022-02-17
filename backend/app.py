from platform import platform
from google.cloud import bigquery
from notion_api import notionApi
import flask
import json
import ast
from flask_cors import CORS

app = flask.Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app)
EXPERIMENTS_TABLE_NAME = 'ab-test-monitoring-console.experiments_data.experiments'
ACTIVATIONS_TABLE_NAME = 'ab-test-monitoring-console.experiments_data.activations'
EXPERIMENTS_TABLE_COLUMNS = '(experiment_id,experiment_track,experiment_name,experiment_description,status,step,planned_version,is_on_iOS,is_on_Android,experiment_notion_link,specs_link,monitoring_dashboard_link,metrics_dashboard_link,number_of_activation)'
ACTIVATION_TABLE_COLUMNS = '(experiment_track,activation_id,platform,version,start_date,end_date,included_countries,excluded_countries,status,step,activation_link)'


def create_values_string(experiment_info):
    values_to_insert = '('
    for key in experiment_info:
        if key != 'experiment_name':
            if experiment_info[key] == '':
                values_to_insert += 'null,'
            elif key in ['included_countries', 'excluded_countries']:
                values_to_insert = values_to_insert + \
                    '[' + experiment_info[key] + '],'
            elif key in ['activation_id', 'number_of_activtion']:
                values_to_insert = values_to_insert + \
                    str(experiment_info[key]) + ','
            else:
                values_to_insert = values_to_insert + \
                    "'" + experiment_info[key] + "'" + ','

    values_to_insert = values_to_insert[:-1] + ')'
    return(values_to_insert)


def add_platform_update_query_string(experiment_track, platform):
    if platform != "Both":
        if platform == "iOS":
            other_platform = "is_on_Android"
            updated_value_info = {'info': "is_on_iOS",
                                  'value': "true"}
        elif platform == "Android":
            other_platform = "is_on_iOS"
            updated_value_info = {'info': "is_on_Android",
                                  'value': "true"}
        insert_query = f"""
        SET {updated_value_info['info']} = {updated_value_info['value']}, {other_platform} = false
        """
    else:
        insert_query = f"""SET is_on_iOS = true, is_on_Android = true
        """
    return(insert_query)


def find_matching_status(step):
    if step in ['selected', 'in design', 'implementing', 'ready for QA', 'ready for release']:
        return('upcoming')
    elif step == 'released':
        return('ready')
    elif step == 'running':
        return('running')
    return('passed')


def create_update_insert_query_string(experiment_track_or_activation_id, experiment_info):
    if 'experiment_track' in experiment_info.keys():
        insert_query = "UPDATE `ab-test-monitoring-console.experiments_data.experiments`"
    else:
        insert_query = "UPDATE `ab-test-monitoring-console.experiments_data.activations`"
    if 'platform' in experiment_info.keys():
        insert_query += add_platform_update_query_string(
            experiment_track_or_activation_id, experiment_info['platform'])
    elif 'step' in experiment_info.keys():
        matching_status = find_matching_status(experiment_info['step'])
        insert_query += f"""
                         SET step = "{experiment_info['step']}", status="{matching_status}"
                """
    else:
        for key in experiment_info:
            if key not in ['experiment_track', 'activation_id']:
                updated_value_info = {'info': key,
                                      'value': experiment_info[key]}
                insert_query += f"""
                    SET {updated_value_info['info']} = "{updated_value_info['value']}"
                    """
    if 'experiment_track' in experiment_info.keys():
        insert_query += f'WHERE experiment_track = "{experiment_track_or_activation_id}"'
    else:
        insert_query += f'WHERE activation_id = {experiment_track_or_activation_id}'
    return(insert_query)


@ app.route('/', methods=['GET'])
def home():
    return '''<h1>Welcome in the Experiment Console Backend ;) </h1>'''


@ app.route('/api/v0/resources/experiments/all', methods=['GET'])
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


@app.route("/api/v0/experiment/add", methods=["POST"], strict_slashes=False)
def add_experiment():
    client = bigquery.Client()
    notion = notionApi()
    experiment_info = ast.literal_eval(flask.request.data.decode('utf-8'))
    experiment_info['step'] = 'selected'
    experiment_info['status'] = 'upcoming'
    experiment_id = f'{experiment_info["experiment_track"]}_Act00'
    new_page_url = notion.create_page_in_db(
        notion.databases['external - experiment list'], experiment_info, 'experiment')
    experiment_info['experiment_id'] = experiment_id
    values_to_insert = f'("{experiment_info["experiment_id"]}", "{experiment_info["experiment_track"]}","{experiment_info["experiment_name"]}","{experiment_info["experiment_description"]}","upcoming","selected",null,false,false,"{new_page_url}",null,null,null,0)'
    insert_query = f"""
                INSERT INTO `ab-test-monitoring-console.experiments_data.experiments` {EXPERIMENTS_TABLE_COLUMNS}
                VALUES
                {values_to_insert}
            """
    client.query(insert_query)
    return new_page_url, 201


@app.route("/api/v0/experiment/delete", methods=["POST"], strict_slashes=False)
def delete_experiment():
    client = bigquery.Client()
    notion = notionApi()
    experiment_track = flask.request.data.decode('utf-8')
    insert_query = f"""
                DELETE `ab-test-monitoring-console.experiments_data.experiments`
                WHERE experiment_track = "{experiment_track}"
            """
    client.query(insert_query)
    notion.delete_page_in_db(
        notion.databases['external - experiment list'], experiment_track, 'experiment')
    return 'done', 201


@app.route("/api/v0/experiment/update", methods=["POST"], strict_slashes=False)
def update_experiment():
    experiment_info = json.loads(flask.request.data.decode('utf-8'))
    client = bigquery.Client()
    notion = notionApi()
    experiment_track = experiment_info['experiment_track']
    update_insert_query = create_update_insert_query_string(
        experiment_track,
        experiment_info)
    client.query(update_insert_query)
    notion.update_page_in_db(
        notion.databases['external - experiment list'], experiment_info, experiment_track, 'experiment')
    return 'done', 201


@app.route("/api/v0/activation/add", methods=["POST"], strict_slashes=False)
def activate_experiment():
    client = bigquery.Client()
    notion = notionApi()
    experiment_info = ast.literal_eval(flask.request.data.decode('utf-8'))
    print(experiment_info)
    experiment_info['step'] = 'running'
    experiment_info['status'] = 'running'
    related_experiment_results = client.query(
        f"SELECT * FROM `ab-test-monitoring-console.experiments_data.experiments` WHERE experiment_track =  '{experiment_info['experiment_track']}'").result().to_dataframe()
    experiment_name = related_experiment_results['experiment_name'][0]
    number_of_activation = related_experiment_results['number_of_activation'][0]
    experiment_info['experiment_name'] = experiment_name
    number_of_activation = str(
        int(number_of_activation) + 1)
    new_page_url = notion.create_page_in_db(
        notion.databases['external - activation calendar'], experiment_info, 'activation')
    experiment_info['activation_link'] = new_page_url
    values_to_insert = create_values_string(experiment_info)
    insert_activation_query = f"""
                INSERT INTO `ab-test-monitoring-console.experiments_data.activations` {ACTIVATION_TABLE_COLUMNS}
                VALUES
                {values_to_insert}
            """
    print(insert_activation_query)
    client.query(insert_activation_query)
    client.query(f"""
                    UPDATE `ab-test-monitoring-console.experiments_data.experiments`
                         SET number_of_activation = {number_of_activation}, step = "tested"
                        WHERE experiment_track = "{experiment_info['experiment_track']}"
                """)
    notion.update_page_in_db(
        notion.databases['external - experiment list'], {'experiment_track': experiment_info['experiment_track'], 'step': 'tested'}, experiment_info['experiment_track'], 'experiment')
    return new_page_url, 201


@app.route("/api/v0/activation/delete", methods=["POST"], strict_slashes=False)
def delete_activation():
    client = bigquery.Client()
    notion = notionApi()
    activation_info = ast.literal_eval(flask.request.data.decode('utf-8'))
    print(activation_info['activation_id'])
    insert_query = f"""
                DELETE `ab-test-monitoring-console.experiments_data.activations`
                WHERE activation_id = {activation_info['activation_id']}
            """
    client.query(insert_query)
    related_experiment_results = client.query(
        f"SELECT * FROM `ab-test-monitoring-console.experiments_data.experiments` WHERE experiment_track =  '{activation_info['experiment_track']}'").result().to_dataframe()
    print(related_experiment_results)
    number_of_activation = str(
        int(related_experiment_results['number_of_activation'][0]) - 1)
    client.query(f"""
                    UPDATE `ab-test-monitoring-console.experiments_data.experiments`
                         SET number_of_activation = {number_of_activation}
                        WHERE experiment_track = "{activation_info['experiment_track']}"
                """)
    notion.delete_page_in_db(
        notion.databases['external - activation calendar'], activation_info['activation_id'], 'activation')
    return 'done', 201


@app.route("/api/v0/activation/update", methods=["POST"], strict_slashes=False)
def update_activation():
    experiment_info = json.loads(flask.request.data.decode('utf-8'))
    print(experiment_info)
    client = bigquery.Client()
    notion = notionApi()
    activation_id = experiment_info['activation_id']
    update_insert_query = create_update_insert_query_string(
        activation_id,
        experiment_info)
    print(update_insert_query)
    client.query(update_insert_query)
    notion.update_page_in_db(
        notion.databases['external - activation calendar'], experiment_info, activation_id, 'activation')
    return 'done', 201


app.run()
