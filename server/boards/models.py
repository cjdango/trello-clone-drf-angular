from django.db import models
from django.contrib.auth import get_user_model


class Board(models.Model):
    title = models.CharField(max_length=50)
    owner = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name='board_owned_set')
    members = models.ManyToManyField(
        get_user_model(), related_name='board_set')
    is_archived = models.BooleanField(default=False)

    def __str__(self):
        return self.title