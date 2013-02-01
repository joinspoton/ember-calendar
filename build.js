require('shelljs/global')

rm('-r', 'dist')
mkdir('dist')

var license = '/* ember-calendar (https://github.com/joinspoton/ember-calendar) | (c) 2013 SpotOn (https://spoton.it) | http://www.opensource.org/licenses/MIT */\n'

var handlebars = cat('src/calendar.html').split('</script>').slice(0, -1).map(function (source) {
	var name = source.match(/data-template-name=\'(.*)\'/)[1]
	
	source = source.replace(/<script.*/gm, '')
	source = JSON.stringify(source)
	
	return 'Ember.TEMPLATES["' + name + '"]=Ember.Handlebars.compile(' + source + ');\n'
}).join('')

;(license + cat('src/calendar.css')).to('dist/ember-calendar.css')
;(license + handlebars + cat('src/calendar.js')).to('dist/ember-calendar.js')

;(license + exec('yuicompressor dist/ember-calendar.css', { silent: true }).output).to('dist/ember-calendar.min.css')
;(license + exec('closure-compiler --language_in ECMASCRIPT5 --js dist/ember-calendar.js', { silent: true }).output).to('dist/ember-calendar.min.js')