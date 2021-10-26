# takenX10 Layouts

This is a repository where I store my layouts
### Index
- [Images](#Images)
- [Windows layouts](#Windows-Layouts)
	- [Tools](#Tools)
	- [Custom Programmer Dvorak](#Custom-Programmer-Dvorak-(WIN))
	- [Extend](#Extend)
- [Linux layouts](#Linux-Layouts)
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
### Custom Programmer Dvorak (WIN)
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

### Extend
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