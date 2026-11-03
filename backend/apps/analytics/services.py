from decimal import Decimal, ROUND_DOWN
from datetime import date, timedelta

from django.db.models import Sum, Case, When, Value, DecimalField, Q
from django.db.models.functions import TruncMonth, Coalesce

from apps.transactions.models import Transaction


def _get_queryset(user, start_date=None, end_date=None):
    queryset = Transaction.objects.filter(user=user)
    if start_date:
        queryset = queryset.filter(date__gte=start_date)
    if end_date:
        queryset = queryset.filter(date__lte=end_date)
    return queryset


def get_financial_summary(user, start_date=None, end_date=None):
    queryset = _get_queryset(user, start_date, end_date)

    result = queryset.aggregate(
        total_income=Coalesce(
            Sum(
                Case(
                    When(type=Transaction.Type.INCOME, then="amount"),
                    default=Value(Decimal("0.00")),
                    output_field=DecimalField(max_digits=12, decimal_places=2),
                )
            ),
            Decimal("0.00"),
            output_field=DecimalField(max_digits=12, decimal_places=2),
        ),
        total_expense=Coalesce(
            Sum(
                Case(
                    When(type=Transaction.Type.EXPENSE, then="amount"),
                    default=Value(Decimal("0.00")),
                    output_field=DecimalField(max_digits=12, decimal_places=2),
                )
            ),
            Decimal("0.00"),
            output_field=DecimalField(max_digits=12, decimal_places=2),
        ),
    )

    total_income = result.get("total_income") or Decimal("0.00")
    total_expense = result.get("total_expense") or Decimal("0.00")
    net_savings = total_income - total_expense

    if total_income > 0 and net_savings > 0:
        savings_rate = (net_savings / total_income * Decimal("100")).quantize(Decimal("0.01"))
    else:
        savings_rate = Decimal("0.00")

    currency = getattr(user, "preferred_currency", None) or "USD"

    return {
        "total_income": f"{total_income:.2f}",
        "total_expense": f"{total_expense:.2f}",
        "net_savings": f"{net_savings:.2f}",
        "savings_rate": float(savings_rate),
        "currency": currency,
    }


def get_category_breakdown(user, start_date=None, end_date=None):
    queryset = _get_queryset(user, start_date, end_date).filter(type=Transaction.Type.EXPENSE)

    aggregated = (
        queryset.values(
            "category__id",
            "category__name",
            "category__color",
            "category__icon",
        )
        .annotate(total_amount=Sum("amount"))
        .order_by("-total_amount")
    )

    total_expense = aggregated.aggregate(total=Coalesce(Sum("total_amount"), Decimal("0.00")))[
        "total"
    ]

    breakdown = []
    if total_expense == 0:
        return []

    for item in aggregated:
        amount = item.get("total_amount") or Decimal("0.00")
        if total_expense > 0:
            percentage = float((amount / total_expense * Decimal("100")).quantize(Decimal("0.01")))
        else:
            percentage = 0.00
        breakdown.append(
            {
                "category_id": item.get("category__id"),
                "category_name": item.get("category__name"),
                "category_color": item.get("category__color"),
                "category_icon": item.get("category__icon"),
                "total_amount": f"{amount:.2f}",
                "percentage": percentage,
            }
        )
    return breakdown


def get_monthly_trend(user, months=6):
    try:
        months = int(months)
    except (TypeError, ValueError):
        months = 6
    if months < 1:
        months = 1
    if months > 12:
        months = 12

    today = date.today()
    # Calcular fecha de inicio (primer día del mes hace (months-1) meses)
    start_month = today.month - (months - 1)
    start_year = today.year
    while start_month <= 0:
        start_month += 12
        start_year -= 1
    start_date = date(start_year, start_month, 1)

    queryset = Transaction.objects.filter(user=user, date__gte=start_date)

    result = (
        queryset.annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(
            income=Coalesce(
                Sum(
                    Case(
                        When(type=Transaction.Type.INCOME, then="amount"),
                        default=Value(Decimal("0.00")),
                        output_field=DecimalField(max_digits=12, decimal_places=2),
                    )
                ),
                Decimal("0.00"),
            ),
            expense=Coalesce(
                Sum(
                    Case(
                        When(type=Transaction.Type.EXPENSE, then="amount"),
                        default=Value(Decimal("0.00")),
                        output_field=DecimalField(max_digits=12, decimal_places=2),
                    )
                ),
                Decimal("0.00"),
            ),
        )
        .order_by("month")
    )

    trend = []
    for item in result:
        month_date = item.get("month")
        income = item.get("income") or Decimal("0.00")
        expense = item.get("expense") or Decimal("0.00")
        net = income - expense
        month_str = month_date.strftime("%Y-%m") if month_date else ""
        trend.append(
            {
                "month": month_str,
                "income": f"{income:.2f}",
                "expense": f"{expense:.2f}",
                "net": f"{net:.2f}",
            }
        )

    # Si no hay datos, retornar array vacío
    return trend
