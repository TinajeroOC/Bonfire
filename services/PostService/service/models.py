from django.db import models
from django.core.validators import MinLengthValidator


class Post(models.Model):
    poster_id = models.CharField(max_length=255)
    community_id = models.CharField(max_length=255)
    title = models.CharField(
        max_length=300,
        validators=[MinLengthValidator(
            1, "Title must be at least 1 character long")]
    )
    body = models.TextField(max_length=10000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_poster(self, user_id: str) -> bool:
        return self.poster_id == user_id

    class Meta:
        verbose_name_plural = "posts"
        ordering = ['-created_at']
