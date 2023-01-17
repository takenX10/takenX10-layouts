
echo """
wget https://github.com/takenX10/takenX10-layouts/releases/download/0.1.0/layout-build-v0.1.tar
tar -xzvf layout-build-v0.1.tar
xkbcomp -w 0 autoinstall/xkbmap.xkb $DISPLAY

cp autoinstall/keybindings.json data/user-data/keybindings.json
cp autoinstall/settings.json data/user-data/settings.json
cp -rf autoinstall/extensions data/extensions

""" > part2.sh

chmod +x part2.sh

wget https://az764295.vo.msecnd.net/stable/97dec172d3256f8ca4bfb2143f3f76b503ca0534/code-stable-x64-1673285154.tar.gz
tar -xzvf code-stable-x64-1673285154.tar.gz
cd VSCode-linux-x64
mkdir data
./code
