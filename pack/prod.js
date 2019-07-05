const Bundler = require('parcel-bundler');
const path = require('path');
const os = require('os');
const child = require('child_process');
const { config } = require('./config');

const type = os.type();
const parttern = /window/ig;
const isWindow = parttern.test(type);

// 入口文件路径
const rootPath = path.resolve(__dirname, '..');
const file = path.join(rootPath, 'index.html');
const dist = path.join(rootPath, 'dist');

const clearUp = isWindow ? 'rd /s/q ' + dist : 'rm -rf ' + dist;

child.exec(clearUp, function() {
    console.log('clear up dist');
});

// 使用提供的入口文件路径和选项初始化 bundler
const bundler = new Bundler(file, config);
bundler.bundle();

bundler.on('buildEnd', () => {
    if (isWindow) {
        const md = 'md ' + path.join(dist, 'static');
        child.exec(md);
    }
    const copy = isWindow ? 'xcopy ' + path.join(rootPath, 'static') + ' /s ' + path.join(dist, 'static') : 'cp -R' + path.join(rootPath, 'static') + path.join(dist, 'static');
    child.exec(copy, function() {
        console.log('copy static');
        process.exit();
    });
});
