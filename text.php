<?php

shell_exec("curl -X POST 'https://api.twilio.com/2010-04-01/Accounts/AC461d3f5fa9b34098d83e19417d88608c/Messages.json' \
	--data-urlencode 'To=269-267-3752'  \
	--data-urlencode 'From=+12692042709'  \
	--data-urlencode 'Body=Dog is running away!' \
	-u AC461d3f5fa9b34098d83e19417d88608c:93e934c729223531780d8a0851d14ab3");

?>