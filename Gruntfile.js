module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		path: {
			dist: 'dist',
			asset: 'assets',
			icon: '<%= path.asset %>/icons',
		},
		clean: {
			dist: '<%= path.dist %>',
		},
		less: {
			dist: {
				options: {
					comporess: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: 'style.css.map',
					sourceMapFilename: '<%= path.dist %>/<%= path.asset %>/css/style.css.map',
					modifyVars: {
						modernizrClass: '<%= modernizr.dist.extensibility.cssclassprefix %>',
					},
				},
				files: {
					'<%= path.dist %>/<%= path.asset %>/css/style.css': 'src/less/style.less',
				},
			},
			minified: {
				options: {
					cleancss: true,
					report: 'min',
				},
				files: {
					'<%= path.dist %>/<%= path.asset %>/css/style.min.css': '<%= path.dist %>/<%= path.asset %>/css/style.css',
				},
			},
		},
		copy: {
			assets: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src:['fonts/**', 'img/**'],
						dest:'<%= path.dist %>/<%= path.asset %>/',
					},
				],
			},
			vendor: {
				files: [
					{
						expand: true,
						flatten: true,
						src: [
							'bower_components/jquery/dist/jquery.min.js',
							'bower_components/bootstrap/dist/js/bootstrap.min.js',
							'bower_components/html5shiv/dist/html5shiv.js',
							'bower_components/respond/dest/respond.min.js',
						],
						dest: '<%= path.dist %>/<%= path.asset %>/js/lib/',
					},
					{
						expand: true,
						flatten: true,
						src: [
							'bower_components/bootstrap/dist/fonts/*',
							'bower_components/fontawesome/fonts/*',
						],
						dest: '<%= path.dist %>/<%= path.asset %>/fonts/',
					},
				],
			},
		},
		processhtml: {
			options: {
				recursive: true,
				process: true,
				data: {
					path: {
						asset: '<%= path.asset %>',
						icon: '<%= path.icon %>',
					},
					modernizrClass: '<%= modernizr.dist.extensibility.cssclassprefix %>',
				},
			},
			dist: {
				files:[
					{
						expand: true,
						flatten: true,
						src: 'src/html/*.html',
						dest: '<%= path.dist %>/',
					},
				],
			},
		},
		jsbeautifier: {
			files : ['<%= path.dist %>/*.html'],
			options: {
				html: {
					indentChar: "\t",
					indentSize: 1,
					endWithNewline: true,
				},
			},
		},
		humans_txt: {
			options: {
				intro: '<%= pkg.description %>',
				commentStyle: 'u',
				includeUpdateIn: 'site',
				content: grunt.file.readJSON('src/humans.json'),
			},
			files: {
				dest: '<%= path.dist %>/humans.txt',
			},
		},
		favicons: {
			options: {
				trueColor: true,
				precomposed: true,
				appleTouchBackgroundColor: 'auto',
				coast: true,
				windowsTile: true,
				tileBlackWhite: true,
				tileColor: 'none',
				HTMLPrefix: '<%= path.icon %>/',
				firefox: true,
				firefoxManifest: '<%= path.dist %>/manifest.webapp',
			},
			dist: {
				src: 'src/favicon.png',
				dest: '<%= path.dist %>/<%= path.icon %>',
			},
		},
		firefoxManifest: {
			dist: {
				options: {
					manifest: '<%= path.dist %>/manifest.webapp',
				},
			},
		},
		manifest: {
			dist: {
				options: {
					basePath: '<%= path.dist %>/',
					network: ['http://*', 'https://*'],
					fallback: ['/ /offline.html'],
				},
				src: [
					'<%= path.asset %>/css/*.css',
					'<%= path.asset %>/js/*.js',
				],
				dest: '<%= path.dist %>/manifest.appcache',
			},
		},
		modernizr: {
			dist: {
				devFile: 'bower_components/modernizr/modernizr.js',
				outputFile: '<%= path.dist %>/<%= path.asset %>/js/lib/modernizr.min.js',
				extra: {
					shiv: false,
					mq: true,
					cssclasses: true,
				},
				extensibility: {
					cssclassprefix: '',
				},
				uglify: true,
				tests: [],
				files: {
					src: [
						'<%= path.dist %>/<%= path.asset %>/css/*.css',
						'<%= path.dist %>/<%= path.asset %>/js/*.js',
					],
				},
			},
		},
		watch: {
			options: {
				livereload: false,
			},
			less: {
				files: 'src/less/**/*.less',
				tasks: 'less',
			},
			html: {
				files: 'src/html/**/*.html',
				tasks: 'processhtml',
			},
			js: {
				files: 'src/js/*.js',
				tasks: 'uglify',
			},
		},
		connect: {
			server: {
				options: {
					livereload: true,
					port: 9000,
					base: '<%= path.dist %>',
				},
			},
		},
	});

	require('load-grunt-tasks')(grunt);

	// Task definition
	grunt.registerTask('assets', ['less', 'copy', 'modernizr']);
	grunt.registerTask('html', ['processhtml', 'jsbeautifier']);
	grunt.registerTask('misc', ['humans_txt', 'firefoxManifest', 'favicons', 'manifest']);
	grunt.registerTask('dist', ['clean', 'assets', 'html', 'misc']);
	grunt.registerTask('dev', ['clean', 'assets', 'html']);
	grunt.registerTask('work', ['connect', 'watch']);
	grunt.registerTask('default', 'dist');
};
