How to use:

Setup a webserver point the html directory to the client folder.

To run in a test environment use npm start in the main project folder.

To run in a production environment install pm2

```
sudo npm install pm2 -g
```

and use pm2 to manage and launch the application.

```
sudo pm2 start server
```

To run the application on system startup use:

```
pm2 startup ubuntu
```

or substitute your distro, this will generate a command for you that you will need to copy and run.

once you have successfully run the command the node.js application will run on startup.


