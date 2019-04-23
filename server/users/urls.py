from django.urls import path
from .views import GuestAPI, UserAPI

user_create = GuestAPI.as_view({
    'get': 'list',
    'post': 'create'
})

user_login =  GuestAPI.as_view({
    'post':'login',
    'get':'list',
})

password_reset = UserAPI.as_view({
    'post': 'password_reset'
})

password_reset_confirm = UserAPI.as_view({
    'post': 'password_reset_confirm'
})

app_name = 'users'
urlpatterns = [
    path('create/', user_create, name='create'),
    path('login/', user_login, name='login'),
    path('password_reset/', password_reset, name='password_reset'),
    path('reset/<uidb64>/<token>/', password_reset_confirm, name='password_reset_confirm'),
]