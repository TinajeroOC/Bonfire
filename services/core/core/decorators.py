from functools import wraps
import os
from graphql import GraphQLError

api_server_secret_key = os.getenv('API_SERVER_SECRET_KEY')


def login_required(func):
    @wraps(func)
    def wrapper(cls, info, *args, **kwargs):
        if info.context.user:
            return func(cls, info, *args, **kwargs)
        raise GraphQLError('Login required')
    return wrapper


def server_only(func):
    @wraps(func)
    def wrapper(cls, info, *args, **kwargs):
        request_secret_key = info.context.headers.get('X-Server-Secret')

        if request_secret_key == api_server_secret_key:
            return func(cls, info, *args, **kwargs)

        raise GraphQLError('Server only')
    return wrapper
