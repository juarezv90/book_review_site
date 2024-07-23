from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Book, Review

CustomUser = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password','first_name','last_name','profile_image']
    
    def validate(self, data):
        if 'username' not in data:
            raise serializers.ValidationError({"username": "This field is required."})
        if 'email' not in data:
            raise serializers.ValidationError({"email": "This field is required."})
        if 'first_name' not in data:
            raise serializers.ValidationError({"first_name": "This field is required."})
        if 'last_name' not in data:
            raise serializers.ValidationError({"last_name": "This field is required."})
        if 'password' not in data:
            raise serializers.ValidationError({"password": "This field is required."})
        return data

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            
        )
        return user

class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = "__all__"

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = "__all__"

class ReviewCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Review
        fields = ['book', 'review_text', 'review_rating']

    def create(self, validated_data):
        user = self.context['request'].user
        review = Review.objects.create(user=user, **validated_data)
        return review