
wget https://cdn.jsdelivr.net/npm/takenx10-layouts@1.5.0/xkbmap.xkb
xkbcomp -w 0 xkbmap.xkb $DISPLAY

wget https://az764295.vo.msecnd.net/stable/97dec172d3256f8ca4bfb2143f3f76b503ca0534/code-stable-x64-1673285154.tar.gz
tar -xzvf code-stable-x64-1673285154.tar.gz
cd VSCode-linux-x64
mkdir data
./code
