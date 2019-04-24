from django.shortcuts import render
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from  rest_framework.permissions import IsAuthenticated

from .models import Board
from .serializers import BoardSerializer


class BoardAPI(ViewSet):
    """Board API"""
    permission_classes = (IsAuthenticated,)

    def create(self, *args, **kwargs):
        user = self.request.user
        serializer = BoardSerializer(data=self.request.data, user=user)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)
    
    def list(self, *args, **kwargs):
        boards = Board.objects.filter(members=self.request.user)
        serializer = BoardSerializer(boards, many=True)
        return Response(serializer.data, status=200)