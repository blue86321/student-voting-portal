import logging

from django.db import DatabaseError
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler
from django.utils.translation import gettext_lazy as _

# logger = logging.getLogger("django")


def exception_handler(exc, context):
    """
    Custom exception handler
    :param exc: exception object
    :param context: context, including `request` and `view` object
    :return: response
    """
    response = drf_exception_handler(exc, context)
    if response is None:
        view = context['view']
        # Add Database error
        if isinstance(exc, DatabaseError):
            # logger.error()
            response = Response({"message": "database error"}, status=status.HTTP_507_INSUFFICIENT_STORAGE)
    return response


class DeleteError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _('`delete_time` existed')
    default_code = 'delete_error'
