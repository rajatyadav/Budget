angular.module('BudgetApp')
		

		.controller('DashboardController', function ($rootScope, User, $scope, Member, Expence, Contree, $location, $filter) {
				$rootScope.PAGE = 'dashboard';
				User.get().success(function(result) {
					$rootScope.USERNAME = result;
				});
				$scope.members = Member.query();
				$scope.selectedMember = 'Select Member';
				$scope.rescentExpences = Expence.query().reverse();
				$scope.month = new Date();
				$scope.contree = Contree.query();

				$scope.Init = function () {
					$scope.expence = new Expence({
						member 				: ['', ''],
						expenceAmount	: '', 
						expenceDetail : '',
						timestamp : '',
						payStatus : false
					});

					var today = new Date();
					$scope.date = $filter('date')(today, "MMM dd, yyyy");
					$scope.expence.timestamp = $filter('date')(today, "yyyy-MM-dd");
				}

				$scope.getMothlyTotal = function () {
					var MothlyTotal = 0;
			    for(var i = 0; i < $scope.contree.length; i++){
			        var thisContree = $scope.contree[i];
			        MothlyTotal += parseInt(thisContree.monthContree[0]);
			    }
			    return MothlyTotal;
				};

				$scope.getMothlyRemaining = function () {
					var MothlyRemaining = 0;
			    for(var i = 0; i < $scope.contree.length; i++){
			        var thisContree = $scope.contree[i];
			        MothlyRemaining += parseInt(thisContree.contreeGiven[0]);
			    }
			    return MothlyRemaining;
				};

				$scope.show = function (user_id) {
					$location.url('/member/'+user_id);
				}

				$scope.Init();

				$scope.calendar = angular.element('.calendar');
				$scope.calendar.bind('changeDate', function(e){
	      		$scope.date = e.format('M dd, yyyy');
	      		$scope.expence.timestamp = e.format('yyyy-mm-dd');
	      		$scope.$apply();
	  		});

				$scope.submit = function () {
					$scope.successMsg = '';
					if($scope.newExpence.$invalid){
						$scope.$broadcast('newExpence:invalid');
						$scope.successMsg = 'Invalid Field / Empty Field';
					} else {
						$scope.expence.$save(function (result) {
							if (result) {
								$scope.newExpence.$setPristine();
								$scope.successMsg = 'Done';
								$scope.Init();
								$scope.selectedMember = 'Select Member';
								$scope.rescentExpences = Expence.query().reverse();
							}
						});
					}
				}
				
				$scope.selectMember = function (user_id, firstName, lastName) {
					$scope.selectedMember = firstName + ' ' + lastName;
					$scope.expence.member[0] = user_id;
					$scope.expence.member[1] = $scope.selectedMember;
				}

				$scope.selectDate = function () {
					var date = new Date();
					$scope.expence.timestamp = date;
				}
		})

		.controller('MembersController', function ($rootScope, $scope, Member, SelectedMemberDetail, Expence, SelectedExpence, SelectedMemberExpence, Contree, $location, $routeParams, $filter) {
				$rootScope.PAGE = "members";
				$scope.memberSelected = false;
				$scope.members = Member.query();

				// $scope.show = function (user_id) {
					
				// 	$scope.selectedMember = Member.get({ id: user_id });
				// 	$scope.getMonthContree = Contree.get({ id : user_id });
				// }

				$scope.ShowDetails = function () {
					$scope.amountToTake = 0;
					for(var i=0; i < $scope.rescentExpences.length; i++) {
						if( !$scope.rescentExpences[i].payStatus ) {
							$scope.amountToTake += $scope.rescentExpences[i].expenceAmount;
						}
					}
				}

				SelectedMemberExpence.get( $routeParams.id )
						.success(function (result) {
							$scope.rescentExpences = result;
							$scope.ShowDetails();
						})


				$scope.show = function (user_id, index) {
					$scope.memberSelected = true;
					$scope.selectedMember = $scope.members[index];
					$scope.getMonthContree = Contree.get({  id : user_id });
					// SelectedMemberDetail.get(user_id)
					// 	.success(function (result) {
					// 		$scope.selectedMember = result;
					// 	})
					SelectedMemberExpence.get( user_id )
						.success(function (result) {
							$scope.rescentExpences = result;
							$scope.ShowDetails();
						})
				}

				$scope.edit = function (user_id) {
					$location.url('/editMember/'+user_id);
				}


				// Working Here
				$scope.payStatusUpdate = function (id, index) {
					$scope.updatedExpence = new Expence({
						member 				: $scope.rescentExpences[index].member,
						expenceAmount	: $scope.rescentExpences[index].expenceAmount, 
						expenceDetail : $scope.rescentExpences[index].expenceDetail,
						timestamp 		: $filter('date')($scope.rescentExpences[index].timestamp, "yyyy-MM-dd"),
						payStatus 		: true
					});
					
					$scope.updatedExpence.$update({ id });
					
					SelectedMemberExpence.get( $routeParams.id )
					.success(function (result) {
						$scope.rescentExpences = result;
						$scope.ShowDetails()
					})
				}
		})

		.controller('MemberViewController', function ($rootScope, $scope, Member, SelectedMemberDetail, Expence, SelectedExpence, SelectedMemberExpence, Contree, $location, $routeParams, $filter) {
				$rootScope.PAGE = "members";
				$scope.members = Member.query();
				$scope.selectedMember = Member.get({ id: $routeParams.id });
				$scope.getMonthContree = Contree.get({ id : $routeParams.id });

				$scope.ShowDetails = function () {
					$scope.amountToTake = 0;
					for(var i=0; i < $scope.rescentExpences.length; i++) {
						if( !$scope.rescentExpences[i].payStatus ) {
							$scope.amountToTake += $scope.rescentExpences[i].expenceAmount;
						}
					}
				}

				SelectedMemberExpence.get( $routeParams.id )
						.success(function (result) {
							$scope.rescentExpences = result;
							$scope.ShowDetails();
						})


				$scope.show = function (user_id, index) {
					$scope.selectedMember = $scope.members[index];
					$scope.getMonthContree = Contree.get({  id : user_id });
					// SelectedMemberDetail.get(user_id)
					// 	.success(function (result) {
					// 		$scope.selectedMember = result;
					// 	})
					SelectedMemberExpence.get( user_id )
						.success(function (result) {
							$scope.rescentExpences = result;
							$scope.ShowDetails();
						})
				}

				$scope.edit = function (user_id) {
					$location.url('/editMember/'+user_id);
				}


				// Working Here
				$scope.payStatusUpdate = function (id, index) {
					$scope.updatedExpence = new Expence({
						member 				: $scope.rescentExpences[index].member,
						expenceAmount	: $scope.rescentExpences[index].expenceAmount, 
						expenceDetail : $scope.rescentExpences[index].expenceDetail,
						timestamp 		: $filter('date')($scope.rescentExpences[index].timestamp, "yyyy-MM-dd"),
						payStatus 		: true
					});
					
					$scope.updatedExpence.$update({ id });
					
					SelectedMemberExpence.get( $routeParams.id )
					.success(function (result) {
						$scope.rescentExpences = result;
						$scope.ShowDetails()
					})
				}
		})

		.controller('NewMemberController', function ($rootScope, $scope, Member, $location) {
				$rootScope.PAGE = "members";
				$scope.members = Member.query();
				$scope.edit = function (user_id) {
					$location.url('/editMember/'+user_id);
				}

				$scope.member = new Member({
					firstName: ['', 'text'],
					lastName:  ['', 'text'],
					email:     ['', 'email'],
					contact:   ['', 'number'],
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
		
		.controller('EditMemberController', function ($rootScope, $scope, Member, $location, $routeParams) {
				$rootScope.PAGE = "members";
				$scope.members = Member.query();
				$scope.member = Member.get({ id : $routeParams.id });

				$scope.edit = function (user_id) {
					$location.url('/editMember/'+user_id);
				}

				$scope.show = function (user_id) {
					$location.url('/member/'+user_id);
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
		})

		.controller('ContreeController', function ($rootScope, $scope, Contree, $location) {
				$rootScope.PAGE = "contree";
				$scope.month = new Date();
				$scope.contree = Contree.query();

				$scope.getMothlyTotal = function () {
					var MothlyTotal = 0;
			    for(var i = 0; i < $scope.contree.length; i++){
			        var thisContree = $scope.contree[i];
			        MothlyTotal += parseInt(thisContree.monthContree[0]);
			    }
			    return MothlyTotal;
				};

				$scope.getMothlyRemaining = function () {
					var MothlyRemaining = 0;
			    for(var i = 0; i < $scope.contree.length; i++){
			        var thisContree = $scope.contree[i];
			        MothlyRemaining += parseInt(thisContree.contreeGiven[0]);
			    }
			    return MothlyRemaining;
				};

				$scope.showContree = function (memberId) {
					$location.url('/contree/' + memberId);
				}
				$scope.showMember = function (memberId) {
					$location.url('/member/' + memberId);
				}
		})

		.controller('EditContreeController', function ($rootScope, $scope, Contree, $location, $routeParams) {
				$rootScope.PAGE = "contree";
				$scope.month = new Date();
				$scope.contree = Contree.query();
				Contree.get({ id : $routeParams.memberId }, function(result) {
					$scope.memberCon = result;
					$scope.LimitTo = result.monthContree[0];	
				});
				

				$scope.getMothlyTotal = function () {
					var MothlyTotal = 0;
			    for(var i = 0; i < $scope.contree.length; i++){
			        var thisContree = $scope.contree[i];
			        MothlyTotal += parseInt(thisContree.monthContree[0]);
			    }
			    return MothlyTotal;
				};

				$scope.getMothlyRemaining = function () {
					var MothlyRemaining = 0;
			    for(var i = 0; i < $scope.contree.length; i++){
			        var thisContree = $scope.contree[i];
			        MothlyRemaining += parseInt(thisContree.contreeGiven[0]);
			    }
			    return MothlyRemaining;
				};

				$scope.update = function () {
					if($scope.editMemberContree.$invalid){
						$scope.$broadcast('record:invalid');
					} else {
						
						$scope.memberCon.$update({ id : $scope.memberCon._id });
						$location.url('/contree');
					}
				};
		})

		.controller('NewContreeController', function ($rootScope, $scope, Member, Contree, $location) {
				$rootScope.PAGE = "contree";
				$scope.month = new Date();
				$scope.contree = Contree.query();
				$scope.memberCon = new Contree({
					member 			: ['', ''],
					monthContree: [0, 'number'],
					contreeGiven:  [0, 'number']
				});

				$scope.getMothlyTotal = function () {
					var MothlyTotal = 0;
			    for(var i = 0; i < $scope.contree.length; i++){
			        var thisContree = $scope.contree[i];
			        MothlyTotal += parseInt(thisContree.monthContree[0]);
			    }
			    return MothlyTotal;
				};

				$scope.getMothlyRemaining = function () {
					var MothlyRemaining = 0;
			    for(var i = 0; i < $scope.contree.length; i++){
			        var thisContree = $scope.contree[i];
			        MothlyRemaining += parseInt(thisContree.contreeGiven[0]);
			    }
			    return MothlyRemaining;
				};

				$scope.members = Member.query();
				$scope.selectedMember = 'Select Member';
				// $scope.remainingContree = ($scope.contree.monthContree[0] - $scope.contree.contreeGiven[0]);

				$scope.select = function (user_id, firstName, lastName) {
					$scope.selectedMember = firstName + ' ' + lastName;
					$scope.memberCon.member[0] = user_id;
					$scope.memberCon.member[1] = $scope.selectedMember;
				}

				$scope.save = function () {
					$scope.successMsg = '';
					if( $scope.memberContree.$invalid) {
						$scope.$broadcast('memberContree:invalid');
						$scope.successMsg = 'Invalid Field / Empty Field';
					} else {
						$scope.memberCon.$save();
						$location.url('/contree');
					}
				}
		})

		.controller('TodayExpenceController', function ($rootScope, $scope, Member, Expence, $location) {
				$rootScope.PAGE = "expences";
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

		.controller('MonthlyExpenceController', function ($rootScope, $scope, SelectedTimeExpence, $filter ) {
				$rootScope.PAGE = "expences";
				$scope.getExpences = function (date) {
					SelectedTimeExpence.get( date )
						.success(function (result) {
							$scope.allExpences = result;
						})
				}

				var today = new Date();
				$scope.date = $filter('date')(today, "mediumDate");
				// $scope.getExpences($filter('date')(today, "yyyy-MM-dd"));
				$scope.calendar = angular.element('.calendar');
				$scope.calendar.bind('changeDate', function(e){
	      		$scope.date = $filter('date')(e.format('yyyy-mm-dd'), "mediumDate");
	      		$scope.$apply();
	      		$scope.getExpences(e.format('yyyy-mm-dd'))
	  		});

		});
