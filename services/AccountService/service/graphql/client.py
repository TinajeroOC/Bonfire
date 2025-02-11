import os
from gql import Client
from gql.transport.requests import RequestsHTTPTransport
from dotenv import load_dotenv

load_dotenv()


def get_post_service_client(token=None):
    api_url = os.getenv('POST_SERVICE_API_URL')

    if not api_url:
        raise ValueError(
            "POST_SERVICE_API_URL not set in environment variables")

    headers = {}
    if token:
        headers['Authorization'] = token

    transport = RequestsHTTPTransport(
        url=api_url,
        headers=headers
    )

    return Client(transport=transport, fetch_schema_from_transport=True)


def get_post_service_server_client():
    api_url = os.getenv('POST_SERVICE_API_URL')
    api_server_secret_key = os.getenv('API_SERVER_SECRET_KEY')

    if not api_url:
        raise ValueError(
            "POST_SERVICE_API_URL not set in environment variables")

    if not api_server_secret_key:
        raise ValueError(
            "API_SERVER_SECRET_KEY not set in environment variables")

    headers = {}
    headers['X-Server-Secret'] = api_server_secret_key

    transport = RequestsHTTPTransport(
        url=api_url,
        headers=headers
    )

    return Client(transport=transport, fetch_schema_from_transport=True)
