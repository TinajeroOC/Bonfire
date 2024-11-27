import graphene
from graphene_django import DjangoObjectType
from graphene_federation import LATEST_VERSION, build_schema, extends, key
from core.decorators import login_required, server_only
from .models import Post
from .graphql.documents import community_document, comments_document, delete_post_comments_document
from .graphql.client import get_comment_service_client, get_community_service_client, get_comment_service_server_client


@key("id")
@extends
class UserType(graphene.ObjectType):
    id = graphene.ID(required=True)


@key("id")
@extends
class CommunityType(graphene.ObjectType):
    id = graphene.ID(required=True)


@key("id")
@extends
class CommentType(graphene.ObjectType):
    id = graphene.ID(required=True)


@key("id")
class PostType(DjangoObjectType):
    is_poster = graphene.Boolean()
    user = graphene.Field(UserType)
    community = graphene.Field(CommunityType)
    comments = graphene.List(graphene.NonNull(CommentType))

    def resolve_is_poster(self, info):
        if info.context.user is not None:
            return self.is_poster(info.context.user['id'])
        return False

    def resolve_community(self, info):
        return CommunityType(id=self.community_id)

    def resolve_user(self, info):
        return UserType(id=self.poster_id)

    def resolve_comments(self, info):
        comments_data = get_comment_service_client(token=info.context.headers.get('Authorization')).execute(comments_document, {
            "postId": self.id
        })
        return comments_data["comments"]["comments"]

    def __resolve_reference(self, info, **kwargs):
        return Post.objects.get(id=self.id)

    class Meta:
        model = Post


class CreatePost(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    post = graphene.Field(PostType)

    class Arguments:
        community_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        body = graphene.String()

    @login_required
    def mutate(self, info, community_id, title, body):
        try:
            community_data = get_community_service_client(token=info.context.headers.get('Authorization')).execute(community_document, {
                "id": community_id
            })

            if not community_data["community"]["community"]:
                return CreatePost(success=False, message="Cannot create posts in a nonexistent community")

            if not community_data["community"]["community"]["isPublic"]:
                return CreatePost(success=False, message="Cannot create posts in private communites")

            if not community_data["community"]["community"]["isMember"]:
                return CreatePost(success=False, message="You must be a member of the community to post")

            post = Post.objects.create(
                poster_id=info.context.user['id'],
                community_id=community_id,
                title=title,
                body=body
            )

            return CreatePost(success=True, message="Post created successfully", post=post)
        except Exception as e:
            return CreatePost(success=False, message=f"Failed to create post: {str(e)}", post=None)


class UpdatePost(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    post = graphene.Field(PostType)

    class Arguments:
        post_id = graphene.ID(required=True)
        title = graphene.String()
        body = graphene.String()

    @login_required
    def mutate(self, info, post_id, title=None, body=None):
        try:
            post = Post.objects.get(id=post_id)

            if post.poster_id != info.context.user['id']:
                return UpdatePost(success=False, message="You do not have permission to update this post", post=None)

            if title:
                post.title = title
            if body:
                post.body = body

            post.save()

            return UpdatePost(success=True, message="Post updated successfully", post=post)
        except Post.DoesNotExist:
            return UpdatePost(success=False, message="Post not found", post=None)
        except Exception as e:
            return UpdatePost(success=False, message=f"Failed to update post: {str(e)}", post=None)


class DeletePost(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)

    class Arguments:
        post_id = graphene.ID(required=True)

    @login_required
    def mutate(self, info, post_id):
        try:
            post = Post.objects.get(id=post_id)

            if post.poster_id != info.context.user['id']:
                return DeletePost(success=False, message="You do not have permission to delete this post")

            delete_comments_data = get_comment_service_server_client().execute(delete_post_comments_document, {
                "postId": post_id
            })

            if not delete_comments_data['deleteComments']['success']:
                return DeletePost(
                    success=False,
                    message="Unable to delete post comments"
                )

            post.delete()

            return DeletePost(success=True, message="Post deleted successfully")
        except Post.DoesNotExist:
            return DeletePost(success=False, message="Post not found")
        except Exception as e:
            return DeletePost(success=False, message=f"Failed to delete post: {str(e)}")


class DeletePosts(graphene.Mutation):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)

    class Arguments:
        community_id = graphene.ID()
        user_id = graphene.ID()

    @server_only
    def mutate(self, info, community_id=None, user_id=None):
        try:
            filters = {}

            if community_id:
                filters['community_id'] = community_id
            if user_id:
                filters['poster_id'] = user_id

            posts_to_delete = Post.objects.filter(**filters)

            deleted_count, _ = posts_to_delete.delete()

            message = f"Successfully deleted {deleted_count} posts"

            return DeletePosts(success=True, message=message)

        except Exception as e:
            return DeletePosts(success=False, message=f"Failed to delete posts: {str(e)}")


class PostResponse(graphene.ObjectType):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    post = graphene.Field(PostType)


class PostsResponse(graphene.ObjectType):
    success = graphene.Boolean(required=True)
    message = graphene.String(required=True)
    posts = graphene.List(graphene.NonNull(PostType))


class Query(graphene.ObjectType):
    post = graphene.Field(PostResponse, id=graphene.ID(required=True))
    posts = graphene.Field(
        PostsResponse,
        community_id=graphene.String(),
        user_id=graphene.ID()
    )

    def resolve_post(self, info, id):
        try:
            post = Post.objects.get(id=id)
            return PostResponse(success=True, message="Post retrieved successfully", post=post)
        except Post.DoesNotExist:
            return PostResponse(success=False, message="Post not found", post=None)

    def resolve_posts(self, info, community_id=None, user_id=None):
        try:
            filters = {}
            if community_id:
                filters['community_id'] = community_id
            if user_id:
                filters['poster_id'] = user_id

            posts = Post.objects.filter(**filters)
            return PostsResponse(success=True, message="Posts retrieved successfully", posts=list(posts))
        except Exception as e:
            return PostsResponse(success=False, message=f"Failed to retrieve posts: {str(e)}", posts=[])


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    delete_post = DeletePost.Field()
    delete_posts = DeletePosts.Field()


schema = build_schema(query=Query, mutation=Mutation,
                      federation_version=LATEST_VERSION)
