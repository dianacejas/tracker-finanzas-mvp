"""Filtros de consulta para el listado de transacciones."""

import django_filters
from django_filters import rest_framework as filters

from .models import Transaction


class TransactionFilterSet(filters.FilterSet):
    """Filtros del endpoint de listado.

    Todos operan sobre el queryset ya acotado al usuario en la vista, de modo
    que ningún filtro puede ampliar el alcance de los datos visibles.
    """

    start_date = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="date", lookup_expr="lte")
    type = django_filters.ChoiceFilter(choices=Transaction.Type.choices)
    category = django_filters.NumberFilter(field_name="category__id")

    class Meta:
        model = Transaction
        fields = ("start_date", "end_date", "type", "category")
