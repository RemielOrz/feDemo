module.exports = function(grunt){
    grunt.initConfig({
        connect: {
            serve: {
                options: {
                    port: 9991,
                    base: './',
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('serve', 'connect:serve');
}