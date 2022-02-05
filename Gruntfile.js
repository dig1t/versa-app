module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// Tasks
		sass: { // Convert sass file into css
			dist: {
				options: {
					//sourcemap: 'none'
				},
				files: [{
					expand: true,
					cwd: 'src/styles',
					src: [
						'admin.scss',
						'main.scss'
					],
					dest: 'dist/public/assets/css',
					ext: '.css'
				}]
			}
		},
		
		concat: { // Concatenate required css files with compiled sass file
			dist: {
				src: [
					'dist/public/assets/css/main.css',
					'src/styles/*.css'
				],
				dest: 'dist/public/assets/css/build.css'
			}
		},
		
		cssmin: { // Minify admin and build files
			dist: {
				files: [{
					expand: true,
					cwd: 'dist/public/assets/css',
					src: [
						'admin.css',
						'build.css'
					],
					dest: 'dist/public/assets/css',
					ext: '.min.css'
				}]
			}
		},
		
		clean: { // Remove uncompressed files
			dist: {
				src: [
					'dist/public/assets/css/*.css',
					'!dist/public/assets/css/*.min.css'
				]
			}
		},
		
		watch: { // Watch for file changes
			css: {
				files: ['src/styles/*.scss', 'src/styles/pages/*.scss'],
				tasks: ['sass', 'concat', 'cssmin', 'clean'],
				options: {
					atBegin: true,
					interrupt: true
				}
			}
		}
	})
	
	const tasks = [
		'grunt-contrib-sass',
		'grunt-contrib-concat',
		'grunt-contrib-cssmin',
		'grunt-contrib-uglify',
		'grunt-contrib-clean',
		'grunt-contrib-watch'
	]
	
	tasks.map(task => {
		grunt.loadNpmTasks(task)
	})
	
	grunt.registerTask('default', ['sass', 'concat', 'cssmin', 'clean'])
	grunt.registerTask('watch', ['watch'])
}