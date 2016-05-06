# migration-bot

A simple slack bot for storing and listing database migration queries.

Supported commands:

* **new query [query name]** - Create a new migration query called [query name], the bot will then ask you for your query.

* **query [number of results]** - Display the last [number of results] queries added.

* **query all** - Display all the migration queries.