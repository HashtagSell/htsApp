module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['./app/js/**/*.js'],
                dest: './app/dist/<%= pkg.name %>.js'
            }
        },
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
                tasks: ['nodemon', 'node-inspector', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        'node-inspector': {
            dev: {
                options: {
                    'web-port': 1337,
                    'web-host': 'localhost',
                    'debug-port': 5858,
                    'save-live-edit': true,
                    'no-preload': true,
                    'stack-trace-limit': 4,
                    'hidden': ['node_modules']
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
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
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint'],
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

    grunt.registerTask('default', ['jshint', 'concurrent']);

    //TODO: Included minifed CSS and JS, save to build dev folder
    //grunt.registerTask('build-dev', ['jshint', 'concat', 'uglify']);

    //TODO: pickup build-dev contents, publish to github dev branch, run aws.git push to deploy to beta.hashtagsell.com
    //grunt.registerTask('commit-dev', ['jshint', 'concat', 'uglify']);

    //TODO: save minifed CSS and JS, to build-prod folder, commmit only production necessary files to github prod branch, run aws.git push to deploy to production
    //grunt.registerTask('deploy', ['jshint', 'concat', 'uglify']);
};