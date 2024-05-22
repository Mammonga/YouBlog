import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let posts = [];

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// Middleware to parse POST request body
app.use(bodyParser.urlencoded({ extended: true }));

// Render the form for creating a new post
app.get("/new", (req, res) => {
    res.render("form");
});

// Handle the form submission
app.post("/submit", (req, res) => {
    const newPost = { id: Date.now().toString(), title: req.body.title, content: req.body.content };
    posts.push(newPost);
    res.redirect("/posts");
});

// Render the list of posts
app.get("/posts", (req, res) => {
    res.render("index", { posts });
});

// Render the form for editing a post
app.get('/posts/:id/edit', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    res.render('edit', { post });
});

// Handle the form submission for editing a post
app.post('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    post.title = req.body.title;
    post.content = req.body.content;
    res.redirect('/posts');
});

// Handle the deletion of a post
app.post('/posts/:id/delete', (req, res) => {
    posts = posts.filter(p => p.id !== req.params.id);
    res.redirect('/posts');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
