from datetime import date, datetime


def parse_date(value: str) -> date:
    return datetime.strptime(value, "%Y-%m-%d").date()


def ranges_overlap(start_a: date, end_a: date, start_b: date, end_b: date) -> bool:
    """Rule 3 (Overlapping Prevention): [S_old, E_old] vs [S_new, E_new]."""
    return start_a <= end_b and start_b <= end_a
