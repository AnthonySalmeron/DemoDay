# DemoDay
link: https://sheltered-ridge-28038.herokuapp.com/
![home page](public/images/Capture.PNG)
# Installation

1. Clone repo
2. run `npm install`
3. Make config folder to store your personal credentials, this will be Azure, mailer, MongoDB database, and passport configurations

# Usage

1. run `node server.js`
2. Navigate to `localhost:4000`

# Core Technologies Used
- EJS
- CSS 
- JS
- NodeJS
- MongoDB, Mongoose
- Azure Cognitive Services, Azure Storage Blobs

## How it Works:
# Main Page: 
Landing page is an introduction to the type of content you expect to see on the website. When the call is made to the server to render it, the server takes from the database a list of the top 7 most viewed articles and displays them along with their corresponding pictures. The content is actually stored in text files within blob storage so to read their content, some javascript is needed on this page. One of the things passed to the ejs is an object with information from the database, it includes titles, keywords, and most importantly, the url location of the stored assets. Images can be directly loaded from this but to load a text doc, we first load the url on to the page in a P tag with a class of getText. Then with javascript, we gather all of the elements with that class, record all of their url links, and make fetch requests to Azure that will get back readable streams of data. We decode that data with the built in TextDecoder, it'll all be in one chunk. We then plug that chunk right back in to the location from where we took the url. Each article section also has anchor links that will perform a search operation to find the full article if they are clicked. When a user is logged in, the operations on this page are slightly different. Instead of taking the most popular articles, the results are tailored specifically to the reading history of the user, more on that in the miscellaneous section below.
# Sidebar
Top of sidebar is a search input section, when a user presses enter, it will tell the server to run a search through the database. To facilitate this, we use a fuzzy search module called Fuze which allows some leeway in spelling and grammar in order to comb through the database. It will search through titles, keywords, authors, dates, and machine learning keywords(more on that later) to determine possible matches. It will only returns matches which have a decent possibility of being correct and will order the returns from most to least likely. These matches will then be passed to a "search" ejs page which will render the articles that match the query, as well as links to get their full text. Below this is the navigation which takes the user through different search categories, their profile page, and the main page of the website. Each of the categorical navigation tabs will use the same search route as the general search from above but will include a "category" search parameter. They will search through specific categories in the database and render in the "search" ejs page the top eleven matches for the query based on popularity. Below this is just ad space, it has filler content as of now.
# Profile
On the profile page, the first things that render are two select inputs; one for deleting interests (that you specified in signup), and one for adding them. Something that might appear based on situation is a loader which indicates that the user will be able to upload (when the loader animation stops). As for the uploading, the way it works in this application is that articles must be peer reviewd to be eligible for viewership and download that. In this environment, they will be peer reviewed by people who have interests that match up with the initial categorization of the uploaded files. While there are articles to be reviewed, that haven't been uploaded by the user, and the user hasn't sent in a review yet, a form will appear that will have the full article, a link to be able to download the article, and a textarea that will contain the user's review


