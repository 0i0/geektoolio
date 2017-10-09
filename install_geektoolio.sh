#!/usr/bin/env bash

set -e
dir="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
user="$(id -u -nr)"

echo "checking for dependencies..."

if ! command -v brew 2>&1 > /dev/null; then
  echo "installing brew"
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
  echo "brew is already installed. Proceeding..."
fi

echo "installing nowplaying dependencies"

if ! gem list bundler -i 2>&1 /dev/null; then
  echo "installing bundler "
  sudo gem install bundler
else
  echo "bundler is already installed. Proceeding..."
fi

echo "installing gem dependencies..."
bundle install

if ! command -v node 2>&1 > /dev/null; then
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
    [Yy]*) echo "setting up launcDeamond...";
      sed -e "s~user~$user~;s~pwd~$dir~" < com.liorhakim.geektoolio-template.plist > com.liorhakim.geektoolio.plist
      sudo cp com.liorhakim.geektoolio.plist /Library/LaunchDaemons/com.liorhakim.geektoolio.plist
      sudo chown root:wheel /Library/LaunchDaemons/com.liorhakim.geektoolio.plist
      sudo launchctl load  /Library/LaunchDaemons/com.liorhakim.geektoolio.plist
      echo "setenv PATH $PATH:$dir" | sudo tee -a /etc/launchd.conf
      break;;
    [Nn]*) echo "bailing on autostart and proceeding..."
      break;;
    *) echo "Please answer yes or no.";;
  esac
done


echo "starting node app..."

node app.js
