from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.views.generic import View
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, ArticleSerializer, AuthorSerializer
from .models import Article, Author
from .ai_test import generate_article_for_author
import logging

logger = logging.getLogger(__name__)


class ArticleListCreate(generics.ListCreateAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Article.objects.filter()

    def create(self, request, *args, **kwargs):
        logger.info(f"Received article data: {request.data}")
        data = request.data.copy()
        # Set author_id to the same value as created_by
        data["author_id"] = data.get("created_by")

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )
        logger.error(f"Article validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ArticleDelete(generics.DestroyAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        logger.info(
            f"ArticleDelete: Attempting to delete article with pk={self.kwargs.get('pk')}"
        )
        # Remove user filter to allow deletion of any article
        return Article.objects.all()

    def destroy(self, request, *args, **kwargs):
        logger.info(f"Delete request received for article. URL params: {kwargs}")
        try:
            response = super().destroy(request, *args, **kwargs)
            logger.info("Article deleted successfully")
            return response
        except Exception as e:
            logger.error(f"Error deleting article: {str(e)}")
            raise


class AuthorListCreate(generics.ListCreateAPIView):
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Author.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(created_by=self.request.user)
        else:
            print(serializer.errors)


class AuthorDelete(generics.DestroyAPIView):
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        logger.info(
            f"AuthorDelete: Attempting to delete author with pk={self.kwargs.get('pk')}"
        )
        # Remove user filter to allow deletion of any author
        return Author.objects.all()

    def destroy(self, request, *args, **kwargs):
        logger.info(f"Delete request received for author. URL params: {kwargs}")
        try:
            response = super().destroy(request, *args, **kwargs)
            logger.info("Author deleted successfully")
            return response
        except Exception as e:
            logger.error(f"Error deleting author: {str(e)}")
            raise


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class ExampleGetClass(View):
    permission_classes = [AllowAny]

    def get(self, request):
        # generate_article()
        return HttpResponse("This is a basic GET class view example")


@api_view(["GET"])
@permission_classes([AllowAny])
def generate_article(request, author_id):
    logger.info(f"Received generate request for author_id: {author_id}")
    result = generate_article_for_author(author_id)

    logger.info(f"Generation result: {result}")
    if result["success"]:
        return Response(
            {
                "id": result["id"],
                "headline": result["headline"],
                "body": result["body"],
                "image_url": result["image_url"],
                "author_id": result["author_id"],
                "created_by": result["created_by"],
            },
            status=status.HTTP_201_CREATED,
        )
    else:
        logger.error(f"Generation failed: {result['error']}")
        return Response(
            {"message": result["error"]}, status=status.HTTP_400_BAD_REQUEST
        )


def serve_article_image(request, article_id):
    try:
        article = Article.objects.get(id=article_id)
        return HttpResponse(
            article.image, content_type="image/png"  # Adjust content type if needed
        )
    except Article.DoesNotExist:
        return HttpResponse(status=404)
