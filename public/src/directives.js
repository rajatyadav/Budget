angular.module('BudgetApp')
	.value('FieldTypes', {
		text: ['Text', 'should be text'],
		email: ['Email', 'should be an email address'],
		number: ['Number', 'should be a number'],
		tel: ['Phone Number', 'should be phone number'],
	})
	.directive('formField', function ($timeout, FieldTypes) {
		return {
			restrict: 'EA',
			templateUrl: 'views/form-field.html',
			replace: true,
			scope: {
				record: '=',
				field: '@',
				live: '@',
				required: '@',
			},
			link: function ($scope, element, attr) {
				$scope.$on('record:invalid', function () {
					$scope[$scope.field].$setDirty();
				});

				$scope.types = FieldTypes;

				$scope.blurUpdate = function(field) {
					if ($scope.live !== 'false') {
						$scope.record.$update($routeParams, function (updatedRecord) {
							alert(updatedRecord);
							$scope.record[field][0] = updatedRecord;
						});
					}
				};
				var saveTimeout;
				$scope.update = function() {
					$timeout.cancel(saveTimeout);
					saveTimeout = $timeout($scope.blurUpdate, 1000);
				};
			}
		};
	});