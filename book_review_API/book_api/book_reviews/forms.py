from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):

    class Meta: 
        model = CustomUser
        fields = ('username', 'email','profile_image')
        fieldsets = (
            (None, {
                'fields': (
                    'username', 'email', 'password1', 'password2','profile_image',
                ),
            }),
        )

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('username', 'email')