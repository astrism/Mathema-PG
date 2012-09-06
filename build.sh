git clone git://github.com/n1k0/casperjs.git
export PHANTOMJS_EXECUTABLE='phantomjs --local-to-remote-url-access=yes --ignore-ssl-errors=yes'
export DISPLAY=:99.0
sh -e /etc/init.d/xvfb start
DISPLAY=:99.0 casperjs/bin/casperjs www/casperjs.js

cd www
npm install grunt
grunt
exit $?