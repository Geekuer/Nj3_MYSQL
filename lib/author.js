const db = require('./db');
const sanitizeHtml = require('sanitize-html');
const template = require('./template');
const url = require('url');
const qs = require('querystring');

module.exports = {
	home: function	(request, response) {
		db.query(`SELECT * FROM topic`, function (error, topics) {
			if (error) {
				throw error;
			}

			db.query(`SELECT * FROM author`, function (error2, authors) {
				if (error2) {
					throw error2;
				}

				const title = 'Author';
				const list = template.list(topics);
				const html = template.HTML(title, list, '',
					`<h2>${title}</h2>
					${template.authorTable(authors)}
					<style>
						table {
							border-collapse: collapse;
						}

						td {
							border: 1px solid black;
						}
					</style>
					<h3>Create Author</h3>
					<form action="/author/create_process" method="post">
						<p><input type="text" name="name" placeholder="name" required></p>
						<p><textarea name="profile" placeholder="profile"></textarea></p>
						<p><input type="submit" value="Create"></p>
					</form`
				);
			
				response.writeHead(200);
				response.end(html);
			});
		});
	},

	create_process: function (request, response) {
		let body = '';
		request.on('data', function (data){
			body = body + data;
		});

		request.on('end', function (){
			const post = qs.parse(body);
			
			db.query(`INSERT INTO author (name, profile) VALUE (?, ?)`, [post.name, post.profile], function (error, result) {
				if (error) {
					throw error;
				}
				
				response.writeHead(302, {Location: `/author`});
				response.end();
				console.log(`Created Author : ${post.name}`);

			});
		});
	},

	update: function (request, response) {
		const { query } = url.parse(request.url, true);

		db.query(`SELECT * FROM topic`, function (error, topics) {
			if (error) {
				throw error;
			}

			db.query(`SELECT * FROM author`, function (error2, authors) {
				if (error2) {
					throw error2;
				}

				db.query(`SELECT * FROM author WHERE id=?`, [query.id], function (error3, author) {
					if (error3) {
						throw error3;
					}
					
					const title = 'Author';
					const list = template.list(topics);
					const html = template.HTML(`Update ${title}`, list, '',
						`<h2>${title}</h2>
						${template.authorTable(authors)}
						<style>
							table {
								border-collapse: collapse;
							}

							td {
								border: 1px solid black;
							}
						</style>
						<h3>Update ${sanitizeHtml(author[0].name)}</h3>
						<form action="/author/update_process" method="post">
							<p><input type="hidden" name="id" value="${author[0].id}"></p>
							<p><input type="hidden" name="old_name" value="${sanitizeHtml(author[0].name)}"></p>
							<p><input type="text" name="name" value="${sanitizeHtml(author[0].name)}" required placeholder="name"></p>
							<p><textarea name="profile" placeholder="profile">${sanitizeHtml(author[0].profile)}</textarea></p>
							<p><input type="submit" value="Update"></p>
						</form`
					);
				
					response.writeHead(200);
					response.end(html);
				});
			});
		});
	},

	update_process: function (request, response) {
		let body = '';
		request.on('data', function (data){
			body = body + data;
		});

		request.on('end', function (){
			const post = qs.parse(body);
			
			db.query(`UPDATE author SET name = ?, profile = ? WHERE id = ?;`, [post.name, post.profile, post.id], function (error, result) {
				if (error) {
					throw error;
				}
				
				response.writeHead(302, {Location: `/author`});
				response.end();
				console.log(`Created Author : ${post.old_name} -> ${post.name}`);
			});
		});
	},
	
	delete_process: function (request, response) {
		let body = '';
		request.on('data', function (data){
			body = body + data;
		});

		request.on('end', function (){
			const post = qs.parse(body);

			db.query(`DELETE FROM TOPIC WHERE author_id=?`, [post.id], function (error, result) {
				if (error) {
					throw error;
				}

					db.query(`DELETE FROM author WHERE id=?`, [post.id], function (error2, result2) {
						if (error2) {
							throw error2;
						}

						response.writeHead(302, {Location: `/author`});
						response.end();
						console.log(`Deleted Author : ${post.old_name}`);
			});
			});
		});
	}
}