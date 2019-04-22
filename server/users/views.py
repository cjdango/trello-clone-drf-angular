from django.contrib.auth.signals import user_logged_in

from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.authtoken.models import Token

from .models import User
from .serializers import (
    UserSerializer,
    UserAuthSerializer
)

class GuestAPI(ViewSet):
    """Guest API"""

    def list(self, *args, **kwargs):
        """lists all users
        """
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data, status=200)

    def create(self, *args, **kwargs):
        """creates a user"""
        serializer = UserSerializer(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=201)
        return Response(serializer.errors, status=400)
    
    def login(self, *args, **kwargs):
        serializer = UserAuthSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        token, created = Token.objects.get_or_create(user=user)
        user_logged_in.send(sender=user.__class__, request=self.request, user=user)
        context = {
            'token':token.key,
            'log':user.last_login,
        }
        return Response(context,status=200)
