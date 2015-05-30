/**
 * Created by braddavis on 5/6/15.
 */
var fs = require("fs");

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ngconstant: {
            // Options for all targets
            options: {
                space: '  ',
                name: 'globalVars'
            },
            // Environment targets
            dev: {
                options: {
                    dest: './app/js/htsApp.config'
                },
                constants: {
                    ENV: {
                        name: 'development',
                        htsAppUrl: 'http://localhost:8081',
                        postingAPI: 'http://localhost:4043/v1/postings/',
                        userAPI: 'http://localhost:4043/v1/users/',
                        feedbackAPI: 'http://localhost:8081/feedback',
                        freeGeoIp: 'http://localhost:8080/json/',
                        paymentAPI: 'http://localhost:8081/payments',
                        precacheAPI: 'http://localhost:8081/precache',
                        realtimePostingAPI: 'http://localhost:4044/postings',
                        realtimeUserAPI: 'http://localhost:4044/users',
                        groupingsAPI: 'http://localhost:4043/v1/groupings/',
                        annotationsAPI: 'http://localhost:4043/v1/annotations',
                        facebookAuth: 'http://localhost:8081/auth/facebook',
                        twitterAuth: 'http://localhost:8081/auth/twitter',
                        ebayAuth: 'http://localhost:8081/auth/ebay',
                        ebayRuName: 'HashtagSell__In-HashtagS-e6d2-4-sdojf',
                        ebaySignIn: 'https://signin.sandbox.ebay.com/ws/eBayISAPI.dll',
                        fbAppId: '367471540085253'
                    },
                    clientTokenPath: 'http://localhost:8081/payments/client_token'
                }
            },
            stage: {
                options: {
                    dest: './app/js/htsApp.config'
                },
                constants: {
                    ENV: {
                        name: 'staging',
                        htsAppUrl: 'https://staging.hashtagsell.com',
                        postingAPI: 'https://staging-posting-api.hashtagsell.com/v1/postings/',
                        userAPI: 'https://staging-posting-api.hashtagsell.com/v1/users/',
                        feedbackAPI: 'https://staging.hashtagsell.com/feedback',
                        freeGeoIp: 'https://staging-freegeoip.hashtagsell.com/json/',
                        paymentAPI: 'https://staging.hashtagsell.com/payments',
                        precacheAPI: 'https://staging.hashtagsell.com/precache',
                        realtimePostingAPI: 'https://staging-realtime-svc.hashtagsell.com/postings',
                        realtimeUserAPI: 'https://staging-realtime-svc.hashtagsell.com/users',
                        groupingsAPI: 'https://staging-posting-api.hashtagsell.com/v1/groupings/',
                        annotationsAPI: 'https://staging-posting-api.hashtagsell.com/v1/annotations',
                        facebookAuth: 'https://staging.hashtagsell.com/auth/facebook',
                        twitterAuth: 'https://staging.hashtagsell.com/auth/twitter',
                        ebayAuth: 'https://staging.hashtagsell.com/auth/ebay',
                        ebayRuName: 'HashtagSell__In-HashtagS-e6d2-4-sdojf',
                        ebaySignIn: 'https://signin.sandbox.ebay.com/ws/eBayISAPI.dll',
                        fbAppId: '459229800909426'
                    },
                    clientTokenPath: 'https://staging.hashtagsell.com/payments/client_token'
                }
            },
            prod: {
                options: {
                    dest: './app/js/htsApp.config'
                },
                constants: {
                    ENV: {
                        name: 'production',
                        htsAppUrl: 'https://www.hashtagsell.com',
                        postingAPI: 'https://www.hashtagsell.com/v1/postings/',
                        userAPI: 'https://www.hashtagsell.com/v1/users/',
                        feedbackAPI: 'https://www.hashtagsell.com/feedback',
                        freeGeoIp: 'https://wwww.hashtagsell.com/json/',
                        paymentAPI: 'https://www.hashtagsell.com/payments',
                        precacheAPI: 'https://www.hashtagsell.com/precache',
                        realtimePostingAPI: 'https://www.hashtagsell.com:4044/postings',
                        realtimeUserAPI: 'https://www.hashtagsell.com:4044/users',
                        groupingsAPI: 'https://www.hashtagsell.com:4043/v1/groupings/',
                        annotationsAPI: 'https://www.hashtagsell.com:4043/v1/annotations',
                        facebookAuth: 'https://www.hashtagsell.com:8081/auth/facebook',
                        twitterAuth: 'https://www.hashtagsell.com:8081/auth/twitter',
                        ebayAuth: 'https://www.hashtagsell.com:8081/auth/ebay',
                        ebayRuName: 'HashtagSell__In-HashtagS-e6d2-4-sdojf',
                        ebaySignIn: 'https://signin.sandbox.ebay.com/ws/eBayISAPI.dll',
                        fbAppId: '459229800909426'
                    },
                    clientTokenPath: 'https://www.hashtagsell.com/payments/client_token'
                }
            },
            postprod: {
                options: {
                    dest: './app/js/htsApp.config'
                },
                constants: {
                    ENV: {
                        name: 'post-production',
                        htsAppUrl: 'https://www.hashtagsell.com',
                        postingAPI: 'https://www.hashtagsell.com/v1/postings/',
                        userAPI: 'https://www.hashtagsell.com/v1/users/',
                        feedbackAPI: 'https://www.hashtagsell.com/feedback',
                        freeGeoIp: 'https://wwww.hashtagsell.com/json/',
                        paymentAPI: 'https://www.hashtagsell.com/payments',
                        precacheAPI: 'https://www.hashtagsell.com/precache',
                        realtimePostingAPI: 'https://www.hashtagsell.com:4044/postings',
                        realtimeUserAPI: 'https://www.hashtagsell.com:4044/users',
                        groupingsAPI: 'https://www.hashtagsell.com:4043/v1/groupings/',
                        annotationsAPI: 'https://www.hashtagsell.com:4043/v1/annotations',
                        facebookAuth: 'https://www.hashtagsell.com:8081/auth/facebook',
                        twitterAuth: 'https://www.hashtagsell.com:8081/auth/twitter',
                        ebayAuth: 'https://www.hashtagsell.com:8081/auth/ebay',
                        ebayRuName: 'HashtagSell__In-HashtagS-70ae-4-hkrcxmxws',
                        ebaySignIn: 'https://signin.ebay.com/ws/eBayISAPI.dll',
                        fbAppId: '367469320085475'
                    },
                    clientTokenPath: 'https://production.hashtagsell.com/payments/client_token'
                }
            }
        },
        clean: {
            dev: ["tmp"],
            stage: ["tmp"],
            prod: ["tmp"]
        },
        "file-creator": {
            "gitignore": {
                "tmp/.gitignore": function(fs, fd, done) {
                    fs.writeSync(fd, '# Ignore everything in this directory *# Except this file!.gitignore');
                    done();
                }
            }
        },
        //Concat combines all js files in js directory to one file.
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['./app/htsApp.js', './app/js/*.config', './app/js/**/*.js'],
                dest: './app/dist/js/<%= pkg.name %>.js'
            }
        },
        //combine all css into one file
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    './app/dist/css/styles.min.css': ['./app/css/*.css']
                }
            }
        },
        //Validate all js
        jshint: {
            // define the files to lint
            files: ['./gruntfile.js', './app/htsApp.js', './app/js/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                loopfunc: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        //Minify all the Javascript
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    './app/dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'watch'],
                options: {
                    async: true,
                    logConcurrentOutput: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    env: {
                        PORT: '8081',
                        NODE_ENV: 'DEVELOPMENT'
                    },
                    // omit this property if you aren't serving HTML files and
                    // don't want to open a browser tab on start
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        // opens browser on initial server start
                        nodemon.on('config:update', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('open')('http://localhost:8081');
                            }, 1000);
                        });

                        // refreshes browser when server reboots
                        nodemon.on('restart', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted: ' + new Date());
                            }, 1000);
                        });
                    }
                }
            },
            stage: {
                script: 'server.js',
                options: {
                    env: {
                        PORT: '8081',
                        NODE_ENV: 'STAGING'
                    }
                }
            },
            prod: {
                script: 'server.js',
                options: {
                    env: {
                        PORT: '8081',
                        NODE_ENV: 'PRODUCTION'
                    }
                }
            }
        },
        watch: {
            'client-javascript': {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint', 'concat'],
                options: {
                    async: true,
                    livereload: false
                }
            },
            css: {
                files: ['./app/css/*.css'],
                tasks: ['cssmin'],
                options: {
                    livereload: false,
                }
            },
            server: {
                files: ['.rebooted'],
                options: {
                    livereload: false
                }
            }
        },
        shell: {
            //start mongo
            startMongo: {
                command: './shell-scripts/startMongoIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopMongo: {
                command: './shell-scripts/stopMongo.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start freeGeoIp
            startFreeGeoIp: {
                command: './shell-scripts/startFreeGeoIpIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopFreeGeoIp: {
                command: './shell-scripts/stopFreeGeoIp.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start postingAPI
            startPostingApi: {
                command: './shell-scripts/startPostingApiIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start postingAPI
            stopPostingApi: {
                command: './shell-scripts/stopPostingApi.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start prerender.io local service
            startPrerenderServer: {
                command: './shell-scripts/startPrerenderIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopPrerenderServer: {
                command: './shell-scripts/stopPrerender.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start realtime-svc api
            startRealTimeApi: {
                command: './shell-scripts/startRealTimeApiIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopRealTimeApi: {
                command: './shell-scripts/stopRealTimeApi.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start posting ingestion
            startSync: {
                command: './shell-scripts/startSyncAgentIfNotRunning.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopSync: {
                command: './shell-scripts/stopSyncAgent.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            options: {
                stdout: true,
                stderr: true,
                failOnError: true
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-file-creator');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-services');



    //Starts ingest agent on local machine
    grunt.registerTask('start-local-ingest', ['shell:startMongo', 'shell:startPostingApi', 'shell:startSync', 'shell:startRealTimeApi']);
    //Stops ingest agent on local machine
    grunt.registerTask('stop-local-ingest', ['shell:stopMongo', 'shell:stopPostingApi', 'shell:stopSync', 'shell:stopRealTimeApi']);



    //START htsApp in DEV local host.  THIS STARTS ALL APIS LOCALLY ON YOUR MACHINE
    grunt.registerTask('start-dev', ['clean:dev', 'file-creator:gitignore', 'ngconstant:dev', 'jshint', 'concat', 'uglify', 'cssmin', 'shell:startMongo', 'shell:startFreeGeoIp', 'shell:startPostingApi', 'shell:startPrerenderServer', 'shell:startRealTimeApi', 'concurrent:dev']);

    //STOP htsApp in DEV local host.  THIS STARTS ALL APIS LOCALLY ON YOUR MACHINE
    grunt.registerTask('stop-dev', ['shell:stopMongo', 'shell:stopFreeGeoIp', 'shell:stopPostingApi', 'shell:stopPrerenderServer', 'shell:stopRealTimeApi']);



    //START htsApp in STAGING ENV.  HTTPS://STAGING.HASHTAGSELL.COM
    grunt.registerTask('build-htsApp-staging', ['clean:stage', 'file-creator:gitignore', 'ngconstant:stage', 'jshint', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('start-htsApp-staging', 'nodemon:stage');



    //TODO: Use grunt include to add single concatonated css and js file to index.html
    //TODO: Update robot.txt file to allow all user-agents in production
    //START htsApp in PRODUCTION ENV.  HTTPS://WWW.HASHTAGSELL.COM
    grunt.registerTask('build-htsApp-prod', ['clean:prod', 'file-creator:gitignore', 'ngconstant:prod', 'jshint', 'concat', 'uglify', 'cssmin']);
    grunt.registerTask('start-htsApp-prod', 'nodemon:prod');

};