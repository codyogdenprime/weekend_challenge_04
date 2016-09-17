module.exports = function(grunt) {

    // Config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: { //SASS on main.scss
            dist: {
                options: {
                    sourcemap: 'none',
                    style: 'compressed'
                },
                files: {
                    //'src/scss/inc/_normalize.scss': 'node_modules/normalize-css/normalize.css',
                    'src/compile.css': 'src/scss/style.scss'
                }
            }
        },
        clean: {
            build: {
                src: ['src/compile.css', 'src/compile.js']
            }
        },
        postcss: {
            options: {
                map: {
                    inline: false, // save all sourcemaps as separate files...
                },

                processors: [
                    require('autoprefixer')({ browsers: 'last 3 versions' }), // add vendor prefixes 
                ]
            },
            dist: {
                src: 'src/compile.css',
                dest: 'public/style.css'
            }
        },
        uglify: {
            dist: {
                src: ['src/compile.js'],
                dest: 'public/script.js',
            },
        },
        concat: {
            dist: {
                src: ['src/js/*.js'],
                dest: 'src/compile.js',
            },
        },
        watch: {
            css: {
                files: ['src/**/*.scss'],
                tasks: ['sass', 'postcss', 'clean'],
                options: {
                    spawn: false,
                },
            },
            js: {
                files: ['src/js/*.js'],
                tasks: ['concat', 'uglify', 'clean'],
                options: {
                    spawn: false,
                },
            },
        },
    });

    // Create Grunt Tasks
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Create Grunt commands
    grunt.registerTask('default', ['sass', 'postcss', 'concat', 'uglify', 'clean']);
    grunt.registerTask('css', 'sass', 'postcss');
    grunt.registerTask('js', 'concat', 'uglify');
    grunt.registerTask('dev-css', ['watch:css']);
    grunt.registerTask('dev-js', ['watch:js']);
};
