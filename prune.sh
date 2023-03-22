# if $(docker ps -a | grep pyta | awk '{print $1}') is not empty
# then
#     # remove all docker containers related to pyta

if [ -n "$(docker ps -a | grep pyta | awk '{print $1}')" ]; then
    # remove all docker containers related to pyta
    docker rm -f $(docker ps -a | grep pyta | awk '{print $1}')
    
fi

