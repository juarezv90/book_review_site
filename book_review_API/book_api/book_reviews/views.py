from rest_framework import generics,viewsets
from .serilizers import CustomUserSerializer,BookSerializer, ReviewSerializer, ReviewCreateSerializer
from .models import Book, Review
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status,filters
from .permissions import CanAddBooK

CustomUser = get_user_model()

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes=[AllowAny]

class AddBookView(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [CanAddBooK]
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
            return Response({'errors':'Book not found'}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            review = generics.get_object_or_404(Review,pk=review_id, book=book, user=request.user)
        except Review.DoesNotExist:
            return Response({'error':'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        
        review.delete()

        return Response({'status':'review deleted'}, status=status.HTTP_204_NO_CONTENT)
    