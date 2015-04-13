angular.module('BudgetApp', ['ngRoute', 'ngResource', 'ngMessages'])
	.config(function ($routeProvider, $locationProvider) {
			$routeProvider
					.when('/dashboard', {
						controller: 'DashboardController',
						templateUrl: 'views/dashboard.html'
					})

					.when('/members', {
						controller: 'MembersController',
						templateUrl: 'views/members.html'
					})
					.when('/member/:id', {
						controller: 'MemberViewController',
						templateUrl: 'views/memberView.html'
					})
					.when('/newMember', {
						controller: 'NewMemberController',
						templateUrl: 'views/newMember.html'
					})
					.when('/editMember/:id', {
						controller: 'EditMemberController',
						templateUrl: 'views/editMember.html'
					})

					.when('/contree', {
						controller: 'ContreeController',
						templateUrl: 'views/contree.html'
					})

					.otherwise({
						redirectTo: '/dashboard'
					});
			$locationProvider.html5Mode(true);
	});