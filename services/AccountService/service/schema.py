import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from graphene_federation import LATEST_VERSION, build_schema, key
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import create_refresh_token, get_token

from .models import User


@key("id")
class UserType(DjangoObjectType):
    class Meta:
        model = User
        exclude = ['password', 'first_name', 'last_name']


class CreateUser(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String()
    user = graphene.Field(UserType)
    token = graphene.String()
    refresh_token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, email, password):
        if User.objects.filter(username=username).exists():
            return CreateUser(success=False, message='An account with that username already exists.')

        if User.objects.filter(email=email).exists():
            return CreateUser(success=False, message='An account with that email already exists.')

        user = User(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()

        token = get_token(user)
        refresh_token = create_refresh_token(user)

        return CreateUser(success=True, message='Account created.', user=user, token=token, refresh_token=refresh_token)


class UpdatePassword(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String()

    class Arguments:
        current_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    @login_required
    def mutate(self, info, current_password, new_password):
        user = info.context.user

        if not user.check_password(current_password):
            return UpdatePassword(success=False, message="Current password is incorrect.")

        user.set_password(new_password)
        user.save()

        return UpdatePassword(success=True, message="Account password has been updated.")


class UpdateEmail(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String()

    class Arguments:
        new_email = graphene.String(required=True)

    @login_required
    def mutate(self, info, new_email):
        user = info.context.user

        if User.objects.filter(email=new_email).exists():
            return UpdateEmail(success=True, message="An account with that email already exists.")

        user.email = new_email
        user.save()

        return UpdateEmail(success=True, message="Account email has been updated.")


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
    update_email = UpdateEmail.Field()
    update_password = UpdatePassword.Field()
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = build_schema(query=Query, mutation=Mutation,
                      federation_version=LATEST_VERSION)
