import os
import psycopg
from psycopg.types.bool import BoolDumper
from psycopg.types.numeric import FloatDumper, IntDumper
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

# Send int, float and bool parameters as text instead of psycopg's default
# binary. The VeilStream fork proxy loses the parameter type OIDs, so the
# server infers the type from the query instead: a 2-byte binary int2 bound
# to "$2::INTEGER" is read as a 4-byte int4 and fails with "insufficient
# data left in message". Text values parse correctly as any inferred type.
for py_type, dumper in ((int, IntDumper), (float, FloatDumper), (bool, BoolDumper)):
    psycopg.adapters.register_dumper(py_type, dumper)

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

