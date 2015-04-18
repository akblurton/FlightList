var gulp = require("gulp"),
	less = require("gulp-less"),
	prefix = require("gulp-autoprefixer"),
	sync = require("browser-sync").create();

var reload = sync.reload;


// Serve files via browser sync
gulp.task("serve", ["less"], function() {
	sync.init({
		"server" : "./"
	});

	gulp.watch("less/*.less", ["less"]);
	gulp.watch(["**/*.html", "js/**/*.js"]).on("change", reload);
});

// LESS watching
gulp.task("less", function() {
	return gulp.src("less/*.less")
		.pipe(less())
		.pipe(prefix({
			"browsers" : ["last 2 versions"]
		}))
		.pipe(gulp.dest("css"))
		.pipe(reload({"stream": true}));
});

gulp.task("default", ["serve"]);