echo "checking for dependencies..."

if ! location="$(type -p "brew")" || [ -z "brew" ]; then
	echo "installing brew"
	ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  else
  	echo "brew is already installed. Proceeding..."
fi

echo "installing nowplaying dependencies"

if ! exist="$(gem list bundler -i)" ;then
	echo "installing bundler "
	sudo gem install bundler
  else
  	echo "bundler is already installed. Proceeding..."
fi

echo "installing gem dependencies..."
bundle install

if ! location="$(type -p "node")" || [ -z "node" ]; then
	echo "installing nodejs"
	brew install nodejs
  else
  	echo "nodejs is already installed. Proceeding..."
fi

echo "installing npm dependencies"

npm install

while true; do
    read -p "would you like me to start geektoolio server on startup?" yn
    case $yn in
        [Yy]* ) echo "setting up launcDeamond...";
				cat com.liorhakim.geektoolio-template.plist | awk -v P="$(pwd)" '{gsub(/pwd/,P,$0); print}' > com.liorhakim.geektoolio.plist
				sudo cp com.liorhakim.geektoolio.plist /Library/LaunchDaemons/com.liorhakim.geektoolio.plist
				sudo chown root:wheel /Library/LaunchDaemons/com.liorhakim.geektoolio.plist
				sudo launchctl load  /Library/LaunchDaemons/com.liorhakim.geektoolio.plist
				dir=$(pwd);echo "setenv PATH $PATH:$dir"|sudo tee -a /etc/launchd.conf
				break;;
        [Nn]* ) echo "bailing on autostart and proceeding..."
				break;;
        * ) echo "Please answer yes or no.";;
    esac
done


echo "starting node app..."

node app.js