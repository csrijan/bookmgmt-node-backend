'use strict';

module.exports = function(app)
{
	const bodyParser= require('body-parser');
	const database = require('../config/bookmgmtDatabase');
	const cors = require('cors');
	const uuid = require('uuidv4');
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cors());
	
	app.post('/BOOKMGMT/authService/authUser', function(req, res, next)
	{
		var username = req.body.username;
		var password = req.body.password;
		
		var authdata=
			{
				"authUserOutput":
				[
				]
			}
		
		database.query('select username from bookmgmt.bm_user where username = ? and userpass = ?', [username, password], function(error, results)
		{
			if(error)
			{
				next(error);
			}
			else
			{
				authdata.authUserOutput[0]={};
				if(results.length>0)
					authdata.authUserOutput[0].username=results[0].username;
				else
				{
					return res.send(authdata);
				}
				var temp_uuid = uuid();
				database.query('update bookmgmt.bm_user set sessionid = ? where username = ?', [temp_uuid, username], function(error, results)
				{
					if(error)
					{
						next(error);
					}
					else
					{
						
						authdata.authUserOutput[0].sessionid=temp_uuid;
						return res.send(authdata);
					}
				});
			}
		});
	});
	
	app.post('/BOOKMGMT/authService/addUser', function(req, res, next)
	{
		var username = req.body.username;
		var password = req.body.password;
		
		var ret="Failed";
		
		database.query('insert into bookmgmt.bm_user(username, userpass) values ( ? , ? )', [username, password], function(error, results)
		{
			if(error)
			{
				if(error.errno==1062)
				{
					ret="Duplicate";
				}
				else
				{
					next(error);
				}
			}
			else
			{
				ret="Success";
			}
			return res.send(ret);
		});			

	});
	
	app.post('/BOOKMGMT/authService/logoffUser', function(req, res, next)
	{
		var username = req.body.username;
		var sessionid = req.body.sessionid;
		
		var ret="Failed";
		
		database.query('select 1 from bookmgmt.bm_user where username = ? and sessionid = ?', [username, sessionid], function(error, results)
		{
			if(results.length==0)
			{
				console.log("Unauthorized Access");
				ret="Failed";
				return res.send(ret);
			}
			else
			{				
				database.query('update bookmgmt.bm_user set sessionid = null where username = ? and sessionid = ?', [username, sessionid], function(error, results)
				{
					if(error)
					{
						next(error);
					}
					else
					{						
						ret="Success";
					}
					return res.send(ret);
				});
			}
		});
	});
	
	app.post('/BOOKMGMT/bookService/listGenres', function(req, res, next)
	{
		var username = req.body.username;
		var sessionid = req.body.sessionid;
		
		var listgenredata=
			{
				"listGenresOutput":
				[
				]
			}
		
		database.query('select 1 from bookmgmt.bm_user where username = ? and sessionid = ?', [username, sessionid], function(error, results)
		{
			if(results.length==0)
			{
				console.log("Unauthorized Access");
				ret="Failed";
				return res.send(ret);
			}
			else
			{				
				database.query('select genre_id, genre_name from bookmgmt.bm_genre', function(error, results)
				{
					if(error)
					{
						next(error);
					}
					else
					{
						var counter=0;
						results.forEach(function(genre)
						{
							listgenredata.listGenresOutput[counter]={};
							listgenredata.listGenresOutput[counter].genreid=genre.genre_id;
							listgenredata.listGenresOutput[counter++].genre=genre.genre_name;
						});
					}
					return res.send(listgenredata);
				});
			}
		});
	});
	
	app.post('/BOOKMGMT/bookService/listAuthors', function(req, res, next)
	{
		var username = req.body.username;
		var sessionid = req.body.sessionid;
		
		var listauthordata=
			{
				"listAuthorsOutput":
				[
				]
			}
		
		database.query('select 1 from bookmgmt.bm_user where username = ? and sessionid = ?', [username, sessionid], function(error, results)
		{
			if(results.length==0)
			{
				console.log("Unauthorized Access");
				ret="Failed";
				return res.send(ret);
			}
			else
			{				
				database.query('select author_id, author_name from bookmgmt.bm_author', function(error, results)
				{
					if(error)
					{
						next(error);
					}
					else
					{
						var counter=0;
						results.forEach(function(author)
						{
							listauthordata.listAuthorsOutput[counter]={};
							listauthordata.listAuthorsOutput[counter].authorid=author.author_id;
							listauthordata.listAuthorsOutput[counter++].authorname=author.author_name;
						});
					}
					return res.send(listauthordata);
				});
			}
		});
	});
	
	app.post('/BOOKMGMT/bookService/listBooks', function(req, res, next)
	{
		var username = req.body.username;
		var sessionid = req.body.sessionid;
		
		var listbookdata=
			{
				"listBooksOutput":
				[
				]
			}
		
		database.query('select 1 from bookmgmt.bm_user where username = ? and sessionid = ?', [username, sessionid], function(error, results)
		{
			if(results.length==0)
			{
				console.log("Unauthorized Access");
				ret="Failed";
				return res.send(ret);
			}
			else
			{				
				database.query('select book_id, book_name from bookmgmt.bm_book', function(error, results)
				{
					if(error)
					{
						next(error);
					}
					else
					{
						var counter=0;
						results.forEach(function(book)
						{
							listbookdata.listBooksOutput[counter]={};
							listbookdata.listBooksOutput[counter].bookid=book.book_id;
							listbookdata.listBooksOutput[counter++].bookname=book.book_name;
						});
					}
					return res.send(listbookdata);
				});
			}
		});
	});
	
	app.post('/BOOKMGMT/bookService/listBookDetails', function(req, res, next)
	{
		var username = req.body.username;
		var sessionid = req.body.sessionid;
		var bookid = req.body.bookid;
		
		var listbookdetailsdata=
			{
				"listBookDetailsOutput":
				[
				]
			}
		
		database.query('select 1 from bookmgmt.bm_user where username = ? and sessionid = ?', [username, sessionid], function(error, results)
		{
			if(results.length==0)
			{
				console.log("Unauthorized Access");
				ret="Failed";
				return res.send(ret);
			}
			else
			{				
				database.query('select b.book_id, a.author_id, g.genre_id from bm_book b  '+
				               'left join bm_book_author ba on ba.book_id = b.book_id '+
							   'left join bm_book_genre bg on bg.book_id = b.book_id '+
							   'left join bm_author a on a.author_id = ba.author_id '+
							   'left join bm_genre g on g.genre_id = bg.genre_id '+
							   'where b.book_id = ?', bookid, function(error, results)
				{
					if(error)
					{
						next(error);
					}
					else
					{
						var counter=0;
						results.forEach(function(bookdetails)
						{
							listbookdetailsdata.listBookDetailsOutput[counter]={};
							listbookdetailsdata.listBookDetailsOutput[counter].bookid=bookdetails.book_id;
							listbookdetailsdata.listBookDetailsOutput[counter].authorid=bookdetails.author_id;
							listbookdetailsdata.listBookDetailsOutput[counter++].genreid=bookdetails.genre_id;
						});
					}
					return res.send(listbookdetailsdata);
				});
			}
		});
	});
	
	app.post('/BOOKMGMT/bookService/createBook', function(req, res, next)
	{
		var username = req.body.username;
		var sessionid = req.body.sessionid;
		var bookname = req.body.bookname;
		var authors = req.body.authors;
		var genres = req.body.genres;
		
		var bookid="";
		var tempauthorid="";
		var tempgenreid="";
		var ret="";
		
		database.query('select 1 as auth from bookmgmt.bm_user where username = ? and sessionid = ?', [username, sessionid], function(error, results)
		{
			if(results.length==0)
			{
				console.log("Unauthorized Access");
				ret="Failed";
				return res.send(ret);
			}
			else
			{				
				//Create New Book
				database.query('insert into bookmgmt.bm_book (book_name) values ( ? )', bookname, function(error, results)
				{
					if(error)
					{
						next(error);
						ret="Failed";
						return res.send(ret);
					}
					else
					{
						database.query('select book_id from bookmgmt.bm_book where book_name = ?', bookname, function(error, results)
						{
							if(error)
							{
								ret="Failed";
								next(error);							
							}
							else
							{
								bookid=results[0].book_id;
								
								//Handle Authors
								authors.forEach(function(author)
								{
									if(isNaN(author))
									{
										database.query('insert into bookmgmt.bm_author (author_name) values ( ? )', author, function(error, results)
										{
											if(error)
											{
												next(error);
											}
											else
											{
												database.query('select author_id from bookmgmt.bm_author where author_name = ?', author, function(error, results)
												{
													if(error)
													{
														next(error);
													}
													else
													{
														tempauthorid=results[0].author_id;
														database.query('insert into bookmgmt.bm_book_author values ( ? , ? )', [bookid, tempauthorid], function(error, results)
														{
															if(error)
															{
																next(error);
															}
														});
													}
												});
											}
										});
									}
									else
									{
										database.query('insert into bookmgmt.bm_book_author values ( ? , ? )', [bookid, author], function(error, results)
										{
											if(error)
											{
												next(error);
											}
										});
									}
								});
								
								//Handle Genres
								genres.forEach(function(genre)
								{
									if(isNaN(genre))
									{
										database.query('insert into bookmgmt.bm_genre (genre_name) values ( ? )', genre, function(error, results)
										{
											if(error)
											{
												next(error);
											}
											else
											{
												database.query('select genre_id from bookmgmt.bm_genre where genre_name = ?', genre, function(error, results)
												{
													if(error)
													{
														next(error);
													}
													else
													{
														tempgenreid=results[0].genre_id;
														database.query('insert into bookmgmt.bm_book_genre values ( ? , ? )', [bookid, tempgenreid], function(error, results)
														{
															if(error)
															{
																next(error);
															}
														});
													}
												});
											}
										});
									}
									else
									{
										database.query('insert into bookmgmt.bm_book_genre values ( ? , ? )', [bookid, genre], function(error, results)
										{
											if(error)
											{
												next(error);
											}
										});
									}
								});
								ret="Success";
								return res.send(ret);
							}
						});
					}
				});
			}
		});
	});
	
	app.post('/BOOKMGMT/bookService/editBook', function(req, res, next)
	{
		var username = req.body.username;
		var sessionid = req.body.sessionid;
		var bookid = req.body.bookid;
		var authors = req.body.authors;
		var genres = req.body.genres;
		
		var tempauthorid="";
		var tempgenreid="";
		var ret="";
		
		database.query('select 1 from bookmgmt.bm_user where username = ? and sessionid = ?', [username, sessionid], function(error, results)
		{
			if(results.length==0)
			{
				console.log("Unauthorized Access");
				ret="Failed";
				return res.send(ret);
			}
			else
			{				
				//Clear Book_Author
				database.query('delete from bookmgmt.bm_book_author where book_id = ?', bookid, function(error, results)
				{
					if(error)
					{
						next(error);
					}
				});
				
				//Handle Authors
				authors.forEach(function(author)
				{
					if(isNaN(author))
					{
						database.query('insert into bookmgmt.bm_author (author_name) values ( ? )', author, function(error, results)
						{
							if(error)
							{
								next(error);
							}
							else
							{
								database.query('select author_id from bookmgmt.bm_author where author_name = ?', author, function(error, results)
								{
									if(error)
									{
										next(error);
									}
									else
									{
										tempauthorid=results[0].author_id;
										database.query('insert into bookmgmt.bm_book_author values ( ? , ? )', [bookid, tempauthorid], function(error, results)
										{
											if(error)
											{
												next(error);
											}
										});
									}
								});
							}
						});
					}
					else
					{
						database.query('insert into bookmgmt.bm_book_author values ( ? , ? )', [bookid, author], function(error, results)
						{
							if(error)
							{
								next(error);
							}
						});
					}
				});
				
				//Clear Book_Genre
				database.query('delete from bookmgmt.bm_book_genre where book_id = ?', bookid, function(error, results)
				{
					if(error)
					{
						next(error);
					}
				});
				
				//Handle Genres
				genres.forEach(function(genre)
				{
					if(isNaN(genre))
					{
						database.query('insert into bookmgmt.bm_genre (genre_name) values ( ? )', genre, function(error, results)
						{
							if(error)
							{
								next(error);
							}
							else
							{
								database.query('select genre_id from bookmgmt.bm_genre where genre_name = ?', genre, function(error, results)
								{
									if(error)
									{
										next(error);
									}
									else
									{
										tempgenreid=results[0].genre_id;
										database.query('insert into bookmgmt.bm_book_genre values ( ? , ? )', [bookid, tempgenreid], function(error, results)
										{
											if(error)
											{
												next(error);
											}
										});
									}
								});
							}
						});
					}
					else
					{
						database.query('insert into bookmgmt.bm_book_genre values ( ? , ? )', [bookid, genre], function(error, results)
						{
							if(error)
							{
								next(error);
							}
						});
					}
				});
				ret="Success";
				return res.send(ret);
			}
		});
	});

	app.post('/BOOKMGMT/bookService/deleteBook', function(req, res, next)
	{
		var username = req.body.username;
		var sessionid = req.body.sessionid;
		var bookid = req.body.bookid;
		
		var ret="";
		
		database.query('select 1 from bookmgmt.bm_user where username = ? and sessionid = ?', [username, sessionid], function(error, results)
		{
			if(results.length==0)
			{
				console.log("Unauthorized Access");
				ret="Failed";
				return res.send(ret);
			}
			else
			{
				//Clear Book_Author
				database.query('delete from bookmgmt.bm_book_author where book_id = ?', bookid, function(error, results)
				{
					if(error)
					{
						next(error);
						ret="Failed";
						return res.send(ret);
					}
				});
				
				//Clear Book_Genre
				database.query('delete from bookmgmt.bm_book_genre where book_id = ?', bookid, function(error, results)
				{
					if(error)
					{
						next(error);
					}
				});
				
				//Clear Book
				database.query('delete from bookmgmt.bm_book where book_id = ?', bookid, function(error, results)
				{
					if(error)
					{
						next(error);
					}
					else
					{
						ret="Success";
						return res.send(ret);
					}
				});
				
				
			}
		});
	});	
}