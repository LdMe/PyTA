# if it is using zsh
if [ -n "$ZSH_VERSION" ]; then
    # remove all aliases starting with pyta from .zshrc if it exists
    if [ -f "$HOME/.zshrc" ]; then
        sed -i '/^alias pyta/d' "$HOME/.zshrc"
    fi
    # remove run.sh file
    rm run.sh

    # restart zsh
    exec zsh
# if it is using bash
elif [ -n "$BASH_VERSION" ]; then
    # remove all aliases starting with pyta from .bash_aliases if it exists
    if [ -f "$HOME/.bash_aliases" ]; then
        sed -i '/^alias pyta/d' "$HOME/.bash_aliases"
    fi
    # remove run.sh file
    rm run.sh

    # restart bash
    exec bash
else
    echo "Tu shell no está en la lista de shells soportadas. Puedes intentar agregarla modificando el archivo uninstall.sh. Si lo consigues o quieres que lo hagamos, por favor abre un issue en el repositorio de GitHub."
    exit 1

fi