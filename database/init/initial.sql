SELECT 'CREATE DATABASE projectname'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'projectname')\gexec
GRANT ALL PRIVILEGES ON DATABASE projectname TO postgres;
