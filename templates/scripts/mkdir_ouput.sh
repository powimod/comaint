#!/bin/sh
if [ -d output ]; then
	echo "Directory './output' already exists"
	exit 1
fi
mkdir ./output
mkdir ./output/comaint-mpa-frontend
mkdir ./output/comaint-mpa-frontend/public
mkdir ./output/comaint-mpa-frontend/src
mkdir ./output/comaint-mpa-frontend/src/routes
mkdir ./output/comaint-mpa-frontend/src/views
mkdir ./output/comaint-api-lib
mkdir ./output/comaint-api-lib/src
mkdir ./output/comaint-api-lib/src/objects
mkdir ./output/comaint-backend
mkdir ./output/comaint-backend/locales
mkdir ./output/comaint-backend/locales/en
mkdir ./output/comaint-backend/locales/fr
mkdir ./output/comaint-backend/tests
mkdir ./output/comaint-backend/src
mkdir ./output/comaint-backend/src/objects
mkdir ./output/comaint-backend/src/models
mkdir ./output/comaint-backend/src/routes
mkdir ./output/comaint-backend/src/views
mkdir ./output/comaint-backend/saves
mkdir ./output/comaint-spa-frontend
mkdir ./output/comaint-spa-frontend/public
mkdir ./output/comaint-spa-frontend/public/locales
mkdir ./output/comaint-spa-frontend/public/locales/en
mkdir ./output/comaint-spa-frontend/public/locales/fr
mkdir ./output/comaint-spa-frontend/public/content
mkdir ./output/comaint-spa-frontend/public/content/en
mkdir ./output/comaint-spa-frontend/public/content/fr
mkdir ./output/comaint-spa-frontend/src
mkdir ./output/comaint-spa-frontend/src/components
mkdir ./output/comaint-spa-frontend/src/components/dialog
mkdir ./output/comaint-spa-frontend/src/scss
mkdir ./output/comaint-spa-frontend/src/containers
mkdir ./output/comaint-spa-frontend/saves
mkdir ./output/comaint-spa-frontend/saves/src
cd ./output/comaint-mpa-frontend/src && ln -s ../../comaint-api-lib/src/ api && cd -
cd ./output/comaint-spa-frontend/src && ln -s ../../comaint-api-lib/src/ api && cd -
echo "Ouput tree build"
