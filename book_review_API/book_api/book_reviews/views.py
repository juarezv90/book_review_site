from rest_framework import generics,viewsets, views
from .serilizers import CustomUserSerializer,BookSerializer, ReviewSerializer, ReviewCreateSerializer, ProfileImageSerializer, UserProfileSerializer,AuthorSerializer, SeriesSerializer
from .models import Book, Review, ProfilePicture,Authors,Series
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status,filters
from .permissions import BookPrivileges
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from itertools import chain
from django.db.models import Q


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
    search_fields = ['title', 'author__author','isbn']

    def get_queryset(self):
        search_term = self.request.query_params.get('search')

        if search_term:
            print("Search term provided:", search_term)
            book_queryset = Book.objects.filter(
                Q(title__icontains=search_term) |
                Q(isbn__icontains=search_term)
            )
            author_books_queryset = Book.objects.filter(
                authors__author__icontains=search_term
            )

            combine_queryset = book_queryset | author_books_queryset
            return combine_queryset.distinct()
        else:
            print("No search term provided. Returning all books.")
            return Book.objects.all()

    def perform_create(self, serializer):
        print(f'{self.request.data.get('series')}')
        author_name = self.request.data.get('author')
        book_series_name = self.request.data.get('book_series')
        number_in_series = self.request.data.get('number_in_series')

        print('not even close')
        if author_name:
            author, created = Authors.objects.get_or_create(author=author_name)
        else:
            return Response({'error':'Author field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        series = None
        if book_series_name:
            series, created = Series.objects.get_or_create(book_series=book_series_name)
            
        if series and number_in_series is not None:
            if Book.objects.filter(series=series, number_in_series=number_in_series).exists():
                return Response({'error': f'A book with number {number_in_series} already exists in this series.'}, status=status.HTTP_400_BAD_REQUEST)

        print("made it here")
        book_data = serializer.validated_data
        book_data['series'] = series

        book = serializer.save(**book_data)
        author.books_written.add(book)

        return book
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        books = BookSerializer(queryset, many=True).data

        for item in books:
            author = AuthorSerializer(Authors.objects.get(books_written=item['isbn'])).data
            item['author']=author['author']
            if item['number_in_series']:
                series = SeriesSerializer(Series.objects.get(id=item['series'])).data
                item['series']=series['book_series']
        
        return Response(books, status=status.HTTP_200_OK)
    

class ViewSingleBook(generics.RetrieveUpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'isbn'

    def retrieve(self, request, *args, **kwargs):
        book = self.get_object()
        author = book.authors_set.first()  # Assuming one author per book for simplicity
        series = book.series if book.series else None  # Assuming the book belongs to at most one series

        book_data = BookSerializer(book).data
        author_data = AuthorSerializer(author).data if author else None
        series_data = SeriesSerializer(series).data if series else None

        return Response({
            "book": book_data,
            "author": author_data,
            "series": series_data,
        }, status=status.HTTP_200_OK)

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