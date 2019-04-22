from django.urls import path
from .views import GuestAPI

user_create = GuestAPI.as_view({
    'get': 'list',
    'post': 'create'
})

user_login =  GuestAPI.as_view({
    'post':'login',
    'get':'list',
})

app_name = 'users'
urlpatterns = [
    path('create/', user_create, name='create'),
    path('login/', user_login, name='login'),
]