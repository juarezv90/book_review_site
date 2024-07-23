from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import CreateUserView, AddBookView, ViewSingleBook, ReviewBookView, ReviewCreateDeleteView
from django.conf.urls.static import static
from django.conf import settings
router = DefaultRouter()
router.register(r'books', AddBookView)

urlpatterns = [
    path('register/', CreateUserView.as_view(), name="register"),
    path('', include(router.urls)),
    path('books/<int:isbn>', ViewSingleBook.as_view(), name="book_detail"),
    path('books/<int:isbn>/reviews/', ReviewBookView.as_view(), name="book-reviews" ),
    path('books/<int:isbn>/makereviews/', ReviewCreateDeleteView.as_view(), name='create_delete_review'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)