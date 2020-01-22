module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
		, includes: {
			files: {
				src: ['source/html/*.html'],
				dest: './public',
				flatten: true,
				cwd: '.'
			}
		}
		, sass: {
			default: {
				options: {
					sourceMap: true
					, style: 'expanded'
				}
				, files: {
					'public/content/main.css': 'source/sass/_core/main.scss'
				}
			}
		}
		, browserify: {
			basic: {
				files: {
					'public/content/js/main.js' : 'source/js/app.js'
				}
				, options: {
					transform: ['require-globify']
				}
			}
		}
		, handlebars: {
			compile: {
				options: {
					namespace: '<%= pkg.name %>'
					, node: true
					, processName: function(filename) {
						var segments = filename.split('/');
						if (segments.length < 2)
							return filename;

						var upperBound = segments.length - 1;
						return segments[upperBound - 1] + '/' + segments[upperBound];
					}
				}
				, files: {
					"source/js/templates.js": ["source/js/**/*.html"]
				}
			}
		}
		, watch: {
			css: {
				files: [
					'source/sass/**/*.scss'
				],
				tasks: ['styles']
			}
			, scripts: {
				files: ['source/js/**/*.js','source/js/**/*.html']
				, tasks: ['scripts']
			}
			, html: {
				files: ['source/html/**/*.html'],
				tasks: ['includes']
			}
		}
		, browserSync: {
			default_options: {
				bsFiles: {
					src: [
						"public/content/*.css",
						"public/content/js/*.js",
						"public/**/*.html",
						"source/*.html",
						"source/*.js"
					]
				}
				, options: {
					watchTask: true
					, server: {
						baseDir: "./public"
					}
				}
			}
		}
		, postcss: {
			default: {
				options: {
					map: true
					, processors: [
						require('postcss-cssnext')({browsers:[
							"> 0.2%"
							, "last 2 versions"
							, "firefox >= 10"
							, "iOS >= 7"
						]})
					]
				}
				, src: 'public/content/main.css'
			}
			, minify: {
				options: {
					map: false
					, processors: [
						require('cssnano')({
							discardUnused: false
						})
					]
				}
				, src: 'public/content/main.css'
			}
		}
		, uglify: {
			release: {
				files: {
					'public/content/js/main.js': 'public/content/js/main.js'
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask(
		'styles'
		, [
			'sass'
			, 'postcss:default'
		]
	);
	grunt.registerTask(
		'scripts'
		, [
			'handlebars'
			, 'browserify'
		]
	);
	grunt.registerTask(
		'html'
		, [
			'includes'
		]
	);
	grunt.registerTask(
		'default'
		, [
			'styles'
			, 'scripts'
			, 'html'
		]
	);
	grunt.registerTask(
		'server'
		, [
			'browserSync'
			, 'watch'
		]
	);
	grunt.registerTask(
		'release'
		, [
			'styles'
			, 'postcss:minify'
			, 'scripts'
			, 'uglify'
		]
	);
};