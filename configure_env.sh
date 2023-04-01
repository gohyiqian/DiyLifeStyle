#!/bin/bash

# set Railway project name
RAILWAY_PROJECT_NAME="diylifestyle"

# set environment variable key-value pairs
ENV_VARIABLES=(
  "MONGO_URI=mongodb+srv://yiqian_admin:tatyt27nLkRI8prc@cluster0.u8mkw.mongodb.net/diylifestyle?authSource=admin&replicaSet=atlas-wxa127-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true"
  "SESSION_SECRET=SomeRANdOmSeCRet"
)

# loop through environment variable key-value pairs and set them on Railway
for env_variable in "${ENV_VARIABLES[@]}"
do
  key=$(echo $env_variable | cut -d'=' -f1)
  value=$(echo $env_variable | cut -d'=' -f2)
  railway variables:set $key=$value -p $RAILWAY_PROJECT_NAME
done
