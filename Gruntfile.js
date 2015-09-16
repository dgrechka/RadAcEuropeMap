module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    typescript: {
      base: {
        src: ['scripts/*.ts'],
        dest: 'build/js',
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
        'idd.heatmapworker.js': 'idd/dist/idd.heatmapworker.js',
        'idd.transforms.js': 'idd/dist/idd.transforms.js',
        'jquery-1.10.2.js': 'jquery-1.10.2/jquery.js',
        'jquery-ui-1.11.2.js': 'jquery-ui-1.11.2/jquery-ui.js',        
      }
    },
    styles: {
      options: {
        destPrefix: 'styles/ext'
      },
      files: {
        'idd.css': 'idd/dist/idd.css',
        'jquery-ui.css': 'jquery-ui-1.11.2/themes/smoothness/jquery-ui.css',
      }
    }
  },
  copy: {
    main: {
      files: [
        { cwd:'html', src:['index.html'], dest: 'build/', filter: 'isFile',expand:true},        
        { src:['data/*.json'], dest: 'build/', filter: 'isFile',expand:true},    
        { cwd:'scripts', src:['**/*.js'], dest: 'build/js/', filter: 'isFile',expand:true},
        { cwd: 'styles', src:['**/*.css'], dest: 'build/styles/', filter: 'isFile',expand:true}
        ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('typescript-tpm');

  // Default task(s).
  grunt.registerTask('default', ['bowercopy','tpm-install','typescript','copy']);

};