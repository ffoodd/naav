# naav

It's currently *making* HTML/CSS/JS files.

## How to

Two cases:

1. You only need compiled files:
 * HTML files are at project's root; HTML partials are included in `src/templates/`;
 * Assets (CSS, JS, images, fonts) are in `dist/`;
 * That's all!
2. You wanna work within the project, let's talk.

### Work in Progress

Watch your head.

This project relies on Node to ease the workflow. So you'll have to install:
* [NodeJS](https://nodejs.org/en/) — I recommend the current version;
* [npm](https://www.npmjs.com/), that comes along with NodeJS.

When Node is ready to go, just `cd` to `naav` and run `npm install`.

Then you'll be able to work. Those Gulp tasks are available:
* `gulp sass` to compile your `src/scss/*.scss` files — using Autoprefixer: I suggest [browserl.ist](http://browserl.ist/) to check which browsers are concerned;
* `gulp js` to minify your `src/js/*.js` files;
* `gulp axe` will perform automatic checks for *accessibility* using aXe Webdriver: it runs a browser and checks every URLs listed in the `let test` variable array. Be sure to populate it with paths to any sensible template;
* `gulp watch` to run and watch sass/js/img tasks;
* `gulp nunjucks` to compile HTML templates and generate HTMl files at project's root — Nunjucks is *very* similar to Twig, that should help;
* `gulp sync` (default task) to sync your browsers and watch to JS, CSS and HTML/Nunjucks changes, serving HTML files behind `localhost:3000`.

You might want to use any of these tasks, but I recommend to run `gulp` to work comfortably.

For now, this works like a charm :)
