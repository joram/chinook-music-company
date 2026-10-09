import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://user:password@source-database:5432/chinook"
)

# Use psycopg (libpq) as the async driver. It understands libpq URL
# parameters such as options=-c fork_name=... and sslmode, which VeilStream
# fork URLs use, and tolerates the fork proxy's protocol quirks that asyncpg
# treats as fatal. Bare "postgresql://" URLs (e.g. from RDS) would otherwise
# default to psycopg2, which we don't install.
for scheme in ("postgresql+asyncpg://", "postgresql://", "postgres://"):
    if DATABASE_URL.startswith(scheme):
        DATABASE_URL = DATABASE_URL.replace(scheme, "postgresql+psycopg://", 1)
        break

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=1800,
)
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

