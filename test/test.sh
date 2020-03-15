cd /home/panos/Desktop/cht
make cleanup && make
exit 0

echo "Server test"
node testServer.js
exit 0

echo "Client test"
google-chrome --new-window "http://localhost/pandora/test/index.php"
