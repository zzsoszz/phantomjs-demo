const phantom = require('phantom');
var Promise = require("bluebird");
var urlencode = require('urlencode');
var encodings = ["euc-jp", "sjis", "utf8", "System","gbk"];
phantom.outputEncoding=encodings[4];
var sitepage = null;
var phInstance = null;

phantom.create([], {
    phantomPath: './phantomjs.exe'
})
.then(instance => {
	phInstance = instance;
	return instance.createPage();
})
.then(page => {
	
	var keywords=["百度","淘宝","银行","一元"];
	var promisses=Promise.map(keywords, function(keyword) {
		console.log(keyword);
		return new Promise(function (resolve, reject) {
			var value=urlencode(keyword);
			page.open('http://tool.chinaz.com/kwevaluate?kw='+value).then(function(status){
				console.log(status);
				if(status === "success")
				{
					page.evaluate(function() {
					    return $("#site1").text();
					}).then(function(text){
						console.log(text);
						resolve(text);
						//page.close();
					});
				}
			}).catch(function (e) {
				reject(e);
				console.log(e);
			});
		});
	}
	, {concurrency: 1}
	);
	
	promisses.then(function(result) {
		console.log(result);
		console.log("done");
	}).catch(function (e) {
		console.log(e);
	});
	
	/*
		.then(function(status){
			console.log(status);
			if(status === "success") {
				return page.evaluate(function() {
				  return ($("#site1 > div:nth-child(2) > span.ss1.bn").text());
				}).then(function(html){
					return html;
				});
			}
		})
		*/
		
		
/*
	keyword.forEach(i=>{
			console.log(i);
			
			page.open('http://tool.chinaz.com/kwevaluate?kw=%E7%99%BE%E5%BA%A6').then(function(status){
				console.log(status);
				if(status === "success") {
					page.evaluate(function() {
					  return ($("#site1 > div:nth-child(2) > span.ss1.bn").text());
					}).then(function(html){
						console.log(html);
						console.log(phantom.outputEncoding);
					});
				}
			});
			
	});
*/
	
	
})
.catch(error => {
	console.log(error);
	phInstance.exit();
});



(function() {
	/*
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on("onResourceRequested", function(requestData) {
        console.info('Requesting', requestData.url)
    });

    const status = await page.open('https://stackoverflow.com/');
    console.log(status);

    const content = await page.property('content');
    console.log(content);
	
    await instance.exit();
	*/
	
}());
