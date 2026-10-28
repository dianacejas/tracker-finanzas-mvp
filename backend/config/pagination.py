"""Paginación compartida por la API."""

from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """Paginación por número de página con tamaño ajustable.

    El cliente puede pedir un tamaño distinto con `?page_size=`, pero siempre
    dentro de un máximo: sin ese tope, una sola petición podría reclamar
    toda la tabla y agotar la memoria del servidor.
    """

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100
