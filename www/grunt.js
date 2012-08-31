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
		lint: {
			files: [
				's/*.js'
			]
			// afterconcat: ['js/*.js', 'mod/**/*.js']
		},
		jshint: {
			options: {
				//abbreviated descriptions here for convience, full details/reasoning: jshint.com/docs/
				eqeqeq: true,
				//This options prohibits the use of == and != in favor of === and !==. The former try to coerce values before comparing them which can lead to some unexpected results. The latter don't do any coercion so they are generally safer.
				immed: true,
				//This option prohibits the use of immediate function invocations without wrapping them in parentheses.
				unused: true,
				//This option warns when you define and never use your variables
				// undef:true, //This option prohibits the use of explicitly undeclared variables
				nonew: true,
				//This option prohibits the use of constructor functions for side-effects
				camelcase: true,
				//This option allows you to force all variable names to use either camelCase style or UPPER_CASE with underscores
				// latedef: true, //This option prohibits the use of a variable before it was defined
				// newcap: true, //This option requires you to capitalize names of constructor functions.
				noarg: true,
				//This option prohibits the use of arguments.caller and arguments.callee
				sub: true
				//This option suppresses warnings about using [] notation when it can be expressed in dot notation
			},
			globals: {},
			libs: {
				options: {
					asi: true
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('mathema', 'lint');

};