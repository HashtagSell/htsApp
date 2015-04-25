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
            development: {
                options: {
                    dest: './app/js/htsApp.config'
                },
                constants: {
                    ENV: {
                        name: 'development',
                        htsAppUrl: 'http://localhost:8081',
                        postingAPI: 'http://localhost:4043/v1/postings/',
                        userAPI: 'http://localhost:4043/v1/users/',
                        realtimePostingAPI: 'http://localhost:4044/postings',
                        realtimeUserAPI: 'http://localhost:4044/users',
                        syncAgentAPI: 'http://localhost:8881',
                        groupingsAPI: 'http://localhost:4043/v1/groupings/',
                        annotationsAPI: 'http://localhost:4043/v1/annotations',
                        facebookAuth: 'http://localhost:8081/auth/facebook',
                        twitterAuth: 'http://localhost:8081/auth/twitter',
                        ebayAuth: 'http://localhost:8081/auth/ebay',
                        ebayRuName: 'HashtagSell__In-HashtagS-e6d2-4-sdojf',
                        ebaySignIn: 'https://signin.sandbox.ebay.com/ws/eBayISAPI.dll',
                        fbAppId: '367471540085253'
                    }
                }
            },
            production: {
                options: {
                    dest: './app/js/htsApp.config'
                },
                constants: {
                    ENV: {
                        name: 'production',
                        htsAppUrl: 'https://www.hashtagsell.com',
                        postingAPI: 'http://localhost:4043/v1/postings/',
                        userAPI: 'http://localhost:4043/v1/users/',
                        realtimePostingAPI: 'http://localhost:4044/postings',
                        realtimeUserAPI: 'http://localhost:4044/users',
                        syncAgentAPI: 'http://localhost:8881',
                        groupingsAPI: 'http://localhost:4043/v1/groupings/',
                        annotationsAPI: 'http://localhost:4043/v1/annotations',
                        facebookAuth: 'http://localhost:8081/auth/facebook',
                        twitterAuth: 'http://localhost:8081/auth/twitter',
                        ebayAuth: 'http://localhost:8081/auth/ebay',
                        ebayRuName: 'HashtagSell__In-HashtagS-70ae-4-hkrcxmxws',
                        ebaySignIn: 'https://signin.ebay.com/ws/eBayISAPI.dll',
                        fbAppId: '367469320085475'
                    }
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
            files: ['./gruntfile.js', './app/htsApp.js', './app/js/*.config', './app/js/**/*.js'],
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
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                watch: ['./api/**/*.js', './config/**/*.js', './utils/**/*.js', './views/**/*.js'],
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
            }
        },
        watch: {
            'client-javascript': {
                files: ['<%= jshint.files %>'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            server: {
                files: ['.rebooted'],
                options: {
                    livereload: true
                }
            }
        },
        shell: {
            //start mongo
            startMongo: {
                command: './startMongoIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopMongo: {
                command: './stopMongo.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start freeGeoIp
            startFreeGeoIp: {
                command: './startFreeGeoIpIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopFreeGeoIp: {
                command: './stopFreeGeoIp.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start postingAPI
            startPostingApi: {
                command: './startPostingApiIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start postingAPI
            stopPostingApi: {
                command: './stopPostingApi.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start prerender.io local service
            startPrerenderServer: {
                command: './startPrerenderIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopPrerenderServer: {
                command: './stopPrerender.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start realtime-svc api
            startRealTimeApi: {
                command: './startRealTimeApiIfNotRunning.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopRealTimeApi: {
                command: './stopRealTimeApi.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            //start posting ingestion
            startSync: {
                command: './startSyncAgentIfNotRunning.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            stopSync: {
                command: './stopSyncAgent.sh',
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
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-services');


    grunt.registerTask('start-ingest', function (target) {
        return grunt.task.run(['shell:startMongo', 'shell:startPostingApi', 'shell:startSync', 'shell:startRealTimeApi']);
    });
    grunt.registerTask('stop-ingest', function (target) {
        return grunt.task.run(['shell:stopMongo', 'shell:stopPostingApi', 'shell:stopSync', 'shell:stopRealTimeApi']);
    });





    grunt.registerTask('start-api', function (target) {
        return grunt.task.run(['shell:startMongo', 'shell:startFreeGeoIp', 'shell:startPostingApi', 'shell:startPrerenderServer', 'shell:startRealTimeApi']);
    });
    grunt.registerTask('stop-api', function (target) {
        return grunt.task.run(['shell:stopMongo', 'shell:stopFreeGeoIp', 'shell:stopPostingApi', 'shell:stopPrerenderServer', 'shell:stopRealTimeApi']);
    });




    grunt.registerTask('start-app', function (target) {
        return grunt.task.run('ngconstant:development', 'jshint', 'concurrent');
    });


    //Minifiy all code and run on local machine
    grunt.registerTask('build-local', ['ngconstant:development', 'jshint', 'concat', 'uglify', 'cssmin']);

    grunt.registerTask('build-staging', ['ngconstant:staging', 'jshint', 'concat', 'uglify', 'cssmin']);

    grunt.registerTask('build-prod', ['ngconstant:production', 'jshint', 'concat', 'uglify', 'cssmin']);

    //TODO: pickup build-dev contents, publish to github dev branch, run aws.git push to deploy to beta.hashtagsell.com
    //grunt.registerTask('commit-dev', ['jshint', 'concat', 'uglify']);

    //TODO: save minifed CSS and JS, to build-prod folder, commmit only production necessary files to github prod branch, run aws.git push to deploy to production
    //grunt.registerTask('deploy', ['jshint', 'concat', 'uglify']);
};