var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

DataLinkProvider = function(host, port) {
  this.db= new Db('caquijs', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


DataLinkProvider.prototype.getCollection= function(callback) {
  this.db.collection('datalinks', function(error, employee_collection) {
    if( error ) callback(error);
    else callback(null, employee_collection);
  });
};

//find all datalinks
DataLinkProvider.prototype.findAll = function(query, callback) {
    var search = query.search;
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        employee_collection.find({ $or: [{tags: new RegExp(search, 'i')}, {title: new RegExp(search, 'i')}, {description: new RegExp(search, 'i')} ]}).sort({created_at: -1}).toArray(function(error, results) {
          if( error ) callback(error)
          else {
            var results_search = results;
            employee_collection.find().sort({created_at: -1}).toArray(function(error, results) {
              if( error ) callback(error)
              else callback(null,results_search, results)
            });
          }
        });
      }
    });
};

//find an employee by ID
DataLinkProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        employee_collection.findOne({_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


//save new employee
DataLinkProvider.prototype.save = function(datalinks, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        if( typeof(datalinks.length)=="undefined")
          datalinks = [datalinks];

        for( var i =0;i< datalinks.length;i++ ) {
          employee = datalinks[i];
          employee.created_at = new Date();
        }

        employee_collection.insert(datalinks, function() {
          callback(null, datalinks);
        });
      }
    });
};

// update an employee
DataLinkProvider.prototype.update = function(employeeId, datalinks, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error);
      else {
        employee_collection.update(
					{_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)},
					datalinks,
					function(error, datalinks) {
						if(error) callback(error);
						else callback(null, datalinks)
					});
      }
    });
};

//delete employee
DataLinkProvider.prototype.delete = function(employeeId, callback) {
	this.getCollection(function(error, employee_collection) {
		if(error) callback(error);
		else {
			employee_collection.remove(
				{_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)},
				function(error, employee){
					if(error) callback(error);
					else callback(null, employee)
				});
			}
	});
};

exports.DataLinkProvider = DataLinkProvider;