set -x
npm run build
set +x

set -x
npm start &
sleep 1
echo $! > .pidfile
set +x

echo 'Aplikacija je pokrenuta'

set -x
kill $(cat .pidfile)

exho 'Aplikacija je zatvorena'
