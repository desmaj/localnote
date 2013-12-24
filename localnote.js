var app = angular.module('localnote', ['ngRoute']);

app.factory('Notes', function () {
    
    /* LocalStorageNotes is a note storage implementation backed by the
       localStorage API. It's worth noting that data is stored as
       strings, so we'll have to serialize our note objects to a string
       representation to store them. JSON seems a reasonable representation..
     */
    
    var LocalStorageNotes = function (storage) {
	this._storage = storage
    }
    
    // We'll use a timestamp as the identifier for our notes
    LocalStorageNotes.prototype._createID = function (note) {
	return (new Date()).getTime();
    }
    
    LocalStorageNotes.prototype._serialize = function (note) {
	return JSON.stringify({id: note.id,
			       timestamp: note.timestamp.getTime(),
			       title: note.title,
			       contents: note.contents
			      });
    }
    
    LocalStorageNotes.prototype._deserialize = function (string) {
	var data = JSON.parse(string);
	return {id: data.id,
		timestamp: new Date(parseInt(data.timestamp)),
		title: data.title,
		contents: data.contents
		};
    }
    
    LocalStorageNotes.prototype.get = function (id) {
	return this._deserialize(this._storage['note-' + id]);
    }
    
    LocalStorageNotes.prototype.save = function (note, cb) {
	// A new note has no id; we'll have to add one.
	if (!note.id) {
	    note.id = this._createID(note);
	}
	note.timestamp = new Date();
	this._storage['note-' + note.id] = this._serialize(note);
	if (cb) {
	    cb();
	}
    }
    
    LocalStorageNotes.prototype.remove = function (note, cb) {
	this._storage.removeItem('note-' + note.id);
	if (cb) {
	    cb();
	}
    }
    
    LocalStorageNotes.prototype.all = function () {
	var items = [];
	for (var i=0; i<this._storage.length; i++) {
	    var key = this._storage.key(i);
	    if (/note-\d+/.test(key)) {
		items.push(this._deserialize(this._storage[key]));
	    }
	}
	return items;
    }
    
    return new LocalStorageNotes(localStorage);
    
});

app.config(function($routeProvider) {
    $routeProvider
	.when('/', {
	    controller:'ListController',
	    templateUrl:'list.html'
	})
	.when('/edit/:noteId', {
	    controller:'EditController',
	    templateUrl:'edit.html'
	})
	.when('/new', {
	    controller:'CreateController',
	    templateUrl:'edit.html'
	})
	.otherwise({
	    redirectTo:'/'
	});
});

app.controller('ListController', function ($scope, Notes) {
    $scope.notes = Notes.all();
});

app.controller('CreateController', function ($scope, $location, $timeout, Notes) {
    $scope.save = function () {
	Notes.save($scope.note, function () {
	    $location.path('/');
	});
    }
});

app.controller('EditController', function ($scope, $location, $routeParams, Notes) {
    $scope.note = Notes.get($routeParams.noteId);
    
    $scope.destroy = function() {
	Notes.remove($scope.note, function () {
	    $location.path('/');
	});
    };
    
    $scope.save = function () {
	Notes.save($scope.note, function () {
	    $location.path('/');
	});
    }
});
