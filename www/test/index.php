<?php

require_once("../lib/pandora.php");

pandora::
document_head([
	"favicon" => "../images/icon/icon-192x192.png",
	"title" => "Pandora!",
])::
document_body();
?>
<h3>
Hi there!
</h3>
<h4>
This is a test page for "pandora" API.
</h4>

pandora::document_close();
