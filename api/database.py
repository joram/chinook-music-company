import os
import shlex
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://user:password@source-database:5432/chinook"
)

# create_async_engine requires the asyncpg driver; bare "postgresql://" URLs
# (e.g. from RDS) default to psycopg2, which we don't install.
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)


def asyncpg_connect_args(url):
    """Move libpq-only query parameters out of the URL.

    SQLAlchemy passes query parameters to asyncpg.connect() as keyword
    arguments, and asyncpg has no `options` or `sslmode`. `options`
    (e.g. "-c fork_name=my-branch" for a VeilStream fork) becomes
    server_settings, which asyncpg sends as startup parameters; `sslmode`
    becomes asyncpg's `ssl`.
    """
    query = dict(url.query)
    connect_args = {}
    options = query.pop("options", None)
    if options:
        settings = {}
        words = shlex.split(options.replace("+", " "))
        for i, word in enumerate(words):
            pair = None
            if word in ("-c", "--set") and i + 1 < len(words):
                pair = words[i + 1]
            elif word.startswith("-c") and len(word) > 2:
                pair = word[2:]
            if pair and "=" in pair:
                key, value = pair.split("=", 1)
                settings[key] = value
        if settings:
            connect_args["server_settings"] = settings
    sslmode = query.pop("sslmode", None)
    if sslmode:
        connect_args["ssl"] = sslmode
    return url.set(query=query), connect_args


engine_url, engine_connect_args = asyncpg_connect_args(make_url(DATABASE_URL))

engine = create_async_engine(
    engine_url,
    connect_args=engine_connect_args,
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

