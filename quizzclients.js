/* Quiz clients */
var clients = [];

//var Client = funtion(name) {
// this.name = name; 
// this.session = null;
// this.ok = 0;
// this.error = 0;
//};
//
//Client.prototype.hello = function() {
//  console.log("Hello, I'm " + this.name);
//};

module.exports = {
  add: function(name) {
    // check if name exists
    clients.push(new Client(name));
    return client;
  },
        
  delete: function() {
    return "Hola";
  },
  findByName: function(name) {
  
  },
  findBySessionId: function() {
  
  },
  getAll: function() {
  
  }
};