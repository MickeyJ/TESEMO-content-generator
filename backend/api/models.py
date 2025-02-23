from django.db import models
from django.contrib.auth.models import User


class Author(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    image_url = models.CharField(max_length=300, default="")
    prompt = models.TextField()
    image_style = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Article(models.Model):
    headline = models.CharField(max_length=200)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    image_url = models.URLField()
    image = models.BinaryField(null=True, blank=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    approved = models.BooleanField(blank=True, null=True, default=False)

    def __str__(self):
        return self.headline
