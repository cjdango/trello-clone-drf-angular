from rest_framework import serializers

from .models import Board


class BoardSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    members = serializers.PrimaryKeyRelatedField(read_only=True, many=True)
    

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super(BoardSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = Board
        fields = ['title', 'owner', 'members']

    def save(self, *args, **kwargs):
        board = super(BoardSerializer, self).save(owner=self.user, *args, **kwargs)
        board.members.add(self.user)
        return self.instance