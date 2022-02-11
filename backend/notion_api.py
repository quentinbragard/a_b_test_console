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

    def get_page_in_db_id(self, database_name, experiment_track):
        database_id = self.get_database_id(database_name)
        headers = {
            'Authorization': f'Bearer {NOTION_API_TOKEN}',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
        }
        data = '{"filter":{"property": "Experiment Track","text": {"equals": "' + experiment_track + '"}}}'
        res = requests.post(
            f'https://api.notion.com/v1/databases/{database_id}/query', headers=headers, data=data)
        all_results = res.json()
        return(all_results['results'][0]['id'])

    def convert_experiment_info_into_notion_properties(self, experiment_info, type):
        if type == "experiment":
            properties = {
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": experiment_info['experiment_name']
                            }
                        }
                    ]
                },
                "Experiment Track": {
                    "rich_text": [
                        {
                            "text": {
                                "content": experiment_info['experiment_track']
                            }
                        }
                    ]
                }
            }
        elif type == "activation":
            properties = {
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": experiment_info['experiment_name']
                            }
                        }
                    ]
                },
                "Experiment Link": {
                    "relation": [
                        {
                            "id": self.get_page_in_db_id(self.databases['external - experiment list'], experiment_info['experiment_track'])
                        }
                    ]
                },
                "Activation ID": {
                    "number": int(experiment_info['activation_number'])
                },
                "Platform": {
                    "select": {
                        "name": experiment_info['platform']
                    }
                },
                "Activation Date": {
                    "date": {
                        "start": experiment_info['start_date'],
                        "end": experiment_info['end_date']
                    }
                },
                "Version": {
                    "select": {
                        "name": experiment_info['version']
                    }
                },
                "Status": {
                    "select": {
                        "name": "Running Experiment"
                    }
                }
            }
        return(properties)

    def create_page_in_db(self, database_name, experiment_info, type):
        properties = self.convert_experiment_info_into_notion_properties(
            experiment_info, type)
        print("=======================")
        print(properties)
        print(type)
        database_id = self.get_database_id(database_name)
        print(database_id)
        headers = {
            'Authorization': f'Bearer {NOTION_API_TOKEN}',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
        }
        database_parent = {"database_id": database_id}
        print(database_parent)
        data_json = {
            "parent": database_parent,
            "properties": properties
        }
        print(data_json)
        res = requests.post(
            f'https://api.notion.com/v1/pages', headers=headers, json=data_json)
        print(res)
        print(res.text)
        all_results = res.json()
        return(all_results['url'])


"""
if __name__ == "__main__":
    notion = notionApi()
    experiment_info = {'experiment_track': 'Track1Exp1Var1', 'activation_number': '9', 'platform': 'Android', 'version': '4.56.0',
                       'start_date': '2022-02-10', 'end_date': '2022-02-19', 'included_countries': '', 'excluded_countries': '', 'experiment_name': 'Experiment 1'}
    print(notion.create_page_in_db(
        notion.databases['external - activation calendar'], experiment_info, "activation"))
"""
