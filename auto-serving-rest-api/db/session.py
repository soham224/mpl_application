from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings

SQL_ALCHEMY_DATABASE_URI = "mysql+pymysql://{}:{}@{}:{}/{}".format(
    settings.MYSQL_USERNAME,
    settings.MYSQL_PASS,
    settings.MYSQL_HOSTNAME,
    settings.MYSQL_PORT,
    settings.MYSQL_DB_NAME,
)

engine = create_engine(SQL_ALCHEMY_DATABASE_URI, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
