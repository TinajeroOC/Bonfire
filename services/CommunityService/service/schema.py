import graphene
from graphene_federation import LATEST_VERSION, build_schema

from core.decorators import login_required


class CreateCommunity(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)

    class Arguments:
        username = graphene.String()

    @login_required
    def mutate(self, info, **kwargs):
        return CreateCommunity(success=True, message="Community created")


class Query(graphene.ObjectType):
    other_viewer = graphene.String()

    @login_required
    def resolve_other_viewer(self, info, **kwargs):
        return info.context.user


class Mutation(graphene.ObjectType):
    create_community = CreateCommunity.Field()


schema = build_schema(query=Query, mutation=Mutation,
                      federation_version=LATEST_VERSION)
