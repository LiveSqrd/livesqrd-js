 /* ===================================
 	Parts are inspired by Backbone.js 
 	=================================== 
	currently require jquery and underscore
 */


(function(root, factory){
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      root.LSQ = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore')
    ,https 	= require('https');
    factory(root, exports, _,https);

  // Finally, as a browser global.
  } else {
    root.LSQ = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, LSQ, _, $) {


  var previousLSQ = root.LSQ;
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;
  LSQ.VERSION = '0.1.3';
  LSQ.$ = $;
  LSQ.noConflict = function() {
    root.LSQ = previousLSQ;
    return this;
  };

	LSQ.setup = function(host,token,options){
		this.host  = host;
		this.token  = token;
		this.options = _.isObject(options) ? options : {};
		this.options = _.defaults(this.options,{"apiVersion":"v1"});
		return this;
	}

	LSQ.create = function(collection,data,options,callback){
		callback = _.isFunction(callback)? callback : function(){};

		if(_.isFunction(options)){
		callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}
		if(_.isFunction(data)){
			callback = data;
			data = {};
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		data = {model:data};
		data.key = collection;
		
		this.apiCall("create",data,options,callback)
			
	}

	LSQ.read = function(collection,data,options,callback){
		callback = _.isFunction(callback)? callback : function(){};

		if(_.isFunction(options)){
			callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}

		if(_.isFunction(data)){
			callback = data;
			data = {};
		}
		if(_.isString(data)){
			data = {id:data}
		}else{
			data = {query:data}
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		data.key = collection;
		this.apiCall("read",data,options,callback)
			
	}

	LSQ.update = function(collection,data,model,options,callback){
		callback = _.isFunction(callback)? callback : function(){};

		if(_.isFunction(options)){
			callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}

		if(_.isFunction(model) || _.isString(model)){
			callback("error no data",{})
			return;
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		if(_.isString(data)){
			data = {id:data}
		}else{
			data = {query:data}
		}
		data.model = model;
		data.key = collection;
		this.apiCall("update",data,options,callback)
			
	}
	LSQ.delete = function(collection,data,options,callback){
		callback = _.isFunction(callback)? callback : function(){};

		if(_.isFunction(options)){
		callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}
		if(_.isFunction(data)){
			callback = data;
			data = {};
		}

		if(_.isString(data)){
			data = {id:data}
		}else{
			data = {query:data}
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		data.key = collection;
		this.apiCall("delete",data,options,callback)
			
	}
	LSQ.count = function(collection,data,options,callback){
		

		if(_.isFunction(options)){
			callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}
		if(_.isFunction(data)){
			callback = data;
			data = {};
		}

		if(_.isString(data)){
			data = {id:data}
		}else{
			data = {query:data}
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		data.key = collection;
		this.apiCall("count",data,options,callback)
			
	}

	LSQ.aggregate = function(collection,data,options,callback){
		

		if(_.isFunction(options)){
			callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}
		if(_.isFunction(data)){
			callback = data;
			data = {};
		}

		if(_.isString(data)){
			data = {id:data}
		}else{
			data = {query:data}
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		data.key = collection;
		this.apiCall("aggregate",data,options,callback)
			
	}

	LSQ.apiCall = function(method,data,options,callback){

		if(this.$ && _.isFunction(this.$.ajax))
			httpsApi(this,method,data,options,callback)
		 else
		 	httpsNode(this,method,data,options,callback)
		
	}

	LSQ._objToPaths = _objToPaths;
	LSQ._has = _has;
	LSQ._get = _get;
	LSQ._set = _set; 
	LSQ.clean = existsClean; 
	LSQ.validation = validation; 

	function httpsApi(self,method,data,options,callback){
		var op 		= {}
		,body 		= {token:self.token}
		,key;	

		if(_.isFunction(options)){
			callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}
		if(_.isFunction(data)){
			callback = data;
			data = {};
		}

		
		op.url  		= "https://"+self.host+"/api/"+self.options.apiVersion+"/"+data.key;
		//op.contentType 	= "application/json";
		op.type 		= "POST";
		op.dataType		= "json";
		op.async 		= false;
		op.cache 		= false;
		op.crossDomain	= true;
		//op.xhrFields 	=  {withCredentials: true}
		body			= _.extend(body,options);
		body.model 		= _.isObject(data.model) ? data.model : {};
		body.query 		= _.isObject(data.query) ? data.query : {};
		


		if(_.isString(data.id))
			body.id = data.id;

		if(_.has(self.options,"user")&&_.has(self.options,"pass")){
			//op.beforeSend = function (xhr) { xhr.setRequestHeader("Authorization", "Basic " + btoa(unescape(encodeURIComponent(self.options.user+":"+self.options.pass)))) ;}
			op.password = self.options.pass;
			op.username = self.options.user;
			// console.log(op)
		}
	
		switch(method){
			case "create":
				body.request= "create";
				if(_.isEmpty(body.model)) return callback("model is empty",{})
			break;
			case "update":
				body.request= "update";
				if(_.isEmpty(body.model)) return callback("model is empty",{})
			break;
			case "delete":
				body.request= "delete";
				if(_.isEmpty(body.query)) return callback("query is empty",{})
			break;
			default:
				body.request= "read";
			break;
		}
		try {
			op.data 		= {data:JSON.stringify(body)};
		}catch(e){
			return callback("your data can't be saved as json",e)
		}
		$.ajax(op)
			.success(function(data, status, xhr){
				callback('',data.result,data.total,data,status);
			})
			.error(function(xhr, errorType, error){
				console.log(xhr,error,errorType)
				callback(error,{},null,op,errorType);
			})
	}

	function httpsNode(self,method,data,options,callback){
		var op 		= {}
		,result 	= ""
		,error 		= null
		,body 		= {token:self.token}
		,key
		,req;	

		if(_.isFunction(options)){
			callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}
		if(_.isFunction(data)){
			callback = data;
			data = {};
		}

		if(!_.isFunction(callback))
			callback = function(){};

			op.host 		= self.host;
			op.port 		= 443;
			op.method 		= "POST";
			op.path 		= "/api/"+self.options.apiVersion+"/"+data.key;
			body			= _.extend(body,options);
			body.model 		= _.isObject(data.model) ? data.model : {};
			body.query 		= _.isObject(data.query) ? data.query : {};

		if(_.isString(data.id))
			body.id = data.id;

		if(_.has(self.options,"user")&&_.has(self.options,"pass"))
			op.auth = self.options.user +":"+self.options.pass;

		switch(method){
			case "create":
				body.request= "create";
				
				if(_.isEmpty(body.model)){
					callback("model is empty",{});
					return;
				}
			break;
			case "update":
				body.request= "update";
				
			break;
			case "delete":
				body.request= "delete";
				
			break;
			default:
				body.request= "read";
				
			break;
		}

		var d = new Buffer(JSON.stringify(body));
		op.headers ={'Content-Length': d.length,'Content-Type': 'application/json'};

		req = https.request(op, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				result +=chunk;
			});
				res.on("end",function(){
					var j = {};
					try{
						j = JSON.parse(result)
					}catch(e){
						error = e;
					}

					callback(error,j.result,j.total,j);
			})
		});
		req.on('error', function(e) {
			callback(e.message,e,result);
		});
		for(var i = 0; i < d.length; i+=500){
			var end = i+500 > d.length ? d.length: i+500 ;
			req.write(d.slice(i,end).toString(),'utf8')
		}	
		req.end();

	}

	function validation(schema,model,options){
		var self = this;
		this.options	= _.isObject(options) ? options : {};
		this.schema 	= _.isObject(schema) ? schema : {};
		this.model 		= _.isObject(model) ? model : {};
		this.originalModel = _.clone(self.model);
		this.error 		= false;
		this.errors 	= {};
		this.result 	= {};
		this.stop 		= _.isBoolean(this.options.stop) ? this.options.stop : true ;
		this.strict 	= _.isBoolean(this.options.strict) ? this.options.strict : false ;
 		var run =  ["checkExists"
					,"checkType"
					,"checkEquals"	
					,"checKSize"
					,"checkCustom"
					];

		this.validate 	= function(){
			if(!_.isObject(self.schema)) return "Schema not a Object";
			if(!_.isObject(self.model)) return "Model not a Object";
			for(var key in self.schema){
				_.defaults(self.schema[key],{require:false});
				for(var i in run){
					self.error = _.isFunction(self[run[i]]) ? self[run[i]](key) : false;	
					if(self.error && self.stop) break;
					else if(self.error){
						self.errors[key] = _.isArray(self.errors[key]) ? self.errors[key] : [];
						self.errors[key].push(self.error);
					}
				}
				if(self.strict) _set(self.result,key,_get(self.model,key));
				if(_.isString(self.error) && self.stop) break;
				self.error = false;
			}
		}
		this.setModel =  function(model){
			self.model 		= _.isObject(model) ? model : {};;
			self.originalModel = _.clone(self.model);
		}
		this.checkExists = function(key){
			if(!_.isObject(self.schema)) return "Schema not a Object";
			if(!_.isObject(self.model)) return "Model not a Object";
			var  has 	= _has(self.model,key)
				,error 	= false;
			if(!has && _.has(self.schema[key],"default")) _set(self.model,key,self.schema[key].default); 
			else if(!has && self.schema[key].require) error = key+" Not Found";
			else if(!has) error = true;
			return error;
		}
		this.checkType = function(key){
			if(!_.isObject(self.schema)) return "Schema not a Object";
			if(!_.isObject(self.model)) return "Model not a Object";
			var val = _get(self.model,key);
			
			if(!_.isString(self.schema[key].type)){
				var type = typeof val;
				self.schema[key].type = (type == "object" && _.isArray(val)) ? "array" : type;
				//return false;
			}
	
			var  error 	= false
				,schema = self.schema[key];
			self.schema[key].type = schema.type.toLowerCase();

			if(_.has(schema,"modify") && _.isFunction(schema.modify))
				_set(self.model,key,val = schema.modify(val));

			switch(schema.type){
				case "string":			
					error = _.isString(val) ? false :  key+" is not a String";
					if(!error){

						if(_.has(schema,"trim") && schema.trim)
							_set(self.model,key,val = val.trim());
						if(_.has(schema,"lowercase") && schema.lowercase)
							_set(self.model,key,val = val.toLowerCase());
						if(_.has(schema,"uppercase") && schema.uppercase)
							_set(self.model,key,val = val.toUpperCase());
						if(_.has(schema,"stripTags") && schema.stripTags)
							_set(self.model,key,val = val.replace(/<(?:.|\n)*?>/gm, ''));
						if(schema.toType == "string" && (_.isObject(val) || _.isArray(val))){
							try{
								val = JSON.stringify(val);
							}catch(e){
								return error = key+" json convert failed "+val;
							}
							_set(self.model,key,val);
						}else if(schema.toType == "string" && (_.isNumber(val) || _.isBoolean(val) )) 
							_set(self.model,key,val = val.toString());
						else if(schema.toType == "string" && _.isDate(val)) 
							_set(self.model,key,val = val.toJSON());
						else if(_.isString(val))
							return error = false;
						else
							return error = key+" this toType is not supported "+schema.toType;
					}
					break;
				case "boolean":
					if(_.has(schema,"toType")){
						if(schema.toType == "boolean" && _.isString(val)){
							if(val == "true")
								_set(self.model,key,val = true)
							else if(val == "false")
								_set(self.model,key,val = false)
							else
								return error = key+" is not a String true/false";
						}else if(_.isBoolean(val))
							return error = false;
						else
							return error = key+" this toType is not supported "+schema.toType;
					}
					error = _.isBoolean(val) ? false :  key+" is not a Boolean";
					break;
				case "number":
					if(_.has(schema,"toType")){
						if(schema.toType == "float")
							_set(self.model,key,val = parseFloat(val))
						if(schema.toType == "int")
							_set(self.model,key,val = parseFloat(val))
					}
							
					error = _.isNumber(val) ? false :  key+" is not a Number";
					break;
				case "array":
					error = _.isArray(val) ? false :  key+" is not an Array";
					break;
				case "function":
					error = _.isFunction(val) ? false :  key+" is not a Function";
					break;
				case "object":
					if(_.has(schema,"toType")){
						if(schema.toType == "object" && _.isString(val)){
							try{
								val = JSON.parse(val);
							}catch(e){
								return error = key+" json convert failed "+val;
							}
							_set(self.model,key,val);
						}else if(_.isObject(val))
							return error = false;
						else
							return error = key+" this toType is not supported "+schema.toType;
					}
					error = _.isObject(val) ? false :  key+" is not a Object";
					break;
				case "date":
					if(_.has(schema,"toType")){
						var date = new Date(val);
						if(date.toString() == "Invalid Date")
							return error = key+" schema toType can't convert to date";
						if(schema.toType == "date")
							_set(self.model,key,val = date)	
						else if(schema.toType == "string")
							_set(self.model,key,val = date.toJSON())	
						else if(schema.toType == "number")
							_set(self.model,key,val = date.getTime())	
						else
							return error = key+" this toType is not supported "+schema.toType;
					}
					var date = new Date(val);
					error = date.toString() != "Invalid Date" ? false :  key+" is not a Object";
					break;
				default:
					error = key+" has a invaild type";
					break;
			}
			return error;
		}
		this.checKSize = function(key){
			if(!_.isObject(self.schema)) return "Schema not a Object";
			if(!_.isObject(self.model)) return "Model not a Object";
			var  error = false
				,schema= self.schema[key]
				,type  = schema.type
				,val   = _get(self.model,key);
			switch(type){
				case "string":
				case "array":
					if(_.isNumber(schema.min)){
						if(schema.min > val.length)
							return error = key+" is smaller than min";
					}else if(_.has(schema,"min"))
						return error = key+" schema min is not a number";

					if(_.isNumber(schema.max)){
						if(schema.max < val.length)
							return error = key+" is larger than max";
					}else if(_.has(schema,"max"))
						return error = key+" schema max is not a number";

					if(_.isNumber(schema.length)){
						if(schema.length != val.length)
							return error = key+" is not equal to length";
					}else if(_.has(schema,"length"))
						return error = key+" schema length is not a number";

					break;
				case "number":
					if(_.isNumber(schema.min)){
						if(schema.min > val)
							return error = key+" is smaller than min";
					}else if(_.has(schema,"min"))
						return error = key+" schema min is not a number";

					if(_.isNumber(schema.max)){
						if(schema.max < val)
							return error = key+" is larger than max";
					}else if(_.has(schema,"max"))
						return error = key+" schema max is not a number";

					for(var k in ["length"])
						if(_.has(schema,k))
							return error = key+" is type "+type+" schema can not use"+k;
					break;
				case "date":
					if(_.has(schema,"min")){
						var date = new Date(schema.min);
						var valDate = new Date(val);
						if(date.toString() == "Invalid Date")
							return error = key+" schema min is not a date";
						if(valDate.toString() == "Invalid Date")
							return error = key+" value is not a date";
						if(date > valDate)
							return error = key+" is smaller than min";
					}
						

					if(_.has(schema,"max")){
						var date = new Date(schema.max);
						var valDate = new Date(val);
						if(date.toString() == "Invalid Date")
							return error = key+" schema max is not a date";
						if(valDate.toString() == "Invalid Date")
							return error = key+" value is not a date";
						if(date < valDate)
							return error = key+" is larger than max";
					}
					for(var k in ["length"])
						if(_.has(schema,k))
							return error = key+" is type "+type+" schema can not use"+k;
					break;
				case "boolean":
				case "function":
				case "object":
					for(var k in ["min","max","length"])
						if(_.has(schema,k))
							return error = key+" is type "+type+" schema can not use"+k;
					break;
				default:
					break;
			}
			return error;
		}
		this.checkEquals = function(key){
			if(!_.isObject(self.schema)) return "Schema not a Object";
			if(!_.isObject(self.model)) return "Model not a Object";
			var error = false
				,schema= self.schema[key]
				,type  = schema.type
				,val   = _get(self.model,key);
			switch(type){
				case "string":
					if(_.isString(schema.equals)){
						if(schema.equals != val)
							return error = key+" is not equal to "+schema.equals;
					}else if(_.has(schema,"equals"))
						return error = key+" schema min is not a string";

					if(_.isRegExp(schema.match)){
						if(val.match(schema.match) == null)
							return error = key+" does not match to "+schema.match;
					}else if(_.isString(schema.match)){
						try{
							if(val.match(new RegExp(schema.match)) == null)
								return error = key+" does not match to "+schema.match;
						}catch(e){
							return error = key+" schema match is not a regexp";
						}	
					}else if(_.has(schema,"match"))
						return error = key+" schema match is not a regexp";

					break;
				case "number":
					if(_.isNumber(schema.equals)){
						if(schema.equals != val)
							return error = key+" is not equal to "+schema.equals;
					}else if(_.has(schema,"equals"))
						return error = key+" schema equals is not a number";

					for(var k in ["match"])
						if(_.has(schema,k))
							return error = key+" is type "+type+" schema can not use"+k;
					break;
				case "date":
					if(_.has(schema,"equals")){
						var date = new Date(schema.equals);
						var valDate = new Date(val);
						if(date.toString() == "Invalid Date")
							return error = key+" schema max is not a date";
						if(valDate.toString() == "Invalid Date")
							return error = key+" value is not a date";
						if(date != valDate)
							return error = key+" is not equal to "+schema.equals;
					}
						
					for(var k in ["match"])
						if(_.has(schema,k))
							return error = key+" is type "+type+" schema can not use"+k;
					break;
				case "boolean":
				case "function":
					if(_.has(schema,"equals")){
						if(schema.equals !== val)
							return error = key+" is not equal to "+schema.equals;
					}
					for(var k in ["match"])
						if(_.has(schema,k))
							return error = key+" is type "+type+" schema can not use"+k;
					break;
				case "object":
				case "array":
					if(_.has(schema,"equals")){
						if(_.isEqual(schema.equals,val))
							return error = key+" is not equal to "+schema.equals;
					}
					for(var k in ["match"])
						if(_.has(schema,k))
							return error = key+" is type "+type+" schema can not use"+k;
					break;
				default:
					break;
			}
			return error;
		}
		this.validate();
		return this;
	}

	function _set(obj, loc, val, options) {
		var  separator 	= "."
			,fields 	= loc.split(separator)
			,result 	= obj;
			 options	= options || {};
		for (var i = 0, n = fields.length; i < n; i++) {
			var field = fields[i];
			if (i === n - 1) 
				options.unset ? delete result[field] : result[field] = val;
			else {
				if (typeof result[field] === 'undefined' || ! _.isObject(result[field]))
					result[field] = {};
			 
				result = result[field];
			}
		}
	}
	function _has(obj, loc) {
		return _get(obj,loc,true);
	}
	function _objToPaths(obj) {
		var  ret 		= {}
			,separator 	= ".";

		for (var key in obj) {
			var val = obj[key];
			if (val && (_.isObject(val) || _.isArray(val))&& !_.isEmpty(val)) {
				var obj2 = _objToPaths(val);
				for (var key2 in obj2) {
					ret[key + separator + key2] = obj2[key2];
				}
			}else 
				ret[key] = val;
		}
		return ret;
	}
	function _get(obj, loc, return_exists) {
		var separator 	= "."
			,fields 	= loc.split(separator)
			,result 	= obj;

		return_exists || (return_exists = false)
		for(var i = 0, n = fields.length; i < n; i++) {
			if(return_exists && !_.has(result, fields[i])) return false
			
			result = result[fields[i]];
			if(result == null && i < n - 1) 
				result = {};
			
			if(typeof result === 'undefined'){
				if (return_exists) return true;

				return result;
			}
		}
		if(return_exists) return true;
		return result;
	}
	function existsClean(data){
		_.each(data,function(v,i){
			if(_.isObject(v))
				if(_.has(v,"$exists"))
					if(!_.isBoolean(v["$exists"]))
						data[i]["$exists"] = v["$exists"] == "true" ? true : false;							
		});
		return data;
	}

 return LSQ;

}));