from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import CustomUser,Review, Book

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['email', 'username','profile_image']

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Book)
admin.site.register(Review)

# Register your models here.
