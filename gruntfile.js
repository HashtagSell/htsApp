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
                    dest: './app/dist/dev/dev.config'
                },
                constants: {
                    ENV: {
                        name: 'development',
                        htsAppUrl: 'http://localhost:8081',
                        postingAPI: 'http://localhost:8081/v1/postings/',
                        userAPI: 'http://localhost:8081/v1/users/',
                        utilsApi: 'http://localhost:8081/utils/',
                        realtimePostingAPI: 'http://localhost:8082/postings',
                        realtimeUserAPI: 'http://localhost:8082/users',
                        groupingsAPI: 'http://localhost:8081/v1/groupings/',
                        annotationsAPI: 'http://localhost:8081/v1/annotations',
                        feedbackAPI: 'http://localhost:8081/feedback',
                        paymentAPI: 'http://localhost:8081/payments',
                        notificationAPI: 'http://localhost:8081/v1/queues',
                        precacheAPI: 'http://localhost:8081/precache',
                        facebookAuth: 'http://localhost:8081/auth/facebook',
                        transactionsAPI: 'http://localhost:8081/v1/transactions/',
                        reviewsAPI: 'http://localhost:8081/v1/reviews/',
                        twitterAuth: 'http://localhost:8081/auth/twitter',
                        ebayAuth: 'http://localhost:8081/auth/ebay',
                        ebayRuName: 'HashtagSell__In-HashtagS-e6d2-4-sdojf',
                        ebaySignIn: 'https://signin.sandbox.ebay.com/ws/eBayISAPI.dll',
                        fbAppId: '367471540085253',
                        extensionId: 'mkmbbnhbbnijlenfebjdmcibglbnajfg',
                        extensionVersion: '0.4',
                        extensionInstallationUrl: 'https://chrome.google.com/webstore/detail/ndhgbcgocbakghhnbbdamfpebkfnpkhl'
                    },
                    clientTokenPath: 'http://localhost:8081/payments/client_token'
                }
            },
            stage: {
                options: {
                    dest: './app/dist/stage/stage.config'
                },
                constants: {
                    ENV: {
                        name: 'staging',
                        htsAppUrl: 'https://staging.hashtagsell.com',
                        postingAPI: 'https://staging.hashtagsell.com/v1/postings/',
                        userAPI: 'https://staging.hashtagsell.com/v1/users/',
                        utilsApi: 'https://staging.hashtagsell.com/utils/',
                        realtimePostingAPI: 'https://staging-realtime-svc.hashtagsell.com/postings',
                        realtimeUserAPI: 'https://staging-realtime-svc.hashtagsell.com/users',
                        groupingsAPI: 'https://staging.hashtagsell.com/v1/groupings/',
                        annotationsAPI: 'https://staging.hashtagsell.com/v1/annotations',
                        feedbackAPI: 'https://staging.hashtagsell.com/feedback',
                        paymentAPI: 'https://staging.hashtagsell.com/payments',
                        notificationAPI: 'https://staging.hashtagsell.com/v1/queues',
                        precacheAPI: 'https://staging.hashtagsell.com/precache',
                        facebookAuth: 'https://staging.hashtagsell.com/auth/facebook',
                        transactionsAPI: 'https://staging.hashtagsell.com/v1/transactions/',
                        reviewsAPI: 'https://staging.hashtagsell.com/v1/reviews/',
                        twitterAuth: 'https://staging.hashtagsell.com/auth/twitter',
                        ebayAuth: 'https://staging.hashtagsell.com/auth/ebay',
                        ebayRuName: 'HashtagSell__In-HashtagS-e6d2-4-sdojf',
                        ebaySignIn: 'https://signin.sandbox.ebay.com/ws/eBayISAPI.dll',
                        fbAppId: '459229800909426',
                        extensionId: 'ndhgbcgocbakghhnbbdamfpebkfnpkhl',
                        extensionVersion: '0.4',
                        extensionInstallationUrl: 'https://chrome.google.com/webstore/detail/ndhgbcgocbakghhnbbdamfpebkfnpkhl'
                    },
                    clientTokenPath: 'https://staging.hashtagsell.com/payments/client_token'
                }
            },
            prod: {
                options: {
                    dest: './app/dist/prod/prod.config'
                },
                constants: {
                    ENV: {
                        name: 'production',
                        htsAppUrl: 'https://www.hashtagsell.com',
                        postingAPI: 'https://production-posting-api.hashtagsell.com/v1/postings/',
                        userAPI: 'https://production-posting-api.hashtagsell.com/v1/users/',
                        utilsApi: 'https://www.hashtagsell.com/utils/',
                        realtimePostingAPI: 'https://production-realtime-svc.hashtagsell.com/postings',
                        realtimeUserAPI: 'https://production-realtime-svc.hashtagsell.com/users',
                        groupingsAPI: 'https://production-posting-api.hashtagsell.com/v1/groupings/',
                        annotationsAPI: 'https://production-posting-api.hashtagsell.com/v1/annotations',
                        feedbackAPI: 'https://www.hashtagsell.com/feedback',
                        paymentAPI: 'https://www.hashtagsell.com/payments',
                        notificationAPI: 'http://production-notification-svc.hashtagsell.com/v1/queues',
                        precacheAPI: 'https://www.hashtagsell.com/precache',
                        facebookAuth: 'https://www.hashtagsell.com/auth/facebook',
                        transactionsAPI: 'https://www.hashtagsell.com/v1/transactions/',
                        reviewsAPI: 'https://www.hashtagsell.com/v1/reviews/',
                        twitterAuth: 'https://www.hashtagsell.com/auth/twitter',
                        ebayAuth: 'https://www.hashtagsell.com/auth/ebay',
                        ebayRuName: 'HashtagSell__In-HashtagS-70ae-4-hkrcxmxws',
                        ebaySignIn: 'https://signin.ebay.com/ws/eBayISAPI.dll',
                        fbAppId: '367469320085475',
                        extensionId: 'ndhgbcgocbakghhnbbdamfpebkfnpkhl',
                        extensionVersion: '0.4',
                        extensionInstallationUrl: 'https://chrome.google.com/webstore/detail/ndhgbcgocbakghhnbbdamfpebkfnpkhl'
                    },
                    clientTokenPath: 'https://www.hashtagsell.com/payments/client_token'
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
        //combine all css into one file
        cssmin: {
            dev: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                files: {
                    './app/dist/dev/css/styles.min.css': ['./app/src/css/*.css']
                }
            },
            stage: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                files: {
                    './app/dist/stage/css/styles.min.css': ['./app/src/css/*.css']
                }
            },
            prod: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                files: {
                    './app/dist/prod/css/styles.min.css': ['./app/src/css/*.css']
                }
            }
        },
        //Combine all javascript files into one file and ensure that angular injections is handled properly.
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dev: {
                files: {
                    './app/dist/dev/js/<%= pkg.name %>.annotated.js': ['./app/src/htsApp.js', './app/dist/dev/dev.config', './app/src/js/**/*.js']
                }
            },
            stage: {
                files: {
                    './app/dist/stage/js/<%= pkg.name %>.annotated.js': ['./app/src/htsApp.js', './app/dist/stage/stage.config', './app/src/js/**/*.js']
                }
            },
            prod: {
                files: {
                    './app/dist/prod/js/<%= pkg.name %>.annotated.js': ['./app/src/htsApp.js', './app/dist/prod/prod.config', './app/src/js/**/*.js']
                }
            }
        },
        //Validate all js
        jshint: {
            // define the files to lint
            files: ['./gruntfile.js', './app/src/htsApp.js', './app/src/js/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
                loopfunc: true,
                boss: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        //combine all html files into angular $templateCache! nice!
        ngtemplates:  {
            dev: {
                cwd: 'app/src',
                src: 'js/**/*.html',
                dest: './app/dist/dev/js/<%= pkg.name %>.annotated.js',
                options: {
                    module:  'htsApp',
                    append: true
                }
            },
            stage: {
                cwd: 'app/src',
                src: 'js/**/*.html',
                dest: './app/dist/stage/js/<%= pkg.name %>.annotated.js',
                options: {
                    module:  'htsApp',
                    append: true
                }
            },
            prod: {
                cwd: 'app/src',
                src: 'js/**/*.html',
                dest: './app/dist/prod/js/<%= pkg.name %>.annotated.js',
                options: {
                    module:  'htsApp',
                    append: true
                }
            }
        },
        robotstxt: {
            stage: {
                dest: './app/dist/stage/',
                policy: [
                    {
                        ua: '*',
                        disallow: '/'
                    }
                ]
            },
            prod: {
                dest: './app/dist/prod/',
                policy: [
                    {
                        ua: '*',
                        allow: '/'
                    },
                    {
                        crawldelay: 100
                    },
                    {
                        host: 'https://www.hashtagsell.com'
                    }
                ]
            }
        },
        //Minify all the Javascript
        uglify: {
            stage: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                files: {
                    './app/dist/stage/js/<%= pkg.name %>.min.js': ['./app/dist/stage/js/<%= pkg.name %>.annotated.js']
                }
            },
            prod: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    './app/dist/prod/js/<%= pkg.name %>.min.js': ['./app/dist/prod/js/<%= pkg.name %>.annotated.js']
                }
            }
        },
        //pre-compile html to include appropriate javascript build files.
        targethtml: {
            dev: {
                files: {
                    './app/dist/dev/dev_index.html': './app/src/index.html'
                }
            },
            stage: {
                files: {
                    './app/dist/stage/stage_index.html': './app/src/index.html'
                }
            },
            prod: {
                files: {
                    './app/dist/prod/prod_index.html': './app/src/index.html'
                }
            }
        },
        //Watch all dev files and recompile upon changes
        concurrent: {
            tasks: ['nodemon:dev', 'watch'],
            options: {
                async: true,
                logConcurrentOutput: true
            }
        },
        //Watch all dev files and recompile upon changes
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
                tasks: ['jshint', 'ngAnnotate:dev', 'ngtemplates:dev'],
                options: {
                    async: true,
                    livereload: true
                }
            },
            css: {
                files: ['./app/src/css/*.css'],
                tasks: ['cssmin:dev'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['./app/src/index.html'],
                tasks: ['targethtml:dev'],
                options: {
                    livereload: true
                }
            },
            partials: {
                files: ['./app/src/js/**/*.html'],
                tasks: ['ngAnnotate:dev', 'ngtemplates:dev', 'targethtml:dev'],
                options: {
                    async: true,
                    livereload: true
                }
            },
            server: {
                files: ['.rebooted'],
                options: {
                    livereload: false
                }
            }
        },
        //shell scripts start all necessary APIs when running application locally in dev
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
            startNotificationApi: {
                command: './shell-scripts/startNotificationApiIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopNotificationApi: {
                command: './shell-scripts/stopNotificationApi.sh',
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
    grunt.loadNpmTasks('grunt-targethtml');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-robots-txt');
    grunt.loadNpmTasks('grunt-angular-templates');


    //Starts ingest agent on local machine
    grunt.registerTask('start-local-ingest', ['shell:startMongo', 'shell:startPostingApi', 'shell:startSync', 'shell:startRealTimeApi']);
    //Stops ingest agent on local machine
    grunt.registerTask('stop-local-ingest', ['shell:stopMongo', 'shell:stopPostingApi', 'shell:stopSync', 'shell:stopRealTimeApi']);



    //START htsApp in DEV local host.  THIS STARTS ALL APIS LOCALLY ON YOUR MACHINE
    grunt.registerTask('start', 'Run htsApp locally with all api dependencies', function () {
        grunt.task.run(['build-htsApp-dev', 'shell:startMongo', 'shell:startFreeGeoIp', 'shell:startPostingApi', 'shell:startPrerenderServer', 'shell:startRealTimeApi', 'concurrent']);
    });

    //STOP htsApp in DEV local host.  THIS STARTS ALL APIS LOCALLY ON YOUR MACHINE
    grunt.registerTask('stop', ['shell:stopMongo', 'shell:stopFreeGeoIp', 'shell:stopPostingApi', 'shell:stopPrerenderServer', 'shell:stopRealTimeApi', 'shell:stopNotificationApi']);


    grunt.registerTask('build-htsApp-dev', ['clean:dev', 'file-creator:gitignore', 'ngconstant:dev', 'jshint', 'ngAnnotate:dev', 'ngtemplates:dev', 'cssmin:dev', 'targethtml:dev']);
    grunt.registerTask('build-htsApp-stage', ['clean:stage', 'file-creator:gitignore', 'ngconstant:stage', 'jshint', 'ngAnnotate:stage', 'ngtemplates:stage', 'uglify:stage', 'cssmin:stage', 'targethtml:stage', 'robotstxt:stage']);
    grunt.registerTask('build-htsApp-prod', ['clean:prod', 'file-creator:gitignore', 'ngconstant:prod', 'jshint', 'ngAnnotate:prod', 'ngtemplates:prod', 'uglify:prod', 'cssmin:prod', 'targethtml:prod', 'robotstxt:prod']);


    //Run all build tasks
    grunt.registerTask('build', 'Create all builds and store in app/dist directory', function () {
        grunt.task.run(['build-htsApp-stage', 'build-htsApp-prod']);
    });



    //TODO: Update robot.txt file to allow all user-agents in production
    grunt.registerTask('start-htsApp-staging', 'nodemon:stage');
    grunt.registerTask('start-htsApp-prod', 'nodemon:prod');

};