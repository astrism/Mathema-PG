module.exports = function(grunt)
{

	// Project configuration.
	grunt.initConfig(
	{
		pkg: '<json:package.json>',
		meta: {
			name: 'Test your mental mettle in Metal Mathema ~ ~~ ~~~' +
			'/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %> */'
		},
		qunit: {
			files: 'index.html'
		},
		jshint: {
			files: ['s/*.js'],
			options: {
				//abbreviated descriptions here for convience, full details/reasoning: jshint.com/docs/
				//This options prohibits the use of == and != in favor of === and !==. The former try to coerce values before comparing them which can lead to some unexpected results. The latter don't do any coercion so they are generally safer.
				eqeqeq: true,
				//This option prohibits the use of immediate function invocations without wrapping them in parentheses.
				immed: true,
				//This option prohibits the use of constructor functions for side-effects
				nonew: true,
				//This option allows you to force all variable names to use either camelCase style or UPPER_CASE with underscores
				camelcase: true,
				//This option prohibits the use of arguments.caller and arguments.callee
				noarg: true,
				//This option warns when you define and never use your variables
				unused: false,
				//This option prohibits the use of explicitly undeclared variables
				undef: false, 
				//This option prohibits the use of a variable before it was defined
				latedef: false,
				//This option requires you to capitalize names of constructor functions.
				newcap: false, 
				browser: true,
				jquery: true
			},
			globals: {},
			libs: {
				options: {
					asi: true
				}
			}
		}
	});

	// Load local tasks.
	grunt.loadTasks('tasks');

	// Load NPM Tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	// Default task.
	grunt.registerTask('default', 'jshint');
	// Travis CI task.
	grunt.registerTask('travis', 'lint qunit');
};