from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Book, Review,ProfilePicture, Authors, Series

CustomUser = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password','first_name','last_name']
    
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
    number_of_likes = serializers.SerializerMethodField()
    book_series_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Book
        fields = ['series','title', 'book_img', 'about_book', 'book_series_name', 'number_in_series', 'isbn', 'published_date', 'number_of_likes']
        read_only_fields = ['series']

    def get_number_of_likes(self, obj):
        return obj.number_of_likes()
    
    def create(self, validated_data):
        book_series_name = validated_data.pop('book_series_name', None)
        series = None
        if book_series_name:
            series, created = Series.objects.get_or_create(book_series=book_series_name)
            validated_data['series'] = series
        return super().create(validated_data)
    
class AuthorSerializer(serializers.ModelSerializer):
    book_written = BookSerializer(many=True, read_only=True)

    class Meta:
        model = Authors
        fields = ['author', 'books_written', 'book_written']

class SeriesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Series
        fields = ['book_series']

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
    
class ProfileImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProfilePicture
        fields = ['profile_image','image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(obj.profile_image.url)
        return obj.profile_image.url

class UserProfileSerializer(serializers.ModelSerializer):
    profile_image_data=ProfileImageSerializer(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'profile_image_data']

    def create(self, validated_data):
        profile_data = validated_data.pop('profile_image_data')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password'],
        )
        ProfilePicture.objects.create(user=user, **profile_data)
        return user