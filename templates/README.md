To build initial code :

    $ node -- tools/pwm-code-gen/main.js --verbose ./templates/config.yml

Create symbolic links :
    cd ./output/comaint-mpa-frontend/src && ln -s ../../comaint-api-lib/src/ api && cd -
    cd ./output/comaint-spa-frontend/src && ln -s ../../comaint-api-lib/src/ api && cd -

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
