angular.module('BudgetApp')
  .service('User', function ($http) {
    return {
      get: function () {
        return $http.get('/User');
      },
    }
  })

	.factory('Member', function ($resource) {
			return $resource('/api/members/:id', {id : '@id'},{
        	'update': { method:'PUT'}	
			});
	})
	.service('SelectedMemberDetail', function ($http) {
		return {
      get : function(id) {
        return $http.get('/api/members/'+ id);
      },
      create : function(id) {
        return $http.post('/api/members/'+ id);
      },
      delete : function(id) {
        return $http.delete('/api/members/'+ id);
      }
  	}
	})

  .factory('Expence', function ($resource) {
      return $resource('/api/expences/:id', {id : '@id'},{
          'update': { method:'PUT'},
      });
  })
  .service('SelectedExpence', function ($http) {
    return {
      get : function(id) {
        return $http.get('/api/expences/'+ id);
      }
    }
  })
  .service('SelectedMemberExpence', function ($http) {
    return {
      get : function(user_id) {
        return $http.get('/api/expences/'+ user_id);
      },
      delete : function(user_id) {
        return $http.delete('/api/expences/'+ user_id);
      }
    }
  })
	.service('SelectedTimeExpence', function ($http) {
		return {
      get : function(datetime) {
        return $http.get('/api/expencesTime/'+ datetime);	
      },
      delete : function(datetime) {
        return $http.delete('/api/expencesTime/'+ datetime);
      }
  	}
	})

  .factory('Contree', function ($resource) {
      return $resource('/api/contree/:id', {id : '@id'},{
          'update': { method:'PUT'},
          'get': { method:'GET'}
      });
  })

