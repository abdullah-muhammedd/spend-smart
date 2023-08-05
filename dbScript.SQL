drop user nodeApp;
create user nodeApp identified by "12131415";
grant all
on spendsmartapp.*
TO nodeApp;
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS Clean_User_Verification_Tokens
ON SCHEDULE EVERY 3 HOUR
DO
UPDATE users 
SET
meta_verificationToken = NULL,
meta_verificationTokenExpiration = NULL
WHERE
meta_verificationTokenExpiration < NOW();

CREATE EVENT IF NOT EXISTS Clean_User_Reset_Tokens
ON SCHEDULE EVERY 3 HOUR
DO
UPDATE users 
SET
meta_isResetting = FALSE,
meta_resettingToken = NULL,
meta_resettingTokenExpiration = NULL
WHERE
meta_resettingTokenExpiration < NOW();