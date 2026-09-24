from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# IMPORTANT: Change 'root' and 'password' below to your actual MySQL username and password!
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:Srinath%4023@localhost:3306/edumerge_fees"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()