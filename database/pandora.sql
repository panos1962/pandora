-------------------------------------------------------------------------------@
--
-- @BEGIN
--
-- @COPYRIGHT BEGIN
-- Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
-- @COPYRIGHT END
--
-- @FILETYPE BEGIN
-- SQL
-- @FILETYPE END
--
-- @FILE BEGIN
-- database/pandora.sql —— Δημιουργία database "pandora"
-- @FILE END
--
-- @DESCRIPTION BEGIN
-- Το παρόν SQL script δημιουργεί την database "pandora" η οποία μπορεί να
-- χρησιμοποιηθεί ως βάση σε πολλές εφαρμογές. Πράγματι, η database "pandora"
-- περιέχει πίνακα χρηστών, παραμέτρους χρηστών, προσβάσεις κλπ, τουτέστιν
-- στοιχεία που μπρούν να αποδειχτούν χρήσιμα στις περισσότερες εφαρμογές.
--
-- Στο παρόν script υπάρχουν παράμετροι που καθιστούν ευέλικτη την κατασκευή
-- της database. Πιο συγκεκριμένα:
--
--	[[DATABASE]]		Είναι το όνομα της database (default "pandora")
--
--	[[USERNAME]]		Είναι το όνομα του χρήστη που θα έχει πρόσβαση
--				SELECT, INSERT, UPDATE, DELETE σε όλους τους
--				πίνακες της database (default "pandora")
--
--	[[USERPASS]]		Είναι το password του παραπάνω χρήστη
--
--	[[MONITOR]]		Κανάλι μηνυμάτων προόδου (default "/dev/tty")
--
-- Για την αντικατάσταση των παραπάνω παραμέτρων με τις επιθυμητές τιμές
-- χρησιμοποιούμε το πρόγραμμα "database/createdb".
-- @DESCRIPTION END
--
-- @HISTORY BEGIN
-- Created: 2020-01-10
-- @HISTORY END
--
-- @END
-------------------------------------------------------------------------------@

\! echo "\nDatabase '[[DATABASE]]'" >[[MONITOR]]

-------------------------------------------------------------------------------@

\! echo "Creating database…" >[[MONITOR]]

-- Πρώτο βήμα είναι η διαγραφή της database εφόσον αυτή υπάρχει ήδη.

DROP DATABASE IF EXISTS `[[DATABASE]]`
;

-- Με το παρόν κατασκευάζουμε την database.

CREATE DATABASE `[[DATABASE]]`
DEFAULT CHARSET = utf8
DEFAULT COLLATE = utf8_general_ci
;

-- Καθιστούμε τρέχουσα την database που μόλις κατασκευάσαμε.

USE `[[DATABASE]]`
;

-- Καθορίζουμε την default storage engine για τους πίνακες που θα δημιουργηθούν.

SET default_storage_engine = INNODB
;

-------------------------------------------------------------------------------@

-- Ο πίνακας "xristis" απεικονίζει τους χρήστες που πιστροποιούνται μέσω των
-- εργαλείων της "pandora".

CREATE TABLE `xristis` (
	`login`		VARCHAR(128) NOT NULL COMMENT 'login name χρήστη',
	`onoma`		VARCHAR(128) NOT NULL COMMENT 'ονοματεπώνυμο/επωνυμία χρήστη',
	`email`		VARCHAR(128) NOT NULL COMMENT 'email επικοινωνίας',
	`kodikos`	CHARACTER(40) NULL DEFAULT NULL COMMENT 'κωδικός σε SHA1 format',

	PRIMARY KEY (
		`login`
	) USING BTREE,

	UNIQUE INDEX (
		`email`
	) USING HASH
)

COMMENT = 'Πίνακας χρηστών'
;

COMMIT WORK
;

-------------------------------------------------------------------------------@

\! echo "Creating users…" >[[MONITOR]]

DROP USER IF EXISTS '[[USERNAME]]'@'localhost'
;

CREATE USER '[[USERNAME]]'@'localhost' IDENTIFIED BY '[[USERPASS]]'
;

COMMIT WORK
;

-------------------------------------------------------------------------------@

\! echo "Granting permissions…" >[[MONITOR]]

GRANT SELECT, INSERT, UPDATE, DELETE
ON `*`.`*` TO '[[USERNAME]]'@'localhost'
;

COMMIT WORK
;

-------------------------------------------------------------------------------@

\! echo "\nInserting data…" >[[MONITOR]]

\! echo 'Table `xristis`…' >[[MONITOR]]

LOAD DATA LOCAL INFILE 'local/database/xristis.tsv'
INTO TABLE `xristis` (
	`login`,
	`onoma`,
	`email`,
	`kodikos`
);
