![Screen](https://i.imgur.com/ELN6RAX.png)



# Clone git Repo

    git clone https://github.com/0i0/geektoolio.git && cd geektoolio

# Install from shell script

	install_geektoolio.sh

# Install geekTool

Download GeekTool from https://www.tynsoe.org/v2/geektool/

# Open the geeklet

geektoolio.glet



# Or install by yourself

# Install Brew
		
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Install nodejs

    brew install nodejs

# Install Dependencies for node app

Navigate to geektoolio folder

    npm install

# Run the node app

	node app.js

# Set auto start (if you want)
 
	cat com.liorhakim.geektoolio-template.plist | awk -v P="$(pwd)" '{gsub(/pwd/,P,$0); print}' > com.liorhakim.geektoolio.plist
	sudo cp com.liorhakim.geektoolio.plist /Library/LaunchDaemons/com.liorhakim.geektoolio.plist
	sudo chown root:wheel /Library/LaunchDaemons/com.liorhakim.geektoolio.plist
	sudo launchctl load  /Library/LaunchDaemons/com.liorhakim.geektoolio.plist
	dir=$(pwd);echo "setenv PATH $PATH:$dir"|sudo tee -a /etc/launchd.conf

If you enjoyed please consider tipping me @

Bitcoin 142jKB3e9uC8sSmssKtp5NtWScarZdYpuH

Ethereum ​0x8423b2cA48Bd9a734B4FE27A4E78f64e12131B79​
