function PHPPreload(options) {

}

PHPPreload.prototype.apply = function(compiler) {
    var is_dev = process.env.NODE_ENV === 'development';

    compiler.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
            var hash = htmlPluginData.plugin.childCompilerHash;
            if ( is_dev ) {
                if ( htmlPluginData.html.match("include('../partials)") ) {
                    htmlPluginData.html.replace(/include\('\.\.\/partials/gi, "include('partials");
                }
                htmlPluginData.html.replace(/\/space\//gi, 'space.html');
            }
            callback(null, htmlPluginData);
        });
    });

};

module.exports = PHPPreload;