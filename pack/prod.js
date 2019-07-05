const Bundler = require('parcel-bundler');
const path = require('path');
const child = require('child_process');
const { config } = require('./config');

// 入口文件路径
const rootPath = path.resolve(__dirname, '..');
const file = path.join(rootPath, 'index.html');
const dist = path.join(rootPath, 'dist');

child.exec('rd /s/q ' + dist, function() {
    console.log('clear up dist');
});


// 使用提供的入口文件路径和选项初始化 bundler
const bundler = new Bundler(file, config);
bundler.bundle();

bundler.on('buildEnd', () => {
    child.exec('md ' + path.join(dist, 'static'));
    child.exec('xcopy ' + path.join(rootPath, 'static') + ' /s ' + path.join(dist, 'static'), function() {
        console.log('copy static');
        process.exit();
    });
});
