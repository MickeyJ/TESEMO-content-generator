from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Article, Author

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = [
            'id',
            'first_name',
            'last_name',
            'image_url',
            'prompt',
            'created_by',
            'created_at'
        ]
        extra_kwargs = {'created_by': {'read_only': True}}

class ArticleSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)  # Include full author data for GET requests
    author_id = serializers.PrimaryKeyRelatedField(
        source='author',  # Map to the 'author' field in the model
        queryset=Author.objects.all(),
        write_only=True  # Use this only for POST/PUT requests
    )
    class Meta:
        model = Article
        fields = [
            'id',
            'headline',
            'body',
            'image_url',
            'created_at',
            'author',       # Full nested author data for GET
            'author_id',    # Allow setting author by ID for POST/PUT
            'created_by',
            'approved'
        ]
        extra_kwargs = {'created_by': {'read_only': True}}
        