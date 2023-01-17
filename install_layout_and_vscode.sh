curl https://github.com/takenX10/takenX10-layouts/releases/tag/0.1.0/layout-build-v0.1.tar
tar -xvf layout-build-v0.1.tar
cd autoinstall

curl https://az764295.vo.msecnd.net/stable/97dec172d3256f8ca4bfb2143f3f76b503ca0534/code_1.74.3-1673284829_amd64.deb
sudo dpkg -i code_1.74.3-1673284829_amd64.deb

cp keybindings.json ~/.config/Code/User/keybindings.json
cp settings.json ~/.config/Code/User/settings.json
cp -rf extensions .vscode/.

xkbcomp -w 0 xkbmap.xkb $DISPLAY
