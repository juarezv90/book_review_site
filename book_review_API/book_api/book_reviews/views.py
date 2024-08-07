from rest_framework import generics,viewsets, views
from .serilizers import CustomUserSerializer,BookSerializer, ReviewSerializer, ReviewCreateSerializer, ProfileImageSerializer, UserProfileSerializer
from .models import Book, Review, ProfilePicture
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status,filters
from .permissions import BookPrivileges
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404

CustomUser = get_user_model()

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes=[AllowAny]

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class AddBookView(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [BookPrivileges]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'author']

class ViewSingleBook(generics.RetrieveUpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'isbn'

    def update(self, request, *args, **kwargs):
        book = self.get_object()
        user = request.user
        if user in book.likes.all():
            book.likes.remove(user)
        else:
            book.likes.add(user)
        book.save()
        return Response({"status":"Like Updated"}, status=status.HTTP_200_OK)

class ReviewBookView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        isbn = self.kwargs['isbn']
        book = generics.get_object_or_404(Book, isbn=isbn)
        
        return Review.objects.filter(book=book)
    
class ProfileReviewsViews(views.APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user = request.user
        reviews = Review.objects.filter(user=user)
        book_ids = reviews.values_list('book', flat=True)
        books = Book.objects.filter(isbn__in=list(book_ids))

        review_serializer = ReviewSerializer(reviews, many=True)
        book_serializer = BookSerializer(books, many=True)
        review_data = {
            'review_list': review_serializer.data,
            'book_list': book_serializer.data,
        }
        return Response(review_data, status=status.HTTP_200_OK)
    

class ReviewCreateDeleteView(generics.GenericAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewCreateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        isbn = kwargs.get('isbn')
        
        try:
            book = Book.objects.get(isbn=isbn)
        except Book.DoesNotExist:
            return Response({'errors':'Book not found'}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data['book'] = book.isbn

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        return Response({'status':'review created', 'review': ReviewSerializer(review).data}, status=status.HTTP_201_CREATED)
    
    def delete(self, request, *args, **kwargs):
        isbn = kwargs.get('isbn')
        review_id = request.data['review_id']

        if not review_id:
            return Response({'error':'Review ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            book = Book.objects.get(isbn=isbn)
        except Book.DoesNotExist:
            return Response({'error':'Book not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            review = generics.get_object_or_404(Review,pk=review_id, book=book, user=request.user)
        except Review.DoesNotExist:
            return Response({'error':'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        
        review.delete()

        return Response({'status':'review deleted'}, status=status.HTTP_204_NO_CONTENT)

class ProfileView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        permissions = user.get_all_permissions()
        profile_image = ProfilePicture.objects.filter(user=user).first()
        image_serializer = ProfileImageSerializer(profile_image, context={'request':request})
        user_data = {
            'id':user.id,
            'username':user.username,
            'email':user.email,
            'first_name':user.first_name,
            'last_name':user.last_name,
            'permissions':list(permissions),
            'profile_image':image_serializer.data if profile_image else None,
        }
        return Response(user_data, status=status.HTTP_200_OK)

class TokenVerifyView(generics.views.APIView):
    permission_classes=[IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        try:
            AccessToken(token)
            return Response({"detail":"Token is Valid"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail":"Token is invalid or Expired"}, status=status.HTTP_401_UNAUTHORIZED)