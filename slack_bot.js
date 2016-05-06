if (!process.env.token) {
	console.log('Error: Specify token in environment');
	process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
	debug: true,
	json_file_store: 'database_bot',
});

var bot = controller.spawn({
	token: process.env.token
}).startRTM();

var allQuerys = null;

controller.hears(['new query (.*)'], ['direct_message','ambient'], function(bot, message) {
	console.log("hello");
	var name = message.match[1];

	bot.startConversation(message, function(err, convo) {
		convo.ask('Creating query `' + name + '`. Now pass me that query!', function(response, convo) {
			var query = response.text;

			var date = getCurrentDate();

			var id = new Date().valueOf();

			controller.storage.users.save({id: id, name: name, query: query, date: date}, null);

			convo.say('Got it!');
			convo.next();
		});
	});
});

controller.hears(['query (.*)'], ['direct_message','ambient'], function(bot, message) {
	var resultSize = message.match[1];
	
	controller.storage.users.all(function(err, all_user_data) {
		var sortedData = all_user_data.sort(function(a, b) {
			return a.id - b.id;
		});
		

		var startingIndex = 0;

		if (!isNaN(resultSize)) 
			if (resultSize < sortedData.length)
				startingIndex = sortedData.length - resultSize;


		for (var i = startingIndex; i<sortedData.length; i++) {
			bot.reply(message, '[' + sortedData[i].name + '] `' + sortedData[i].date + '`\n```' + sortedData[i].query + "```\n");
		}
	});
});

function getCurrentDate() {
	var today = new Date();
	var hh = today.getHours();
	var nn = today.getMinutes();

	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if (nn<10)
		nn='0' + nn;

	if(dd<10)
		dd='0' + dd;

	if(mm<10)
		mm='0' + mm;

	return yyyy+'/'+mm+'/'+dd+" "+hh+":"+nn;
}