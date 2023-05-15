from django.db import DatabaseError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler
import logging

logger = logging.getLogger()


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
            logger.error(exc.args)
            response = Response({"message": "database error"}, status=status.HTTP_507_INSUFFICIENT_STORAGE)
    return response
