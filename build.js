require('shelljs/global')

rm('-r', 'dist')
mkdir('dist')

var handlebars = cat('src/calendar.html').split('</script>').slice(0, -1).map(function (source) {
	var name = source.match(/data-template-name=\'(.*)\'/)[1]
	
	source = source.replace(/<script.*/gm, '')
	source = JSON.stringify(source)
	
	return 'Ember.TEMPLATES["' + name + '"]=Ember.Handlebars.compile(' + source + ');\n'
}).join('')

cat('src/calendar.css').to('dist/calendar.css');
(handlebars + cat('src/calendar.js')).to('dist/calendar.js')

exec('yuicompressor dist/calendar.css').output.to('dist/calendar.min.css')
exec('closure-compiler --language_in ECMASCRIPT5 --js dist/calendar.js', { silent: true }).output.to('dist/calendar.min.js')