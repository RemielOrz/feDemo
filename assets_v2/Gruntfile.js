module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            global: {
                options: {
                    base: './',
                    port: 3000,
                    keepalive: true
                }
            }
        }
        ,copy: {
            font:{
                files:[
                    {
                        expand: true,
                        cwd:'css/module/oefont/fonts/',
                        src: ['**'],
                        dest: 'css/fonts/'
                    }
                ]
            }
        }
        ,concat: {
            css:{
                src: [
                    'css/base.css'
                    ,'css/module/oefont/css/oefont.css'
                    ,'css/module/calendar/calendar.css'
                    ,'css/module/modifier/modifier.css'
                    ,'css/module/tabSelection/tabSelection.css'
                    ,'css/module/asideWindow/asideWindow.css'
                    ,'css/app/app.css'
                ],
                dest: 'css/build/app.css'
            }
        }
        ,uglify: {
            options: {
                mangle: true//,
                //banner: '/*!\nauthor: <%= pkg.author %> \ndate: <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            module:{
                files:[{
                    expand: true,
                    cwd: 'js/module/',
                    src: '**/*.js',
                    dest: 'js/dest/'//,
                    //ext: '.min.js'
                }]
            }
            ,libmin:{
                files:[{
                    expand: true,
                    cwd: 'js/lib/',
                    src: '**/*.js',
                    dest: 'js/dest/lib'
                    ,ext: '.min.js'
                }]
            }
        }
        ,
        less: {
            options: {
                compress: true,//false,
                yuicompress: true,//false,
                optimization: 2
            }
            ,app:{
                options: {
                    //paths: ["css/app/"]
                },
                files:{
                    "css/app/app.css":"css/app/app.less"
                }
            }
            ,module:{
                options:{
                    //cleancss: true
                },
                files:[{
                    expand: true,
                    cwd: 'css/module/',
                    src: '**/*.css',
                    dest: 'css/module/'//,
                    //ext: '.min.css'
                }]
            }
        }
        ,requirejs: {
            compile: {
                options: {
                    baseUrl: "js/",
                    //mainConfigFile: "js/app/demo/config.js",
                    paths: {
                        //"_":"./lib/underscore/underscore-min",
                        "$":"./lib/zepto.min",
                        //"lazyload":"./module/lazyload/zepto.lazyload",
                        //"carousel": "./module/carousel/carousel",

                        //"Calendar": "./module/calendar/calendar",
                        //"MsgBox": "./module/msgBox/msgBox",
                        "Menu": "./module/menu/menu",
                        //"DropBox": "./module/dropBox/dropBox",
                        "ITouchMove": "./module/iTouchMove/iTouchMove",
                        "Loading": "./module/loading/loading",
                        //"Modifier": "./module/modifier/modifier",
                        //"TabSelection": "./module/tabSelection/tabSelection",

                        //"trip":"./module/app/trip/trip",

                        "WeixinApi": "./module/WeixinApi/WeixinApi",

                        "OE": "./module/OE"
                    },
                    shim: {
                        "$": {
                            exports: "$"
                        },
                        /*"_": {
                            exports: "_"
                        },
                        "lazyload": ["$"],*/
                        "WeixinApi": {
                            exports: "WeixinApi"
                        }
                    },
                    name: "app/demo/app",
                    out: "js/dest/app/main.js",
                    preserveLicenseComments: false
                }
            }
        }
        ,watch: {
            css: {
                files: 'css/app/app.less',
                tasks: ['less:app','concat:css'],
                options: {
                    debounceDelay: 1000
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
};