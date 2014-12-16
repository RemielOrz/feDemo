module.exports = function(grunt){
    grunt.initConfig({
        connect: {
            global: {
                options: {
                    port: 1992,
                    base: './',
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('serve', 'connect:global');
};