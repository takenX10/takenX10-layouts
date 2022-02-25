
<!-- omit in toc -->
# takenX10 Layouts
This is a repository where I store my layouts

<!-- omit in toc -->
### Index
- [Images](#images)
	- [Custom Programmer Dvorak no shift](#custom-programmer-dvorak-no-shift)
	- [Custom Programmer Dvorak shift](#custom-programmer-dvorak-shift)
	- [Extend Layer Standard](#extend-layer-standard)
- [Windows Layouts](#windows-layouts)
	- [Tools](#tools)
	- [Custom Programmer Dvorak Windows](#custom-programmer-dvorak-windows)
	- [Extend Windows](#extend-windows)
- [Linux layouts](#linux-layouts)
 	- [Keyboard repeat rate](#keyboard-repeat-rate)
	- [Extend Linux](#extend-linux)
		- [Default installation](#default-installation)
		- [Canc and backspace](#canc-and-backspace)
		- [VSCode and Extend](#vscode-and-extend)
		- [Running the extend command on startup](#running-the-extend-command-on-startup)
	- [Custom Dvorak programmer linux](#custom-dvorak-programmer-linux)
		- [Default installation](#default-installation-1)
		- [Apply custom dvorak permanently](#apply-custom-dvorak-permanently)
		- [Switch between layouts](#switch-between-layouts)
		- [Apply Gnome settings to i3](#apply-gnome-settings-to-i3)
## Images

### Custom Programmer Dvorak no shift
![Custom Dvorak no_shift](https://github.com/takenX10/takenX10_Layouts/raw/main/Images/DvpAle.jpg)

### Custom Programmer Dvorak shift
![Custom Dvorak shift](https://github.com/takenX10/takenX10_Layouts/raw/main/Images/DvpAleShift.jpg)

### Extend Layer Standard
![Custom Dvorak shift](https://github.com/takenX10/takenX10_Layouts/raw/main/Images/extend_layer_std.png)

## Windows Layouts
All the source codes and layouts are located in `/windows`
### Tools
- To use the **extend keyboard layout** you'll need to download [AutoHotKey](https://www.autohotkey.com/download/) (If the link doesn't work just search it online), it's a tool to automate keybindings.
### Custom Programmer Dvorak Windows
> [Layout noshift Image](#Custom-Programmer-Dvorak-no-shift) [Layout shift Image](#Custom-Programmer-Dvorak-shift)

> Source files are generated using the tool [Microsoft Keyboard Layout Creator](https://www.microsoft.com/en-us/download/details.aspx?id=102134)

Source files are located in `/windows/dvpale`.
You just need tu run `DvpAle_*.msi` (Its one of the three executable files amd64, i386 or ia64, it depends on the machine where its executed. BTW usually its amd64), then:
**On Win10**
- Settings > Language
- If you don't have English (American), Add it
- English (American) > edit
- Add keyboard > `Americano- Dvorak_ale` 

Then you can switch between layouts using `WIN + SPACE`, if it doesn't work go to:
- Settings > Language > Keyboard
- Select `Use language list`

Then it should switch between layouts
If it still doesn't work try to restart the pc.

### Extend Windows
> Remember to download [AutoHotKey](https://www.autohotkey.com/download/)

> [Layer Image](#Extend-Layer-Standard)


I found this script in [this repo](https://github.com/stevep99/keyboard-tweaks/tree/master/ExtendLayer), so thanks to stevep99.
I already edited the file, removing the `;` (removed the comment) in the lines 8 and 9, so instead of:
```
; #InputLevel 1
; CapsLock::F22
```
I have
```
#InputLevel 1
CapsLock::F22
```
If you want to use another extend layer just remember to edit those lines.

Try to run the script with AutoHotKey, if they link together you can move the script file or a link to the script file in the auto run folder, otherwise just run it whenever you need it. (auto run folder: `%appdata%\Microsoft\Windows\Start Menu\Programs\Startup`)
## Linux layouts
### Keyboard repeat rate
```bash
gsettings set org.gnome.desktop.peripherals.keyboard delay 150
gsettings set org.gnome.desktop.peripherals.keyboard repeat-interval 30
```
### Extend Linux
#### Default installation
To install extend you need to download the BigBagOfTricks from Dreymar and apply the extend layer with setxkb.
- Clone the BigBagOfTricks repository
```bash
git clone https://github.com/DreymaR/BigBagKbdTrixXKB.git
```
- cd inside the new directory
```bash
cd BigBagKbdTrixXKB
```

- make the installer executable
```bash
chmod +x install-dreymar-xmod.sh
```

- run the installer
```bash
sudo ./install-dreymar-xmod.sh
```
***WARNING: All your xkb files will be moved elsewere, so if you already modified something there you should back everything up before launching the installer.***

To apply all the changes you should run this command

```bash
setxkbmap -v 9 -option "" -option "misc:extend,lv5:caps_switch_lock,compose:menu"
```
#### Canc and backspace
The BigBagOfTricks extend layer has the canc and backspace buttons inverted, so to invert them you need to modify the extend xkb config file. I already created a fixed version for you, to install it just run the `invert_canc_backspace.sh` script inside the linux folder in my repository.
```bash
sudo ./invert_canc_backspace.sh
``` 

#### VSCode and Extend
There is a small bug on vscode that makes extend work strangely. when you press the extend layer ctrl button (CAPS+F on qwerty)
it behaves in a particular way and sends both the ctrl input and the ctrl+f input. I still don't know the solution, but I found a small fix, you can just unbind ctrl+f from the vscode shortcut json and it will fix the problem (tho obviously you can't find things directly). I use dvorak, and the key I had to unbind is ctrl+u, it is pretty useless so I just unbinded ctrl+u to use my extend ctrl and left the problem unsolved.  

To unbind ctrl+f/ctrl+u 
- press ctrl+shift+p inside vscode
- Search for `Open Keyboard Shortcut (JSON)` (NOT THE DEFAULT ONE) 
- This is my configuration (I use dvorak so you should insert ctrl+f instead of ctrl+u)
```json
// Place your key bindings in this file to override the defaults
[
    { "key": "ctrl+u", "command": "", "when": "" }
]
```

#### Running the extend command on startup
I use a window manager called i3wm, so I just added this line to the end of the file `~/.config/i3/config`

```
exec_always --no-startup-id setxkbmap -v 9 -option "" -option "misc:extend,lv5:caps_switch_lock,compose:menu"
```

once you do that try to restart the config with `$mod+shift+r` and it should apply the changes.

### Custom Dvorak programmer linux
#### Default installation
Linux has the default dvorak programmer layout installed, it can be activated with the command
```bash
setxkbmap -layout us -variant dvp
```
But I use a modified version of it, to replace the default one you need to replace the file `/usr/share/X11/xkb/symbols/us` with my custom one. I created a script to do that automatically, just run my script

```bash
sudo ./linux/install_custom_dvorak.sh
```

***WARNING: When you run the script the file `/usr/share/X11/xkb/symbols/us` will be overwritten, so back it up if you have modified it.***

Then to set the layout you can use setxkbmap as I have written below
```bash
setxkbmap -layout us -variant dvp
```

#### Apply custom dvorak permanently
I used gnome settings:
-  `gnome-control-center`
- `Keyboard > + > English(programmer Dvorak)`
- Drag the new language icon to the top (before your default one)

#### Switch between layouts
If you want a quick way to switch between your layouts, when you add the second layout with gnome you can just press `SUPER+SPACE` and it will toggle between the layouts you added. 

#### Apply Gnome settings to i3
I used a fork of the [i3-gnome](https://github.com/i3-gnome/i3-gnome) project called [i3-gnome-flashback](https://github.com/regolith-linux/i3-gnome-flashback). To use it:

- clone the repo 
```bash
git clone https://github.com/regolith-linux/i3-gnome-flashback.git
```
- cd inside the repo folder 
```bash
cd i3-gnome-flashback
```
- install some packages:
```bash
sudo apt install i3 gnome-flashback build-essential
```
- build the repo
```bash
sudo make install
```

Now when you log out you should choose `GNOME flashback(i3)` project.
