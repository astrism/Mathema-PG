cd www
git clone git://github.com/n1k0/casperjs.git
cd casperjs
git checkout tags/1.0.0-RC1
ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs
npm install grunt
grunt
exit $?