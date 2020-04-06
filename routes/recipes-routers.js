const router = require('express').Router();
const multer = require('multer');
const { db } = require('../config/postgresql-setup');

// const uploadPath =  __dirname + '\uploads\images'

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/images')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
});

const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(new Error('only jpeg or png'), false);
	}
}

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});


//upload an image
router.post('/uploadImage', upload.single('recipeImage'), (req, res) => {
    if(req.file) {
        res.json(req.file.filename);
    }
    else {
    	res.json('no file uploaded')
    };
});

//insert a recipe to the db
router.post('/addRecipe', (req, res) => {
	const { email, title, image, instructions, ingredients } = req.body;
	if (!title || !instructions || !ingredients) {
		return res.status(400).json('incorrect form submission');	
	}
	db.insert({
				title: title,
				email: email,
				image: image,
				instructions: instructions,
				ingredients: ingredients
	    })
		.into('recipes')
		.returning('*')
		.then(recipe =>{
			res.json(recipe);
		} );	
});

router.get('/:email', (req, res) => {
	const email  = req.params.email;
	db('recipes').where('email', email).then(recipes => res.json(recipes));
});

router.get('/getRecipe/:id', (req, res) => {
	const id  = req.params.id;
	db('recipes').where('id', id).then(recipe => {
		res.json(recipe[0])});
});

module.exports = router;