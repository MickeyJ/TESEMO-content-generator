from django.urls import path
from . import views

urlpatterns = [
    path("articles/", views.ArticleListCreate.as_view(), name="article-list"),
    path(
        "articles/delete/<int:pk>/",
        views.ArticleDelete.as_view(),
        name="delete-article",
    ),
    path("authors/", views.AuthorListCreate.as_view(), name="author-list"),
    path(
        "authors/delete/<int:pk>/", views.AuthorDelete.as_view(), name="delete-author"
    ),
    path(
        "articles/generate/<int:author_id>/",
        views.generate_article,
        name="generate_article",
    ),
    path(
        "articles/<int:article_id>/image/",
        views.serve_article_image,
        name="article_image",
    ),
    path(
        "articles/<int:pk>/",
        views.ArticleDetail.as_view(),
        name="article-detail",
    ),
    path(
        "articles/update/<int:pk>/",
        views.ArticleUpdate.as_view(),
        name="article-update",
    ),
]
