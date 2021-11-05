echo "正在打包 "
npm run build
node ./deploy/ssh.js
