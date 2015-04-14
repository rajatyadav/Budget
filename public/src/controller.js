angular.module('BudgetApp')

		.controller('DashboardController', function ($scope, Member, Expence, $location) {
				$scope.members = Member.query();
				$scope.selectedMember = 'Select Member';
				$scope.rescentExpences = Expence.query().reverse();

				$scope.expence = new Expence({
					member 				: ['', ''], 
					expenceAmount	: '', 
					expenceDetail : ''
				});


				$scope.submit = function () {
					if($scope.newExpence.$invalid){
						$scope.$broadcast('expence:invalid');
						$scope.successMsg = 'Invalid Field';
					} else {
						$scope.expence.$save(function (result) {
							if (result) {
								$scope.successMsg = 'Done';
								$scope.newExpence.$setPristine();
								$scope.expence.member = ['',''];
								$scope.selectedMember = 'Select Member';
								$scope.rescentExpences = Expence.query().reverse();
							}
						});
					}
				}
				
				$scope.select = function (user_id, firstName, lastName) {
					$scope.selectedMember = firstName + ' ' + lastName;
					$scope.expence.member[0] = user_id;
					$scope.expence.member[1] = $scope.selectedMember;
				}
		})

		.controller('MembersController', function ($scope, Member, SelectedMemberDetail, SelectedMemberExpence, $location, $rootScope) {
				$rootScope.PAGE = "members";
				$scope.members = Member.query();

				$scope.show = function (user_id) {
					SelectedMemberDetail.get(user_id)
						.success(function (result) {
							$scope.selectedMember = result;
						})
					SelectedMemberExpence.get( user_id )
						.success(function (result) {
							$scope.rescentExpences = result;
						})
				}

				$scope.edit = function (user_id) {
					$location.url('/editMember/'+ user_id);
				}
		})

		.controller('MemberViewController', function ($scope, Member, $location, $routeParams) {
				$scope.members = Member.query();
				$scope.selectedMember = Member.get({ id: $routeParams.id });

				$scope.show = function (user_id) {
					$location.url('/member/'+user_id);
				}

				$scope.edit = function (user_id) {
					$location.url('/editMember/'+user_id);
				}
		})

		.controller('NewMemberController', function ($scope, Member, $location) {
				$scope.members = Member.query();
				$scope.edit = function (user_id) {
					$location.url('/editMember/'+user_id);
				}

				$scope.member = new Member({
					firstName: ['', 'text'],
					lastName:  ['', 'text'],
					email:     ['', 'email'],
					contact:   ['', 'tel'],
					address:   ['', 'text']
				});

				$scope.save = function(){
					if($scope.newMember.$invalid){
						$scope.$broadcast('record:invalid');
					} else {
						$scope.member.$save();
						$location.url('/members');
					}
				};
		})
		
		.controller('EditMemberController', function ($scope, Member, $location, $routeParams) {
				$scope.members = Member.query();
				$scope.member = Member.get({ id : $routeParams.id });

				$scope.edit = function (user_id) {
					$location.url('/editMember/'+user_id);
				}

				$scope.show = function (user_id) {
					$location.url('/members/');
					// $location.url('/member/'+user_id);
				}

				$scope.delete = function () {
					$scope.member.$delete({ id : $routeParams.id });
					$location.url('/members');
				};

				$scope.update = function () {
					if($scope.editMember.$invalid){
						$scope.$broadcast('record:invalid');
					} else {
						$scope.member.$update({ id : $routeParams.id });
						$location.url('/member/'+ $routeParams.id);
					}
				};
			
				// $scope.save = function(){
				// 	if($scope.editMember.$invalid){
				// 		$scope.$broadcast('record:invalid');
				// 	} else {
				// 		$scope.member.$save();
				// 		$location.url('/members');
				// 	}
				// };
		})

		.controller('ContreeController', function ($scope) {
			var a = []
		})

		.controller('TodayExpenceController', function ($scope, Member, Expence, $location) {
				$scope.members = Member.query();
				$scope.selectedMember = 'Select Member';
				$scope.rescentExpences = Expence.query().reverse();

				$scope.expence = new Expence({
					member 				: ['', ''], 
					expenceAmount	: '', 
					expenceDetail : ''
				});

				$scope.submit = function () {
					if($scope.newExpence.$invalid){
						$scope.$broadcast('expence:invalid');
						$scope.successMsg = 'Invalid Field';
					} else {
						$scope.expence.$save(function (result) {
							if (result) {
								$scope.successMsg = 'Done';
								$scope.newExpence.$setPristine();
								$scope.expence.member = ['',''];
								$scope.selectedMember = 'Select Member';
								$scope.rescentExpences = Expence.query().reverse();
							}
						});
					}
				}
				
				$scope.select = function (user_id, firstName, lastName) {
					$scope.selectedMember = firstName + ' ' + lastName;
					$scope.expence.member[0] = user_id;
					$scope.expence.member[1] = $scope.selectedMember;
				}
		})

		.controller('MonthlyExpenceController', function ($scope, SelectedTimeExpence, $filter ) {
			var today = new Date();
			$scope.date = $filter('date')(today, "mediumDate");
			$scope.calendar = angular.element('.calendar');
			$scope.calendar.bind('changeDate', function(e){
      		$scope.date = $filter('date')(e.format('yyyy-mm-dd'), "mediumDate");
      		$scope.$apply();
      		$scope.getExpences(e.format('yyyy-mm-dd'))
  		});

			$scope.getExpences = function (date) {
				SelectedTimeExpence.get( date )
					.success(function (result) {
						$scope.allExpences = result;
					})
			}
		});
