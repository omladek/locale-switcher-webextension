'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('localeswitcher.json'),
        banner: '/*!\\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\\n */',
        // global
        documentRoot: 'www',
        bower: '<%= documentRoot %>/bower',
        // css
        css: '<%= documentRoot %>/css',
        cssFile: '<%= css %>/style.css',
        stylusRoot: '<%= css %>/main.styl',
        // img
        img: '<%= documentRoot %>/img',
        // js
        js: '<%= documentRoot %>/js',
        app: '<%= js %>/app',
        // templates
        tpl: '<%= documentRoot %>/tpl',
        stylus: {
            compile: {
                options: {
                    compress: true,
                    urlfunc: 'embedurl' // use embedurl('test.png') in our code to trigger Data URI embedding
                },
                files: {
                    '<%= concat.css.dest %>': 'www/css/main.styl'
                }
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            css: {
                src: ['www/css/style.css'],
                dest: 'www/css/style.css'
            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            }
        },
        browserify: {
            dev: {
                options: {
                    debug: true
                },
                files: {
                    '<%= js %>/app.js': ['<%= app %>/app.js'],
                    '<%= js %>/background.js': ['<%= app %>/background.js']
                }
            }
        },
        assemble: {
            options: {
                pkg: '<%= pkg %>',
                flatten: true
            },
            pages: {
                options: {
                    partials: ['www/tpl/partials/*.hbs'],
                    layout: 'www/tpl/layouts/default.hbs'
                },
                files: {
                    'www': ['www/tpl/*.hbs']
                }
            }
        },
        jsvalidate: {
            validate: {
                src: [
                    '<%= app %>/**/*.js'
                ]
            }
        },
        uglify: {
            options: {
                report: 'min',
                preserveComments: false,
                compress: {
                    drop_console: true
                }
            },
            compile: {
                files: {
                    '<%= js %>/app.js': ['<%= js %>/app.js']
                }
            }
        },
        copy: {
            js: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: [
                        '<%= bower %>/jquery/jquery.min.js',
                        '<%= app %>/background.js'
                    ],
                    dest: '<%= js %>'
                }]
            },
            font: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: [
                        '<%= bower %>/bootstrap-stylus/fonts/*.*'
                    ],
                    dest: '<%= css %>/fonts/'
                }]
            }
        },
        zip: {
            '<%= documentRoot %>/dist/locale_switcher.xpi': ['manifest.json', '!www/bower/**/*', 'www/**/*']
        },
        esteWatch: {
            options: {
                dirs: ['www/',
                    'www/tpl/**/',
                    '!www/bower/**/',
                    'www/css/**/',
                    'www/js/app/**/'
                ],
                livereload: {
                    enabled: true,
                    port: 35729,
                    extensions: ['js', 'css', 'hbs']
                }
            },
            hbs: function() {
                return ['tpl'];
            },
            js: function(filepath) {
                if (filepath === 'www/js/app.js') {
                } else {
                    return ['js'];
                }
            },
            styl: function(filepath) {
                grunt.config(['stylus', 'all', 'files'], [{
                    expand: true,
                    src: filepath,
                    ext: '.css'
                }]);
                return ['css'];
            }
        }
    });

    require('jit-grunt')(grunt);

    // Default task.
    grunt.registerTask('default', ['esteWatch', 'zipit']);
    grunt.registerTask('css', ['stylus', 'concat:css']);
    grunt.registerTask('js', ['jshint:gruntfile', 'jsvalidate:validate', 'browserify']);//, 'uglify:compile']);
    grunt.registerTask('tpl', ['assemble:pages']);
    grunt.registerTask('zipit', ['zip']);
    grunt.registerTask('build', ['css', 'tpl', 'copy', 'js', 'zipit']);

};
