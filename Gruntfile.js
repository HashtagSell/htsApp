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
                    dest: './app/htsApp.config'
                },
                constants: {
                    ENV: {
                        name: 'development',
                        postingAPI: 'http://localhost:4043/v1/postings/',
                        realtimePostingAPI: 'http://localhost:4044/postings',
                        realtimeUserAPI: 'http://localhost:4044/users',
                        syncAgentAPI: 'http://localhost:8881'
                    }
                }
            },
            production: {
                options: {
                    dest: './app/config.js'
                },
                constants: {
                    ENV: {
                        name: 'production',
                        postingAPI: 'url',
                        RealtimeCommAPI: 'url',
                        syncAgentAPI: 'url'
                    }
                }
            }
        },
        //start mongo
        shell: {
            mongodb: {
                command: './startMongoIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            redis: {
                command: './startRedisIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            freeGeoIp: {
                command: './startFreeGeoIpIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            postingAPI: {
                command: './startPostingApiIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            realTimeCommAPI: {
                command: './startRealTimeApiIfNotRunning.sh',
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            startSync: {
                command: './startSyncAgentIfNotRunning.sh',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true
                }
            },
            quitAll: {
                command: './quitAll.sh',
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
        },
        //runs when grunt is exited
        exit: {
            normal: {

            }
        },
        //Concat combines all js files in js directory to one file.
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['./app/js/**/*.js'],
                dest: './app/dist/<%= pkg.name %>.js'
            }
        },
        //Validate all js
        jshint: {
            // define the files to lint
            files: ['./gruntfile.js', './app/js/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                // more options here if you want to override JSHint defaults
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
                    './app/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
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
                    nodeArgs: ['--debug'],
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
        }
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-node-inspector');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-services');
    grunt.loadNpmTasks('grunt-exit');

    grunt.registerTask('dev', function (target) {
        return grunt.task.run(['shell:mongodb', 'shell:redis', 'shell:freeGeoIp', 'shell:postingAPI', 'shell:realTimeCommAPI', 'ngconstant:development', 'jshint', 'concurrent']);
    });


    grunt.registerTask('sync', function (target) {
        return grunt.task.run(['shell:startSync']);
    });


    grunt.registerTask('quit', function (target) {
        return grunt.task.run(['shell:quitAll']);
    });

    //TODO: Included minifed CSS and JS, save to build dev folder
    //grunt.registerTask('build-dev', ['jshint', 'concat', 'uglify']);

    //TODO: pickup build-dev contents, publish to github dev branch, run aws.git push to deploy to beta.hashtagsell.com
    //grunt.registerTask('commit-dev', ['jshint', 'concat', 'uglify']);

    //TODO: save minifed CSS and JS, to build-prod folder, commmit only production necessary files to github prod branch, run aws.git push to deploy to production
    //grunt.registerTask('deploy', ['jshint', 'concat', 'uglify']);
};