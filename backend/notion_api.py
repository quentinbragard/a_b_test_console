from turtle import update
import requests
import json

NOTION_API_TOKEN = "secret_IskDjgYgHwv79VyeVoFjAAuYKty01Am39uF8gj0YNRU"
NOTION_DATABASES = {'internal': 'What’s Next', 'external - activation calendar': 'GROWTH - Feature/Experiment - Experiment Calendar',
                    'external - experiment list': 'Growth - Feature/Experiment List - Master'}


class notionApi():

    def __init__(self):
        self.api_token = NOTION_API_TOKEN
        self.url = 'https://api.notion.com/v1/'
        self.databases = NOTION_DATABASES

    def get_database_id(self, database_name):
        headers = {
            'Authorization': f'Bearer {NOTION_API_TOKEN}',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
        }

        data = '{"query":"' + database_name + '"}'
        res = requests.post(
            'https://api.notion.com/v1/search', headers=headers, data=data)
        all_results = res.json()['results']
        for page_or_db in all_results:
            if page_or_db['object'] == 'database':
                if page_or_db['title'][0]['text']['content'] == database_name:
                    return(page_or_db['id'])

    def get_page_query(self, page_key_value, type):
        print(f"On a type = {type}")
        if type == "experiment":
            page_query = '{"filter":{"property": "Experiment Track","text": {"equals": "' + page_key_value + '"}}}'
        elif type == "activation":
            page_query = '{"filter":{"property": "Activation ID","number": {"equals": ' + \
                str(page_key_value) + '}}}'
        return(page_query)

    def get_page_in_db_id(self, database_name, page_key_value, type):
        database_id = self.get_database_id(database_name)
        headers = {
            'Authorization': f'Bearer {NOTION_API_TOKEN}',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
        }
        page_query = self.get_page_query(page_key_value, type)
        res = requests.post(
            f'https://api.notion.com/v1/databases/{database_id}/query', headers=headers, data=page_query)
        all_results = res.json()
        return(all_results['results'][0]['id'])

    def create_props_dict(self, property, experiment_info):
        if property == 'experiment_name':
            return(
                {
                    "notion_property_name": "Name",
                    "notion_property_dict": {
                        "title": [
                            {
                                "text": {
                                    "content": experiment_info[property]
                                }
                            }
                        ]
                    }
                }
            )
        if property == 'experiment_track':
            return(
                {
                    "notion_property_name": "Experiment Track",
                    "notion_property_dict": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": experiment_info[property]
                                }
                            }
                        ]
                    }
                }
            )
        if property == 'status':
            return(
                {
                    "notion_property_name": "Status",
                    "notion_property_dict": {
                        "select": {
                            "name": experiment_info[property]
                        }
                    }
                }
            )
        if property == 'step':
            return(
                {
                    "notion_property_name": "Step",
                    "notion_property_dict": {
                        "select": {
                            "name": experiment_info[property]
                        }
                    }
                }
            )
        if property == 'experiment_description':
            return(
                {
                    "notion_property_name": "Description",
                    "notion_property_dict": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": experiment_info[property]
                                }
                            }
                        ]
                    }
                }
            )
        if property == 'activation_id':
            return(
                {
                    "notion_property_name": "Activation ID",
                    "notion_property_dict": {
                        "number": int(experiment_info[property])
                    }
                }
            )
        if property == 'platform':
            return(
                {
                    "notion_property_name": "Platform",
                    "notion_property_dict": {
                        "select": {
                            "name": experiment_info[property]
                        }
                    }
                }
            )
        if property == 'start_date':
            return(
                {
                    "notion_property_name": "Activation Date",
                    "notion_property_dict": {
                        "date": {
                            "start": experiment_info['start_date'],
                            "end": experiment_info['end_date']
                        }
                    }
                }
            )
        if property == 'version':
            return(
                {
                    "notion_property_name": "Version",
                    "notion_property_dict": {
                        "select": {
                            "name": experiment_info[property]
                        }
                    }
                }
            )

    def convert_experiment_info_into_notion_properties(self, experiment_info, type):
        if type == "experiment":
            properties = {
                self.create_props_dict('experiment_name', experiment_info)['notion_property_name']: self.create_props_dict('experiment_name', experiment_info)['notion_property_dict'],
                self.create_props_dict('experiment_track', experiment_info)['notion_property_name']: self.create_props_dict('experiment_track', experiment_info)['notion_property_dict'],
                self.create_props_dict('experiment_description', experiment_info)['notion_property_name']: self.create_props_dict('experiment_description', experiment_info)['notion_property_dict'],
                self.create_props_dict('status', experiment_info)['notion_property_name']: self.create_props_dict('status', experiment_info)['notion_property_dict'],
                self.create_props_dict('step', experiment_info)['notion_property_name']: self.create_props_dict('step', experiment_info)['notion_property_dict'],
            }
            print(properties)
        elif type == "activation":
            properties = {
                self.create_props_dict('experiment_name', experiment_info)['notion_property_name']: self.create_props_dict('experiment_name', experiment_info)['notion_property_dict'],
                self.create_props_dict('activation_id', experiment_info)['notion_property_name']: self.create_props_dict('activation_id', experiment_info)['notion_property_dict'],
                self.create_props_dict('platform', experiment_info)['notion_property_name']: self.create_props_dict('platform', experiment_info)['notion_property_dict'],
                self.create_props_dict('start_date', experiment_info)['notion_property_name']: self.create_props_dict('start_date', experiment_info)['notion_property_dict'],
                self.create_props_dict('version', experiment_info)['notion_property_name']: self.create_props_dict('version', experiment_info)['notion_property_dict'],
                self.create_props_dict('step', experiment_info)['notion_property_name']: self.create_props_dict('step', experiment_info)['notion_property_dict'],
                self.create_props_dict('status', experiment_info)['notion_property_name']: self.create_props_dict(
                    'status', experiment_info)['notion_property_dict']
            }
            properties["Experiment Link"] = {
                "relation": [
                    {
                        "id": self.get_page_in_db_id(self.databases['external - experiment list'], experiment_info['experiment_track'], 'experiment')
                    }
                ]
            }
        return(properties)

    def create_page_in_db(self, database_name, experiment_info, type):
        properties = self.convert_experiment_info_into_notion_properties(
            experiment_info, type)
        database_id = self.get_database_id(database_name)
        headers = {
            'Authorization': f'Bearer {NOTION_API_TOKEN}',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
        }
        database_parent = {"database_id": database_id}
        data_json = {
            "parent": database_parent,
            "properties": properties
        }
        res = requests.post(
            f'https://api.notion.com/v1/pages', headers=headers, json=data_json)
        print(res.text)
        all_results = res.json()
        return(all_results['url'])

    def delete_page_in_db(self, database_name, page_key_value, type):
        page_id = self.get_page_in_db_id(
            database_name, page_key_value, type)
        headers = {
            'Authorization': f'Bearer {NOTION_API_TOKEN}',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
        }
        data = '{"archived": true}'
        print(data)
        res = requests.patch(
            f'https://api.notion.com/v1/pages/{page_id}', headers=headers, data=data)
        print(res)
        print(res.text)
        all_results = res.json()
        return (all_results)

    def update_page_in_db(self, database_name, experiment_info, page_key_value, type):
        page_id = self.get_page_in_db_id(
            database_name, page_key_value, type)
        headers = {
            'Authorization': f'Bearer {NOTION_API_TOKEN}',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
        }
        for key in experiment_info.keys():
            if key != 'experiment_track':
                key_to_update = key
        props_dict = self.create_props_dict(
            key_to_update, experiment_info)
        data = json.dumps({'properties': {
            props_dict['notion_property_name']: props_dict['notion_property_dict']}})
        print(data)
        res = requests.patch(
            f'https://api.notion.com/v1/pages/{page_id}', headers=headers, data=data)
        print(res)
        print(res.text)
        all_results = res.json()
        return (all_results)


"""
if __name__ == "__main__":
    notion = notionApi()
    experiment_info = {'experiment_track': 'Track1Exp1Var1', 'activation_number': '9', 'platform': 'Android', 'version': '4.56.0',
                       'start_date': '2022-02-10', 'end_date': '2022-02-19', 'included_countries': '', 'excluded_countries': '', 'experiment_name': 'Experiment 1'}
    print(notion.create_page_in_db(
        notion.databases['external - activation calendar'], experiment_info, "activation"))
"""


"""
Creer une fonction qui donne exactement la facon de formater le call API vers Notion selon le type
Mettre tous les status en minuscule
Creer nouveau status pour les experiments déjà testées et revoir l'organisation des status
gerer le refresh des pages
faire le set up sur BQ Zenly
Connecter significant results
revoir chaque experiment card selon son statut
Remettre un peu de business logic apres un gros code clean
Modifier fonction calcul remaining days

"""
