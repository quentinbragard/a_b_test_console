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
        # print(res)
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

    def create_page_in_db(self, database_name, experiment_info):
        # print(experiment_info)
        database_id = self.get_database_id(database_name)
        headers = {
            'Authorization': f'Bearer {NOTION_API_TOKEN}',
            'Notion-Version': '2021-08-16',
            'Content-Type': 'application/json',
        }
        database_parent = {"database_id": database_id}
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
            "Platform": {
                "select": {
                    "name": experiment_info['platform']
                }
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
        data_json = {
            "parent": database_parent,
            "properties": properties
        }
        res = requests.post(
            f'https://api.notion.com/v1/pages', headers=headers, json=data_json)
        all_results = res.json()
        return(all_results['url'])
