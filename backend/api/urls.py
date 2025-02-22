from django.urls import path
from . import views

urlpatterns = [
    path('articles/', views.ArticleListCreate.as_view(), name='article-list'),
    path('articles/delete/<int:pk>/', views.ArticleDelete.as_view(), name='delete-article'),
    path('authors/', views.AuthorListCreate.as_view(), name='author-list'),
    path('authors/delete/<int:pk>/', views.AuthorDelete.as_view(), name='delete-author'),
    path('articles/generate/<int:author_id>/', views.generate_article, name='generate_article'),
]