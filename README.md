<h1>Installating Heavy-lifting.</h1>
<hr>
<div class="row">
	<div class="col-md-3">
		<ul class="nav nav-pills nav-stacked">
			<li role="presentation"><a href="/introduction">Introduction</a></li>
			<li role="presentation"><a href="/specifications">Specifications</a></li>			
			<li role="presentation" class="active"><a href="/installation">Installation Instructions</a></li>
			<li role="presentation"><a href="/integration">Third Party Integration</a></li>
			<li role="presentation"><a href="/payments">Payment Integration</a></li>
			<li role="presentation"><a href="/css">CSS Management</a></li>
			<li role="presentation"><a href="/troubleshooting">Troubleshooting</a></li>
			<li role="presentation"><a href="/licence">Licence</a></li>
		</ul>
	</div>
	<div class="col-md-9">

<h3>Installation Instructions</h3>
<p>If you would like to install Fraternate on your local development machine Fraternate requires the following components:</p>

<pre>
Node.js
MongodB
The GitHub Fraternate repo
expressjs
</pre>
<h3>In more detail.</h3>

<p>Install Node.js Download and install from the Node.js homepage.</p>

<pre><a href="https://nodejs.org/en/">https://nodejs.org/en/</a>&nbsp;</pre>

<p>Install mongodB | follow the set-up instructions on the website. (The trick is to create the c:/data/db directory then run mongod.exe). When in doubt the documentation on the site is very good. Download and install from the mongodB homepage.</p>

<pre><a href="https://www.mongodb.com/">https://www.mongodb.com/</a>&nbsp;</pre>

<p>Sign up for GitHub, install the windows GitHub client then clone the Fraternate repository.</p>
<p>Clone the repository on your hard drive, using the "clone or download" button on the GitHub front page for Fraternate.</p>
<pre>https://github.com/Isithelo/Fraternate.git</pre>
<p>Once downloaded, extract to the directory of your choice. For example:</p>

<pre>C:\Fraternate</pre>

<p>With node.js installed, the use of the NPM (Node Package Manager) service is now available from your command prompt, go into the directory where Fraternate was cloned using your preferred command prompt (DOS interface). For example:</p>

<pre>cd\Fraternate</pre>

<p>When you are at the command prompt in the correct directory, type in the following:</p>

<pre>npm install npm@latest -g</pre>

<p>The NPM service will now download and install into the cloned directory. The NPM service will now download and install into the cloned directory. When completed, enter the following:</p>

<pre>npm install</pre>

<p>To bring in the favicon (tab icons) server, use the following at the command prompt to install the favicon module.</p>

<pre>npm install serve-favicon</pre>

<p>To make life much easier, install nodemon. Nodemon provides some welcome server management for troublesome server crashes, type into the cmd(command) prompt:</p>

<pre>npm install -g nodemon</pre>

<p>To communicate between the mongo server and the client side, expressjs needs to be installed. type into the cmd prompt</p>

<pre>npm install express</pre>

<p>To send mails from the signup and contact page, nodemailer needs to be installed. type into the cmd prompt</p>

<pre>npm install nodemailer</pre>


<p>Robomongo is a very useful tool for viewing the mongodb database structure. Install from their website.</p>

<p>Download and install from the mongodb homepage.</p>

<pre><a href="https://robomongo.org/">https://robomongo.org/</a></pre>

<p>To ensure non-robotic users sign in and signup, install the express recaptcha package.</p>

<pre>npm install express-recaptcha -save</pre>

<p>To add commercialization aspects for client and server side handling of credit card payments.</p>

<pre>npm install braintree</pre>


<h3>The .ENV File.</h3>
<p>All of the magic on your localhost is managed by the .ENV file , here you would add your smtp host setting , recaptcha keys etc. Some example values are shown below.</p>
<p>When installation is done on Heroku , the keys should be added to the Settings tab , in the "reveal config variable" area.</p>
<pre>
SESSION_SECRET='6681esdf3a9cb922b14ff4b5b3a9b03f95ba520e017f5a23453f6e2792965d4e063'

MONGODB='localhost'

GOOGLE_ID='942595912716-lrvbstvgdfd8em4sugjmvsu3jk6p6tgo0m74.apps.googleusercontent.com'
GOOGLE_SECRET='9G5ZoRffKQ-cKiT9M0Ahsb2E4g'

GITHUB_ID='800aa9e14a3asd6b3e981f2'
GITHUB_SECRET='a87511fe094gdffde0b71de968691cbdb23265cf4f0'

SITE_KEY='6Le2aCcUAAAAAO8g693sddE9uMACIv7L-DeAbDZc67-'
SECRET_KEY='6Le2aCcUAAAAANzOY5iqXP94Kc76sas8FsZr1kxBMMZ'

MAIL_PORT='451'
MAIL_USERNAME='bla@bla.com'
MAIL_PASSWORD='--- add your details here ---'
</pre>



<h3>Getting data for your localhost server</h3>
<p>This will delete your current local host database , Be careful!</p>
<pre>
/////////////////////////////DANGER/////////////////////////////
mongodump -h ds163156.mlab.com:63156 -d heroku_g6k9j63s -u heroku_g6k9j63s -p t6e1adq1dsmn5p25klnl60dcbb -o ~/tmp/mongodump/test/test
/////////////////////////////DANGER/////////////////////////////	
</pre>
<pre>
/////////////////////////////DANGER/////////////////////////////
mongorestore -d databasename -c test.bson ~/tmp/mongodump/test/test
/////////////////////////////DANGER/////////////////////////////	
</pre>


	</div>
</div>
</div>
