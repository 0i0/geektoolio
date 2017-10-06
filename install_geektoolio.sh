echo "checking for dependencies..."
if ! location="$(type -p "brew")" || [ -z "brew" ]; then
	echo "installing brew"
	ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  else
  	echo "brew is already installed. Proceeding..."
fi
if ! location="$(type -p "node")" || [ -z "node" ]; then
	echo "installing nodejs"
	brew install nodejs
  else
  	echo "nodejs is already installed. Proceeding..."
fi
echo "installing npm dependencies"
npm install
if ! location="$(type -p "iStats")" || [ -z "iStats" ]; then
	echo "installing iStats"
	gem install iStats
  else
  	echo "iStats is already installed. Proceeding..."
fi
echo "starting node app..."
node app.js
