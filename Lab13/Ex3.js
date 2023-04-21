// load file system interface
var fs = require("fs");
var filename = __dirname + "/user_data.json";

if (fs.existsSync(filename)) {
	var fsize = fs.statSync(filename).size;
	console.log(`user_data.json has ${fsize} characters!`);
	// read in user data
	var user_data_obj_JSON = fs.readFileSync(filename, "utf-8");

	// convert user data JSON to object
	var user_data = JSON.parse(user_data_obj_JSON);

	// get password for user kazman
	var username = "kazman";
	console.log(
		`The password for user ${username} is ${user_data[username].password}`
	);
} else {
	console.log(`Hey! I couldn't find ${filename} :(`);
}

var express = require("express");
var app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
	// Give a simple login form
	str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
	response.send(str);
});

app.post("/login", function (request, response) {
	// Process login form POST and redirect to logged in page if ok, back to login page if not
	console.log(request.body);
	var username = request.body("username");
	var password = request.body("password");

	// check if username is in user data
	if (user_data.hasOwnProperty(username)) {
		errors[`username_error`] = `${username} is not a registered email!`;
		// check to see if user's password matches password saved, entered
	} else if (password !== user_data[username].password) {
		errors[`password_error`] = `Password is incorrect!`;
		response.send(`got ${username}`);
	} else {
		var username = "newuser";
		var users_reg_data = {};
		users_reg_data[username] = {};
		users_reg_data[username].password = "newpass";
		users_reg_data[username].email = "newuser@user.com";

		var reg_data = JSON.stringify(users_reg_data, null, 2);

		fs.writeFileSync("user_data.json", reg_data);
	}
});

app.get("/register", function (request, response) {
	// Give a simple register form
	str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
	response.send(str);
});

app.post("/register", function (request, response) {
	// process a simple register form
	if (request.body.username !== user_data.username)
		{fs.writeFileSync("user_data.json", request.body);
		response.redirect(`/login`)}
});

app.listen(8080, () => console.log(`listening on port 8080`));
