import graphene
from graphql import GraphQLError
import graphql_jwt
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from graphene_federation import LATEST_VERSION, build_schema, key
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import create_refresh_token, get_token

from .models import User


@key("id")
class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        exclude = ['password']


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
    token = graphene.String()
    refresh_token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, email, password):
        if User.objects.filter(username=username).exists():
            raise GraphQLError('An account with that username already exists.')

        if User.objects.filter(email=email).exists():
            raise GraphQLError('An account with that email already exists.')

        user = get_user_model()(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()

        token = get_token(user)
        refresh_token = create_refresh_token(user)

        return CreateUser(user=user, token=token, refresh_token=refresh_token)


class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    refresh_token = graphene.NonNull(graphene.String)
    user = graphene.NonNull(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user, refresh_token=create_refresh_token(info.context.user))


class Query(graphene.ObjectType):
    viewer = graphene.Field(UserType)

    @login_required
    def resolve_viewer(self, info, **kwargs):
        return info.context.user


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = build_schema(query=Query, mutation=Mutation,
                      federation_version=LATEST_VERSION)
