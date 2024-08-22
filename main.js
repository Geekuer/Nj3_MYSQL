const author = require('./lib/author');
const http = require('http');
const topic = require('./lib/topic');
const url = require('url');

const app = http.createServer(function (request,response) {
	const { pathname, query } = url.parse(request.url, true);

	if(pathname === '/'){
		if(query.id === undefined){
			topic.home(request, response);

		} 	else {
			topic.page(request, response);
		}

	} else if(pathname === '/create'){
		topic.create(request, response);

	} else if(pathname === '/create_process'){
		topic.create_process(request, response);

	} else if(pathname === '/update'){
		topic.update(request, response);
		
	} else if(pathname === '/update_process'){
		topic.update_process(request, response);

	} else if(pathname === '/delete_process'){
		topic.delete_process(request, response);
		
	} else if(pathname === '/author'){
		author.home(request, response);
		
	} else if(pathname === '/author/create_process'){
		author.create_process(request, response);
		
	} else if (pathname === '/author/update'){
		author.update(request, response);
		
	} else if (pathname === '/author/update_process'){
		author.update_process(request, response);
		
	} else if (pathname === '/author/delete_process'){
		author.delete_process(request, response);
		
	} else {
		response.writeHead(404);
		response.end('Not found');
	}
});

PORT = 3003;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});	