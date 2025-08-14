import logging
import logging.handlers as handlers
import os

FORMATTER = logging.Formatter(
    "%(asctime)s - %(levelname)s - %(filename)s:%(lineno)s - %(funcName)2s() : %(message)s"
)
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__)))
LOG_FILE_PATH = basedir.rsplit("/", 1)[0] + os.sep + "logs"
LOG_LEVEL = "DEBUG"


class MyLogger:
    @staticmethod
    def get_logger(logger_name=None):
        if not os.path.exists(LOG_FILE_PATH):
            try:
                import time

                os.makedirs(LOG_FILE_PATH)
                os.chmod(LOG_FILE_PATH, 0o777)
                time.sleep(2)
            except OSError:
                pass

        logging.basicConfig(level=LOG_LEVEL)
        logger = logging.getLogger(logger_name)

        f_handler = handlers.TimedRotatingFileHandler(
            "logs" + os.sep + "mpl_backend_log", when="midnight", interval=1
        )
        f_handler.setFormatter(FORMATTER)
        f_handler.setLevel(LOG_LEVEL)
        # logger.addHandler(f_handler)
        return logger
