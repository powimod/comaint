To build output tree : 
  $ ./templates/scripts/mkdir_ouput.sh

To build initial code :
  $ node -- tools/pwm-code-gen/main.js --verbose ./templates/config.yml

To copy non-liquid files :
  $ cp templates/assets/icons.png output/comaint-spa-frontend/public/

To create database tables :
  $ mysql -u <USER> -p<PASSWORD> --database <DATABASE> < output/init-db.sql

To drop tables in database : 
  $ bdd < scripts/drop-db.sql

Create backend config files : 
  $ cd output/comaint-backend/
  $ cp config.json.template config.json

Customize `output/comaint-backend/config.json` file

Create frontend config files : 
  $ cd output/comaint-spa-frontend/
  $ cp config.json.template config.json

Customize `output/comaint-spa-frontend/config.json` file
