from functools import wraps
from graphql import GraphQLError


def login_required(func):
    @wraps(func)
    def wrapper(cls, info, *args, **kwargs):
        if info.context.user:
            return func(cls, info, *args, **kwargs)
        raise GraphQLError('Login required')
    return wrapper
