var
LIVE_RELOAD_PORT = 35729,
lrSnippet = require('connect-livereload')({port: LIVE_RELOAD_PORT}),
mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: {
      src: 'src',
      dest: 'dest'
    },
    jshint: {
      beforeconcat: ['<%= dirs.src %>/js/*.js'],
      afterconcat: ['<%= dirs.dest %>/js/*.js']
    },
    concat: {
      options: {
        banner: '/*! some copyright information here */'
      },
      js: {
        src: ['<%= dirs.src %>/js/*.js'],
        dest: '<%= dirs.dest %>/js/<%= pkg.name %>.js'
      }      
    },
    uglify: {
      options: {
        banner: '/*! some copyright information here */',
        sourceMap: true
      },
      dest: {
        files: {
          '<%= dirs.dest %>/js/<%= pkg.name %>.min.js':
          '<%= dirs.dest %>/js/<%= pkg.name %>.js'
        }
      }
    },
    watch: {
      options: {
        livereload: LIVE_RELOAD_PORT
      },
      files: [
        '<%= dirs.src %>/js/*.js',
        './*.html'
      ],
      tasks: ['build']
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, './')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%=connect.options.port%>'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('build', 'Build JavaScript Files', [
    'jshint:beforeconcat',
    'concat',
    'jshint:afterconcat',
    'uglify'
  ]);

  grunt.registerTask('default', ['connect:livereload', 'open', 'watch']);
};
