#!/usr/bin/env bash

cat <<+++
usage ${pd_progname} [ OPTIONS ] [ files... ]

OPTIONS
-------

-S SERVER, --server=SERVER
	Server name or IP, e.g. 'winpak', '132.65.42.13' etc (mandatory).

-p PORT, --port=PORT
	SQL Server Database Engine TCP listening port number (default 1433).

-U USER, --user=USER
	Login user name (mandatory).

-P PASSWORD, --password=PASSWORD
	Login user password (mandatory).

-d DATABASE, --database=DATABASE
	Connect to DATABASE database (mandatory).

-s SCHEMA, --schema=SCHEMA
	Set default schema to SCHEMA (default schema is 'Dbo').

-t TRIM, --trim=TRIM
	Remove trailing spaces (default). TRIM values '0' or 'no' mean not
	to remove trailing spaces, whereas values '1' or 'yes' mean remove
	trailing spaces.

-h LINES, --header=LINES
	Print columns names as page header every LINES rows. Valid values
	are from 1 to 32767, whereas value of -1 means no header at all.

-b, --batch
	Batch mode (default)

-i, --interactive
	Interactive mode

--colsep=COLSEP, --separator=COLSEP
	Set output columns' separator character to COLSEP. If COLSEP's lebgth
	is greater than 1, then only the first character is taken as COLSEP.
	COLSEP may be "TAB" for tab-character.

-q, --quiet, --silent
	Do not print warning messages.

-C CONF, --conf=CONF
	Use CONF configuration file.

-D, --debug
	Print SQL script and exit.

-? --help
	Print this help message.
+++
