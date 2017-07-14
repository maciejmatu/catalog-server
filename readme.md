## Catalog Server

#### Project description
Backend for Catalog application. IF you want to know more, you can visit the [Catalog Web App Repo](https://github.com/maciejmatu/catalog-web-app).

All comments, and suggestions are welcome. You can send me an email, or open an issue.

#### Technical description
Below, I added a todo list, where I point out things I need to accomplish, to make this project better. When it comes to TypeScript, I'm trying to follow [Basarat TypeScript style guide](https://basarat.gitbooks.io/typescript/docs/styleguide/styleguide.html), but right now, I need to clean up the code a bit, and make use of static types, since I'm not using them in full potential.

- [ ] Make more use of static types
- [ ] Create tests
- [ ] Setup debugging environment
- [ ] Implement Continuous Integration and Continuous Deployment
- [ ] Read about and implement REST Api security standards

Technologies used:
- node.js
- mongoose
- mongo
- typescript
- bcrypt.js
- express
- nodemailer
- passport

### Endpoints
Current available endpoints:
```
/api/me (GET)
/api/users - (GET) - admin
/api/auth/register - (POST) - member
/api/auth/login - (POST) - all
/api/auth/forgot-password - (POST) - all
/api/auth/reset-password - (POST) - all
```

### Starting server
To start the server run `npm start`. If you want the email reset process to work, you also need to specify SMTPS env variable, so the full command would look something like `SMTPS='smtps://xxxx10%40gmail.com:xxxxxxx@smtp.gmail.com' npm start`. Of course gmail is not required. You can use any other serice that supports smtps.
