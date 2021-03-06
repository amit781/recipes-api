const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const authRoutes = require('./routes/auth-routers')
const apiRoutes = require('./routes/api-routers')
const recipesRoutes = require('./routes/recipes-routers')
const { db } = require('./config/postgresql-setup');
const urlsConfig = require('./config/urls-config');

const config = {
    origin: urlsConfig.CLIENT_HOME_PAGE_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'application/json', 'text/html']
};

const app = express();

app.use(cors(config));
app.options('*', cors(config));
app.use(express.json());

app.use(cookieSession({
	maxAge: 24 * 60 * 60 * 1000,
	keys: [process.env.sessionCookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/recipes', recipesRoutes);

app.get('/' , (req, res) => {
	res.send('it is working');
})
app.use('/recipes', recipesRoutes);
app.listen(process.env.PORT || 4000, () => {
	console.log(`app is running on port ${process.env.PORT}`)
})