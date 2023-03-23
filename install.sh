
docker build -t pyta .
# if it is using zsh
if [ -n "$ZSH_VERSION" ]; then
    # remove all aliases starting with pyta from .zshrc if it exists
    if [ -f "$HOME/.zshrc" ]; then
        sed -i '/^alias pyta/d' "$HOME/.zshrc"
    fi
    # create run.sh file and add docker run --rm -v <current_dir>:/app -it pyta
    echo "docker run --rm -v $(pwd):/app -it pyta" > run.sh
    # add prune.sh execution to run.sh
    echo $(pwd)/prune.sh >> run.sh

    chmod +x run.sh

    # add alias pyta to .zshrc
    echo "alias pyta='$(pwd)/run.sh'" >> "$HOME/.zshrc"

    # restart zsh
    exec zsh
# if it is using bash
elif [ -n "$BASH_VERSION" ]; then
    # remove all aliases starting with pyta from .bash_aliases if it exists
    if [ -f "$HOME/.bash_aliases" ]; then
        sed -i '/^alias pyta/d' "$HOME/.bash_aliases"
    fi
    # create run.sh file and add docker run --rm -v <current_dir>:/app -it pyta
    
    echo "docker run --rm -v $(pwd):/app -it pyta" > run.sh
    # add prune.sh execution to run.sh
    echo $(pwd)/prune.sh >> run.sh

    chmod +x run.sh

    # add alias pyta to .bash_aliases
    echo "alias pyta='$(pwd)/run.sh'" >> "$HOME/.bash_aliases"

    # restart bash
    exec bash


else
    echo "Tu shell no está en la lista de shells soportadas. Puedes intentar agregarla modificando el archivo install.sh. Si lo consigues o quieres que lo hagamos, por favor abre un issue en el repositorio de GitHub."
    exit 1

fi

