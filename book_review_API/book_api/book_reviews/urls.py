from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import CreateUserView, AddBookView, ViewSingleBook, ReviewBookView, ReviewCreateDeleteView, ProfileView, TokenVerifyView, ProfileReviewsViews
from django.conf.urls.static import static
from django.conf import settings
router = DefaultRouter()
router.register(r'books', AddBookView, basename="add_book")

urlpatterns = [
    path('api/', include(router.urls)),
    path('register/', CreateUserView.as_view(), name="register"),
    path('books/<int:isbn>', ViewSingleBook.as_view(), name="book_detail"),
    path('books/<int:isbn>/reviews/', ReviewBookView.as_view(), name="book-reviews" ),
    path('books/<int:isbn>/makereviews/', ReviewCreateDeleteView.as_view(), name='create_delete_review'),
    path('user/profile/', ProfileView.as_view(), name="profile"),
    path('api/token/verify/', TokenVerifyView.as_view(), name="token_verify"),
    path('profile/reviews', ProfileReviewsViews.as_view(), name="profile_review_list")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)