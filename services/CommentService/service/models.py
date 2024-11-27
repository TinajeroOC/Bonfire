from django.db import models
from django.core.validators import MinLengthValidator


class Comment(models.Model):
    commenter_id = models.CharField(max_length=255)
    post_id = models.CharField(max_length=255)
    body = models.TextField(validators=[MinLengthValidator(
        1, "Title must be at least 1 character long")], max_length=4000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_commenter(self, user_id: str) -> bool:
        return self.commenter_id == user_id

    class Meta:
        verbose_name_plural = "comments"
        ordering = ['-created_at']
