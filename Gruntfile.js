module.exports = function(grunt){
    grunt.initConfig({
        connect: {
            global: {
                options: {
                    base: './',
                    port: 4321,
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('serve', 'connect:global');
}