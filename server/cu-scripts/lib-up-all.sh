#!/bin/bash

cd ../cu-shared-lib
npm run build
cd ..

function replaceShared {
    echo "Replacing shared-lib for $1 ..."
    rm -rf ./$1/node_modules/@edotnet/shared-lib/dist/*
    rm -rf ./$1/node_modules/@edotnet/shared-lib/lib/*

    cp -a -f ./cu-shared-lib/dist ./$1/node_modules/@edotnet/shared-lib/
    cp -a -f ./cu-shared-lib/lib ./$1/node_modules/@edotnet/shared-lib/
    echo "Replaced shared-lib for $1"
}  

replaceShared cu-api-gateway
replaceShared cu-scheduler
replaceShared cu-migrations
replaceShared cu-users-svc
replaceShared cu-transactions-svc 