module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    typescript: {
      base: {
        src: ['scripts/*.ts'],
        dest: 'build/',
        options: {
          module: 'amd', //or commonjs 
          target: 'es5', //or es3           
          sourceMap: true,
          declaration: true
        }
      }
    },
    "tpm-install": {
      options: {dev: true},
      all: {src: "bower_components/*/bower.json", dest: "scripts/types/"}
    },
  bowercopy: {
  options: {
    srcPrefix: 'bower_components',
    runBower: true,
    report: true
    //clean:true
  },
  scripts: {
    options: {
      destPrefix: 'scripts/ext'
    },
    files: {
      'idd.js': 'idd/dist/idd.js',
      'jquery-1.10.2.js': 'jquery-1.10.2/build/release.js',
      'jqeury-ui-1.11.2.js': 'jqeury-ui-1.11.2/jquery-ui.js',
      'rx.js': 'rxjs/dist/rx.js',
      'rx.jQuery.js': 'rxjs-jquery/rx.jquery.js'
    }
  },
  styles: {
    options: {
      destPrefix: 'styles/ext'
    },
    files: {
      'idd.css': 'idd/dist/idd.css',
      'jquery-ui.js': 'jqeury-ui-1.11.2/themes/smoothness/jquery-ui.css',
    }
  }
}
  });
  
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('typescript-tpm');

  // Default task(s).
  grunt.registerTask('default', ['bowercopy','tpm-install','typescript']);

};