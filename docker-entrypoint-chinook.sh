#!/bin/bash
set -e

# Remove data directory if PostgreSQL has been initialized
# PostgreSQL checks for PG_VERSION file to determine if database is initialized
if [ -f "/var/lib/postgresql/data/PG_VERSION" ]; then
    echo "Removing existing PostgreSQL data directory to force reinitialization..."
    echo "This ensures initialization scripts in /docker-entrypoint-initdb.d/ will run."
    rm -rf /var/lib/postgresql/data/*
    rm -rf /var/lib/postgresql/data/.[!.]* 2>/dev/null || true  # Remove hidden files too
fi

# Call the original postgres entrypoint
exec /usr/local/bin/docker-entrypoint.sh "$@"

