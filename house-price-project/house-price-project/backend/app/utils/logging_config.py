import logging
import sys


def configure_logging(level: int = logging.INFO) -> None:
    """Configure a simple, readable console logger for the whole app."""
    root = logging.getLogger()
    if root.handlers:
        # Already configured (e.g. re-imported under --reload); avoid duplicate handlers.
        return

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter("%(asctime)s | %(levelname)-8s | %(name)s | %(message)s")
    )
    root.addHandler(handler)
    root.setLevel(level)
