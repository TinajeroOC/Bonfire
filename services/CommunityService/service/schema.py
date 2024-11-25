import graphene
from graphene_django import DjangoObjectType
from graphene_federation import LATEST_VERSION, build_schema
from graphene_file_upload.scalars import Upload
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.db.models import Q
from core.decorators import login_required
from .models import Community
from .graphql.client import get_post_service_server_client
from .graphql.documents import delete_community_posts_document


class CommunityType(DjangoObjectType):
    icon_url = graphene.String()
    banner_url = graphene.String()
    member_count = graphene.Int(required=True)
    is_member = graphene.Boolean(required=True)
    is_owner = graphene.Boolean(required=True)

    def resolve_icon_url(self, info):
        if self.icon:
            return info.context.build_absolute_uri(self.icon.url)
        return None

    def resolve_banner_url(self, info):
        if self.banner:
            return info.context.build_absolute_uri(self.banner.url)
        return None

    def resolve_member_count(self, info):
        return self.member_count()

    def resolve_is_member(self, info):
        if info.context.user is not None:
            return self.is_member(info.context.user['id'])
        return False

    def resolve_is_owner(self, info):
        if info.context.user is not None:
            return self.is_owner(info.context.user['id'])
        return False

    class Meta:
        model = Community


class CreateCommunity(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    community = graphene.Field(CommunityType)

    class Arguments:
        name = graphene.String(required=True)
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        is_public = graphene.Boolean(default_value=True)
        icon = Upload()
        banner = Upload()

    @login_required
    def mutate(self, info, name, title, description, is_public, icon=None, banner=None):
        allowed_mimetypes = ['image/jpg', 'image/jpeg', 'image/png']

        try:
            community = Community.objects.create(
                name=name,
                title=title,
                description=description,
                is_public=is_public,
                owner_id=info.context.user['id']
            )

            if icon:
                if not icon['file']['mimetype'] in allowed_mimetypes:
                    return CreateCommunity(
                        success=False,
                        message="Community icon must be a PNG or JPEG file"
                    )
                if community.icon:
                    try:
                        community.icon.delete(save=False)
                    except Exception as e:
                        print(f"Error deleting old icon: {str(e)}")
                community.icon = icon['promise']

            if banner:
                if not banner['file']['mimetype'] in allowed_mimetypes:
                    return CreateCommunity(
                        success=False,
                        message="Community banner must be a PNG or JPEG file"
                    )
                if community.banner:
                    try:
                        community.banner.delete(save=False)
                    except Exception as e:
                        print(f"Error deleting old banner: {str(e)}")
                community.banner = banner['promise']

            community.add_member(info.context.user['id'])

            community.save()

            return CreateCommunity(
                success=True,
                message="Community created successfully",
                community=community
            )
        except IntegrityError:
            return CreateCommunity(
                success=False,
                message="A community with this name already exists",
                community=None
            )
        except ValidationError as e:
            return CreateCommunity(
                success=False,
                message=str(e),
                community=None
            )


class UpdateCommunity(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    community = graphene.Field(CommunityType)

    class Arguments:
        community_id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        is_public = graphene.Boolean()
        icon = Upload()
        banner = Upload()
        remove_icon = graphene.Boolean(default_value=False)
        remove_banner = graphene.Boolean(default_value=False)

    @login_required
    def mutate(self, info, community_id, title=None, description=None,
               is_public=None, icon=None, banner=None, remove_icon=False, remove_banner=False):
        allowed_mimetypes = ['image/jpg', 'image/jpeg', 'image/png']

        try:
            community = Community.objects.get(id=community_id)

            if community.owner_id != info.context.user['id']:
                return UpdateCommunity(
                    success=False,
                    message="Only the community owner can update the community",
                    community=None
                )

            if title is not None:
                community.title = title

            if description is not None:
                community.description = description

            if is_public is not None:
                community.is_public = is_public

            if remove_icon:
                community.icon.delete(save=False)
                community.icon = None
            elif icon:
                if not icon['file']['mimetype'] in allowed_mimetypes:
                    return CreateCommunity(
                        success=False,
                        message="Community icon must be a PNG or JPEG file"
                    )
                if community.icon:
                    try:
                        community.icon.delete(save=False)
                    except Exception as e:
                        print(f"Error deleting old icon: {str(e)}")
                community.icon = icon['promise']

            if remove_banner:
                community.banner.delete(save=False)
                community.banner = None
            elif banner:
                if not banner['file']['mimetype'] in allowed_mimetypes:
                    return CreateCommunity(
                        success=False,
                        message="Community banner must be a PNG or JPEG file"
                    )
                if community.banner:
                    try:
                        community.banner.delete(save=False)
                    except Exception as e:
                        print(f"Error deleting old banner: {str(e)}")
                community.banner = banner['promise']

            community.save()

            return UpdateCommunity(
                success=True,
                message="Community updated successfully",
                community=community
            )

        except Community.DoesNotExist:
            return UpdateCommunity(
                success=False,
                message="Community not found",
                community=None
            )
        except ValidationError as e:
            return UpdateCommunity(
                success=False,
                message=str(e),
                community=None
            )


class JoinCommunity(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)

    class Arguments:
        community_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, community_id):
        try:
            community = Community.objects.get(id=community_id)

            if not community.is_public:
                return JoinCommunity(
                    success=False,
                    message="This community is private"
                )

            if community.is_member(info.context.user['id']):
                return JoinCommunity(
                    success=False,
                    message="You are already a member of this community"
                )

            community.add_member(info.context.user['id'])

            return JoinCommunity(
                success=True,
                message="Successfully joined the community"
            )
        except Community.DoesNotExist:
            return JoinCommunity(
                success=False,
                message="Community not found"
            )


class LeaveCommunity(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)

    class Arguments:
        community_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, community_id):
        try:
            community = Community.objects.get(id=community_id)

            if not community.is_member(info.context.user['id']):
                return LeaveCommunity(
                    success=False,
                    message="You are not a member of this community"
                )

            if community.is_owner(info.context.user['id']):
                return LeaveCommunity(
                    success=False,
                    message="Community owner cannot leave the community"
                )

            community.remove_member(info.context.user['id'])

            return LeaveCommunity(
                success=True,
                message="Successfully left the community"
            )
        except Community.DoesNotExist:
            return LeaveCommunity(
                success=False,
                message="Community not found"
            )


