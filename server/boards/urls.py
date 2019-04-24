from django.urls import path
from .views import BoardAPI

board_create = BoardAPI.as_view({
    'post': 'create',
    'get': 'list'
})

app_name = 'boards'
urlpatterns = [
    path('', board_create, name='create')
]