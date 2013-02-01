require('shelljs/global')

rm('-r', 'dist')
mkdir('dist')

var handlebars = cat('src/calendar.html').split('</script>').slice(0, -1).map(function (source) {
	var name = source.match(/data-template-name=\'(.*)\'/)[1]
	
	source = source.replace(/<script.*/gm, '')
	source = JSON.stringify(source)
	
	return 'Ember.TEMPLATES["' + name + '"]=Ember.Handlebars.compile(' + source + ');\n'
}).join('')

cat('src/calendar.css').to('dist/ember-calendar.css');
(handlebars + cat('src/calendar.js')).to('dist/ember-calendar.js')

exec('yuicompressor dist/ember-calendar.css', { silent: true }).output.to('dist/ember-calendar.min.css')
exec('closure-compiler --language_in ECMASCRIPT5 --js dist/ember-calendar.js', { silent: true }).output.to('dist/ember-calendar.min.js')