class DeleteCommunity(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)

    class Arguments:
        community_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, community_id):
        try:
            community = Community.objects.get(id=community_id)

            if not community.is_owner(info.context.user['id']):
                return DeleteCommunity(
                    success=False,
                    message="Only the community owner can delete the community"
                )

            delete_posts_data = get_post_service_server_client().execute(delete_community_posts_document, {
                "communityId": community_id
            })

            if not delete_posts_data['deletePosts']['success']:
                return DeleteCommunity(
                    success=False,
                    message="Unable to delete community posts"
                )

            if community.icon:
                community.icon.delete(save=False)
            if community.banner:
                community.banner.delete(save=False)

            community.delete()

            return DeleteCommunity(
                success=True,
                message="Community deleted successfully"
            )

        except Community.DoesNotExist:
            return DeleteCommunity(
                success=False,
                message="Community not found"
            )
        except Exception as e:
            return DeleteCommunity(
                success=False,
                message=f"Failed to delete community: {str(e)}"
            )


class CommunityMembershipType(graphene.Enum):
    OWNER = "owner"
    MEMBER = "member"
    NON_MEMBER = "non_member"
    ANY = "any"


class CommunityStatus(graphene.Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    ANY = "any"


class CommunitiesResponse(graphene.ObjectType):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    communities = graphene.NonNull(
        graphene.List(graphene.NonNull(CommunityType)))


class CommunityResponse(graphene.ObjectType):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    community = graphene.Field(CommunityType)


class CommunitiesFilter(graphene.InputObjectType):
    name = graphene.String(required=False)
    membership_type = CommunityMembershipType(
        default_value=CommunityMembershipType.ANY)
    community_status = CommunityStatus(default_value=CommunityStatus.ANY)


class Query(graphene.ObjectType):
    community = graphene.Field(
        CommunityResponse,
        id=graphene.ID(required=False),
        name=graphene.String(required=False)
    )
    communities = graphene.Field(
        CommunitiesResponse,
        filter=graphene.Argument(CommunitiesFilter, default_value=None)
    )

    def resolve_community(self, info, id=None, name=None):
        if not id and not name:
            return CommunityResponse(
                success=False,
                message="Either 'id' or 'name' must be provided",
                community=None
            )

        try:
            if id:
                community = Community.objects.get(id=id)
            else:
                community = Community.objects.get(name=name)

            user_id = None
            if info.context.user is not None:
                user_id = info.context.user['id']

            if community.is_public or (user_id and community.is_member(user_id)) or (user_id and community.is_owner(user_id)):
                return CommunityResponse(
                    success=True,
                    message="Community retrieved successfully",
                    community=community
                )

            return CommunityResponse(
                success=False,
                message="You don't have access to this community",
                community=None
            )
        except Community.DoesNotExist:
            return CommunityResponse(
                success=False,
                message="Community not found",
                community=None
            )

    def resolve_communities(self, info, filter=None):
        try:
            queryset = Community.objects.all()

            user_id = None
            if info.context.user is not None:
                user_id = info.context.user['id']

            if filter:
                if filter.name:
                    queryset = queryset.filter(Q(name__icontains=filter.name))

                if filter.community_status == CommunityStatus.PUBLIC:
                    queryset = queryset.filter(is_public=True)
                elif filter.community_status == CommunityStatus.PRIVATE:
                    queryset = queryset.filter(is_public=False)

                if filter.membership_type == CommunityMembershipType.MEMBER and user_id:
                    queryset = queryset.filter(
                        communitymembership__user_id=user_id)
                elif filter.membership_type == CommunityMembershipType.NON_MEMBER and user_id:
                    queryset = queryset.exclude(
                        communitymembership__user_id=user_id)
                elif filter.membership_type == CommunityMembershipType.OWNER and user_id:
                    queryset = queryset.filter(owner_id=user_id)

            return CommunitiesResponse(
                success=True,
                message="Communities retrieved successfully",
                communities=list(queryset)
            )
        except Exception as e:
            return CommunitiesResponse(
                success=False,
                message=f"Failed to retrieve communities: {str(e)}",
                communities=[]
            )


class Mutation(graphene.ObjectType):
    create_community = CreateCommunity.Field()
    update_community = UpdateCommunity.Field()
    delete_community = DeleteCommunity.Field()
    join_community = JoinCommunity.Field()
    leave_community = LeaveCommunity.Field()


schema = build_schema(
    query=Query,
    mutation=Mutation,
    federation_version=LATEST_VERSION
)
