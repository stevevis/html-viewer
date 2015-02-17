# HTML Viewer and Summarizer

This web app fetches the HTML from a given URL and displays the source to the user. A summary of the document is displayed, listing which tags are present in the HTML and how many of each tag. Clicking on the name of each tag in the summary will highlight the tags in the source code view.

![Screenshot](screenshot.png?raw=true)

## Implementation Details

### Technology Used

- [Koa](http://koajs.com/) - The framework for the back-end web server of the app
- [React](http://facebook.github.io/react/) - Used to create the front-end view components
- [Bootstrap](http://getbootstrap.com/) - Used as the front-end HTML/CSS framework
- [Browserify](http://browserify.org/) - For bundling Javascript dependenices and using require() on the front-end
- [Prism](http://prismjs.com/) - For doing syntax highlighting on the HTML source code being viewed
- [htmlparser2](https://github.com/fb55/htmlparser2) - Used to parse the HTML and count the number of each tag

### Description

This app displays a single page to the user containing a form that lets the user enter the URL of another web site. When the user enters a valid URL and hits the request button, an AJAX request is sent to the servers /summary endpoint with the requested URL in a query string parameter.

On the server, the request is handled by the SummaryController, which validates the URL provided in the query string and makes an HTTP request to get the HTML content at the URL. The HTML content is passed through an HTML parser in order to count the number of times each HTML tag occurs in the source. This is done by creating a map of tags e.g.

```
tags: {
  html: 1,
  body: 1,
  div: 3,
  a: 4,
  img: 2
}
```

This map of tags is converted into an array and sorted by count, then returned to the client along with the original HTML source. The HTML source and the list of tags and their counts are then rendered on the page. The HTML source is parsed by the Prism syntax highlighting library. 

I added a hook into the Prism library so that whenever it encounters one of the tags in the tags array, it adds an extra CSS class to marked up source . For example, when it encounters a `<div>`, Prism wraps the tag in a span like `<span><div><span>` and the hook will add a class to that span like `<span class="tag-div"><div></span>`. This lets us highlight all instances of a tag in the source when a tag button is pressed by modifying the style of the class with the tag name.

### Issues Encountered

I originally wanted to append the extra CSS classes for tag highlighting to the HTML in the back-end as I was streaming it through the HTML parser. However, I quickly realized that this would have affected the source that the user would view, so I had to process the HTML again on the client side to append the extra classes for highlighting. This could probably be combined into a single step by running the Prism highlight function on the back-end.

### Improvements

- Use [Gulp](http://gulpjs.com/) to manage build tasks
- Minify application CSS file
- Concatenate vendor CSS files into a single file
- Concatenate vendor javasscript files into a single file
- Add live reloading to the dev server
- Sort tags with the same count alphabetically
- Implement sorting and filtering for the tag list
- When a tag button is clicked scroll to the first occurance in the source
- Lets tags in the source be clicked to highlight all occurances
